import { unstable_cache } from "next/cache";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createAnonServerClient } from "@/lib/supabase/anon";
import type {
  Education,
  Experience,
  PortfolioPayload,
  Project,
  SiteProfile,
  SkillGroup,
} from "@/types/portfolio";

function parseStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
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
  }));

  const { data: projRows } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const projects: Project[] = (projRows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    period_label: r.period_label,
    stack: parseStringArray(r.stack),
    bullets: parseStringArray(r.bullets),
    repo_url: r.repo_url,
    demo_url: r.demo_url,
    sort_order: r.sort_order ?? 0,
    featured: Boolean(r.featured),
  }));

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

  return {
    source: "supabase",
    profile,
    experiences,
    projects,
    skill_groups,
    education,
  };
}

export async function getPortfolio(): Promise<PortfolioPayload> {
  const cached = unstable_cache(
    async () => {
      const fromDb = await fetchFromSupabase();
      if (fromDb) return fromDb;
      return { ...PORTFOLIO_SEED, source: "seed" as const };
    },
    ["portfolio-v1"],
    { tags: ["portfolio"], revalidate: 3600 },
  );
  return cached();
}
