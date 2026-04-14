import { unstable_cache } from "next/cache";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createAnonServerClient } from "@/lib/supabase/anon";
import { parseLandingThemePreset } from "@/lib/theme/landing-theme";
import type {
  Education,
  Experience,
  GitHubContributionSummary,
  GuestMessage,
  MediaAsset,
  PortfolioPayload,
  Project,
  SectionContent,
  SeoPage,
  SeoSettings,
  SiteProfile,
  SkillGroup,
} from "@/types/portfolio";

function parseStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function parseStringArrayOrNull(v: unknown): string[] | null {
  const arr = parseStringArray(v);
  return arr.length ? arr : null;
}

function parseObject(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function parseStatus(v: unknown): "draft" | "published" {
  return v === "draft" ? "draft" : "published";
}

function parseGithubUsername(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const text = value.trim();
  if (!text.includes("github.com")) {
    const raw = text.replace(/^@/, "");
    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(raw) ? raw : null;
  }
  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);
    const username = parts[0]?.replace(/^@/, "") ?? "";
    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username) ? username : null;
  } catch {
    return null;
  }
}

function contributionLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || maxCount <= 0) return 0;
  const ratio = count / maxCount;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function buildFallbackContributions(username: string): GitHubContributionSummary {
  const weeks = Array.from({ length: 24 }).map((_, weekIdx) => {
    const days = Array.from({ length: 7 }).map((__, dayIdx) => {
      const count = Math.max(0, Math.floor(Math.sin((weekIdx + dayIdx) * 0.5) * 4 + 5) - (dayIdx === 0 ? 2 : 0));
      const date = new Date(Date.now() - (24 - weekIdx) * 7 * 86400000 + dayIdx * 86400000)
        .toISOString()
        .slice(0, 10);
      return { date, count, level: 0 as 0 | 1 | 2 | 3 | 4 };
    });
    return { weekStart: days[0]?.date ?? "", days };
  });
  const maxCount = Math.max(...weeks.flatMap((w) => w.days.map((d) => d.count)), 0);
  for (const week of weeks) {
    for (const day of week.days) {
      day.level = contributionLevel(day.count, maxCount);
    }
  }
  return {
    username,
    totalContributions: weeks.flatMap((w) => w.days).reduce((sum, day) => sum + day.count, 0),
    maxCount,
    weeks,
    fetchedAt: new Date().toISOString(),
    isFallback: true,
  };
}

async function fetchGithubContributions(username: string): Promise<GitHubContributionSummary | null> {
  const now = new Date();
  const from = new Date(now);
  from.setFullYear(from.getFullYear() - 1);
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${from
    .toISOString()
    .slice(0, 10)}&to=${now.toISOString().slice(0, 10)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "portfolio-site" },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return buildFallbackContributions(username);
    const html = await res.text();
    const matches = Array.from(
      html.matchAll(/data-date="([^"]+)"[^>]*data-count="(\d+)"/g),
      (m) => ({ date: m[1], count: Number(m[2] ?? 0) || 0 }),
    ).sort((a, b) => a.date.localeCompare(b.date));

    if (!matches.length) return buildFallbackContributions(username);
    const maxCount = Math.max(...matches.map((m) => m.count), 0);

    const weeks: GitHubContributionSummary["weeks"] = [];
    for (let i = 0; i < matches.length; i += 7) {
      const chunk = matches.slice(i, i + 7).map((m) => ({
        date: m.date,
        count: m.count,
        level: contributionLevel(m.count, maxCount),
      }));
      if (!chunk.length) continue;
      weeks.push({
        weekStart: chunk[0]?.date ?? "",
        days: chunk,
      });
    }

    const trimmedWeeks = weeks.slice(-24);
    return {
      username,
      totalContributions: matches.reduce((sum, m) => sum + m.count, 0),
      maxCount,
      weeks: trimmedWeeks,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return buildFallbackContributions(username);
  }
}

function parseCaseStudy(v: unknown): Project["case_study"] {
  const o = parseObject(v);
  if (!o) return null;
  const problem = o.problem;
  const constraints = o.constraints;
  const solution = o.solution;
  const results = o.results;
  if (typeof problem !== "string" || !problem.trim()) return null;
  if (typeof solution !== "string" || !solution.trim()) return null;
  if (!Array.isArray(constraints) || !constraints.every((x) => typeof x === "string")) {
    return null;
  }
  if (!Array.isArray(results) || !results.every((x) => typeof x === "string")) {
    return null;
  }
  return {
    problem: problem.trim(),
    constraints: constraints.map((s) => s.trim()).filter(Boolean),
    solution: solution.trim(),
    results: results.map((s) => s.trim()).filter(Boolean),
  };
}

async function fetchFromSupabase(): Promise<PortfolioPayload | null> {
  const supabase = createAnonServerClient();
  if (!supabase) return null;

  const { data: profileRow, error: pErr } = await supabase
    .from("site_profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (pErr || !profileRow) return null;

  const profile: SiteProfile = {
    full_name: profileRow.full_name,
    title: profileRow.title,
    tagline: profileRow.tagline ?? "",
    location: profileRow.location ?? "",
    email: profileRow.email ?? "",
    phone: profileRow.phone,
    github_url: profileRow.github_url,
    linkedin_url: profileRow.linkedin_url,
    website_url: profileRow.website_url,
    cv_url: profileRow.cv_url,
    locale_ui: profileRow.locale_ui ?? "id",
    og_description: profileRow.og_description,
  };

  const { data: expRows } = await supabase
    .from("experiences")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const experiences: Experience[] = (expRows ?? []).map((r) => ({
    id: r.id,
    company: r.company,
    role: r.role,
    location: r.location,
    employment_type: r.employment_type,
    start_date: r.start_date,
    end_date: r.end_date,
    sort_order: r.sort_order ?? 0,
    bullets: parseStringArray(r.bullets),
    status: parseStatus(r.status),
    published_at: typeof r.published_at === "string" ? r.published_at : null,
  }));

  const { data: projRows } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const projects: Project[] = (projRows ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    const cover = row.cover_url;
    return {
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      period_label: r.period_label,
      stack: parseStringArray(r.stack),
      bullets: parseStringArray(r.bullets),
      tags: parseStringArrayOrNull(r.tags) ?? undefined,
      case_study: parseCaseStudy(r.case_study),
      repo_url: r.repo_url,
      demo_url: r.demo_url,
      sort_order: r.sort_order ?? 0,
      featured: Boolean(r.featured),
      status: parseStatus(r.status),
      published_at: typeof r.published_at === "string" ? r.published_at : null,
      cover_url: typeof cover === "string" && cover.trim() ? cover.trim() : null,
    };
  });

  const { data: groupRows } = await supabase
    .from("skill_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: skillRows } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  const skillsByGroup = new Map<string, { id: string; name: string; sort_order: number }[]>();
  for (const s of skillRows ?? []) {
    const gid = s.group_id as string;
    const list = skillsByGroup.get(gid) ?? [];
    list.push({ id: s.id, name: s.name, sort_order: s.sort_order ?? 0 });
    skillsByGroup.set(gid, list);
  }

  const skill_groups: SkillGroup[] = (groupRows ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    sort_order: g.sort_order ?? 0,
    skills: (skillsByGroup.get(g.id) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  }));

  const { data: eduRows } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  const education: Education[] = (eduRows ?? []).map((r) => ({
    id: r.id,
    institution: r.institution,
    degree: r.degree,
    field: r.field,
    start_date: r.start_date,
    end_date: r.end_date,
    gpa: r.gpa,
    sort_order: r.sort_order ?? 0,
    bullets: parseStringArray(r.bullets),
  }));

  const { data: guestRows } = await supabase
    .from("guestbook")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const guestbook: GuestMessage[] = (guestRows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    message: r.message,
    created_at: r.created_at,
    status: r.status ?? "approved",
    moderated_by: r.moderated_by ?? null,
    moderated_at: r.moderated_at ?? null,
    moderation_note: r.moderation_note ?? null,
  }));

  const { data: sectionRows } = await supabase
    .from("section_content")
    .select("*")
    .eq("status", "published")
    .order("section_key", { ascending: true });

  const sections: SectionContent[] = (sectionRows ?? []).map((r) => ({
    id: r.id,
    section_key: r.section_key,
    title: r.title ?? null,
    subtitle: r.subtitle ?? null,
    body: r.body ?? null,
    meta: parseObject(r.meta) ?? {},
    status: parseStatus(r.status),
    published_at: r.published_at ?? null,
  }));

  const heroSection = sections.find((s) => s.section_key === "hero");
  const githubUsername =
    parseGithubUsername(profile.github_url) ||
    (typeof heroSection?.meta?.github_username === "string"
      ? parseGithubUsername(heroSection.meta.github_username)
      : null);
  const github_contributions = githubUsername
    ? await fetchGithubContributions(githubUsername)
    : null;

  const { data: mediaRows } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  const media_assets: MediaAsset[] = (mediaRows ?? []).map((r) => ({
    id: r.id,
    bucket: r.bucket,
    path: r.path,
    public_url: r.public_url,
    mime_type: r.mime_type ?? null,
    size_bytes: typeof r.size_bytes === "number" ? r.size_bytes : null,
    width: typeof r.width === "number" ? r.width : null,
    height: typeof r.height === "number" ? r.height : null,
    alt: r.alt ?? null,
    caption: r.caption ?? null,
    created_at: r.created_at,
  }));

  const { data: seoSettingsRow } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("status", "published")
    .limit(1)
    .maybeSingle();

  const seoSettings: SeoSettings | null = seoSettingsRow
    ? (() => {
        const metadata = parseObject(seoSettingsRow.metadata) ?? {};
        const rawThemePreset =
          typeof seoSettingsRow.landing_theme_preset === "string"
            ? seoSettingsRow.landing_theme_preset
            : metadata.landing_theme_preset;
        return {
        landing_theme_preset: parseLandingThemePreset(rawThemePreset),
        site_title: seoSettingsRow.site_title,
        title_template: seoSettingsRow.title_template ?? "%s — Portfolio",
        default_description: seoSettingsRow.default_description ?? null,
        default_og_image_url: seoSettingsRow.default_og_image_url ?? null,
        default_robots: seoSettingsRow.default_robots ?? null,
        metadata,
        status: parseStatus(seoSettingsRow.status),
      };
      })()
    : null;

  const { data: seoPageRows } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("status", "published")
    .order("page_key", { ascending: true });

  const seoPages: SeoPage[] = (seoPageRows ?? []).map((r) => ({
    id: r.id,
    page_key: r.page_key,
    title: r.title ?? null,
    description: r.description ?? null,
    canonical_url: r.canonical_url ?? null,
    og_image_url: r.og_image_url ?? null,
    robots: r.robots ?? null,
    metadata: parseObject(r.metadata) ?? {},
    status: parseStatus(r.status),
  }));

  return {
    source: "supabase",
    profile,
    experiences,
    projects,
    skill_groups,
    education,
    guestbook,
    sections,
    media_assets,
    seo: {
      settings: seoSettings,
      pages: seoPages,
    },
    github_contributions,
  };
}

export async function getPortfolio(): Promise<PortfolioPayload> {
  const cached = unstable_cache(
    async () => {
      const fromDb = await fetchFromSupabase();
      if (fromDb) return fromDb;
      return { ...PORTFOLIO_SEED, source: "seed" as const };
    },
    ["portfolio-v2"],
    { tags: ["portfolio"], revalidate: 3600 },
  );
  return cached();
}
