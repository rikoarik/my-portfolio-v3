"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  buildBulkSuccess,
  buildDeleteSuccess,
  buildReorderSuccess,
  buildSaveSuccess,
  buildStatusSuccess,
  parseForm,
  readBoolean,
  resolveFormData,
  runAction,
  validateJsonFields,
} from "@/lib/admin/action-helpers";
import {
  type ActionResult,
  errorResult,
  successResult,
  zodValidationResult,
} from "@/lib/admin/action-result";
import { toggleStatus, type PubStatus } from "@/lib/admin/status";
import {
  educationFormSchema,
  experienceFormSchema,
  loaderSettingsFormSchema,
  mediaFormSchema,
  parseCaseStudyInput,
  parseAboutStatsInput,
  parseLines,
  parseJsonOrLines,
  parseNavItemsInput,
  parseProofStatsInput,
  projectFormSchema,
  sectionFormSchema,
  seoPageFormSchema,
  seoSettingsFormSchema,
  skillFormSchema,
  skillGroupFormSchema,
} from "@/lib/admin/validation";
import { parseLocale } from "@/i18n/locales";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function revalidatePortfolio() {
  updateTag("portfolio");
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase tidak dikonfigurasi");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Belum login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("Bukan admin");

  return { supabase, user };
}

type ReorderTable =
  | "projects"
  | "experiences"
  | "education"
  | "skill_groups";

const STATUS_TABLES = new Set([
  "projects",
  "experiences",
  "section_content",
  "seo_pages",
  "seo_settings",
]);

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateSiteProfile(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();

    const payload = {
      full_name: String(formData.get("full_name") ?? ""),
      title: String(formData.get("title") ?? ""),
      tagline: String(formData.get("tagline") ?? ""),
      location: String(formData.get("location") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      github_url: String(formData.get("github_url") ?? "") || null,
      linkedin_url: String(formData.get("linkedin_url") ?? "") || null,
      website_url: String(formData.get("website_url") ?? "") || null,
      cv_url: String(formData.get("cv_url") ?? "") || null,
      locale_ui: parseLocale(formData.get("locale_ui")),
      og_description: String(formData.get("og_description") ?? "") || null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("site_profile")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("site_profile")
        .update(payload)
        .eq("id", existing.id);
      if (error) return errorResult("Gagal menyimpan profil situs.");
    } else {
      const { error } = await supabase.from("site_profile").insert(payload);
      if (error) return errorResult("Gagal menyimpan profil situs.");
    }

    await revalidatePortfolio();
    return buildSaveSuccess("Memperbarui", "Profil situs", payload.full_name || "Profil");
  });
}

export async function upsertProject(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const jsonError = validateJsonFields(formData, [
      { name: "case_study", label: "Case study" },
    ]);
    if (jsonError) return jsonError;

    const parsed = parseForm(projectFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      title: String(formData.get("title") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? ""),
      period_label: String(formData.get("period_label") ?? ""),
      stack: String(formData.get("stack") ?? ""),
      bullets: String(formData.get("bullets") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      case_study: String(formData.get("case_study") ?? ""),
      cover_url: String(formData.get("cover_url") ?? "").trim(),
      repo_url: String(formData.get("repo_url") ?? ""),
      demo_url: String(formData.get("demo_url") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      featured: readBoolean(formData, "featured"),
      status: String(formData.get("status") ?? "published"),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    let case_study = null;
    if (input.case_study?.trim()) {
      try {
        case_study = parseCaseStudyInput(input.case_study);
      } catch {
        return zodValidationResult(
          { case_study: ["Case study: JSON tidak valid"] },
          formData,
        );
      }
    }

    const payload = {
      title: input.title,
      subtitle: input.subtitle || null,
      period_label: input.period_label || null,
      stack: parseJsonOrLines(input.stack ?? ""),
      bullets: parseJsonOrLines(input.bullets ?? ""),
      tags: parseJsonOrLines(input.tags ?? ""),
      case_study,
      cover_url: input.cover_url ?? null,
      repo_url: input.repo_url ?? null,
      demo_url: input.demo_url ?? null,
      sort_order: input.sort_order ?? 0,
      featured: input.featured,
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      const { error } = await supabase.from("projects").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui project.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Projects", input.title);
    }

    const { error } = await supabase.from("projects").insert(payload);
    if (error) return errorResult("Gagal membuat project.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Projects", input.title);
  });
}

export async function deleteProject(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Project").trim();
    if (!id) return errorResult("ID project tidak ditemukan.");
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Projects", title);
  });
}

export async function reorderProject(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return reorderRecord("projects", "Projects", prevOrFormData, maybeFormData);
}

export async function upsertExperience(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(experienceFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      company: String(formData.get("company") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      location: String(formData.get("location") ?? ""),
      employment_type: String(formData.get("employment_type") ?? ""),
      start_date: String(formData.get("start_date") ?? ""),
      end_date: String(formData.get("end_date") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      bullets: String(formData.get("bullets") ?? ""),
      status: String(formData.get("status") ?? "published"),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const payload = {
      company: input.company,
      role: input.role,
      location: input.location || null,
      employment_type: input.employment_type || null,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      sort_order: input.sort_order ?? 0,
      bullets: parseJsonOrLines(input.bullets ?? ""),
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const record = `${input.role} @ ${input.company}`;
    if (input.id) {
      const { error } = await supabase.from("experiences").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui experience.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Experiences", record);
    }

    const { error } = await supabase.from("experiences").insert(payload);
    if (error) return errorResult("Gagal membuat experience.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Experiences", record);
  });
}

export async function deleteExperience(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Experience").trim();
    if (!id) return errorResult("ID experience tidak ditemukan.");
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Experiences", title);
  });
}

export async function reorderExperience(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return reorderRecord("experiences", "Experiences", prevOrFormData, maybeFormData);
}

export async function updateGuestbookStatus(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const allowed = new Set(["pending", "approved", "hidden"]);
    if (!id) return errorResult("ID pesan tidak ditemukan.");
    if (!allowed.has(status)) return errorResult("Status tidak valid.");

    const { error } = await supabase
      .from("guestbook")
      .update({
        status,
        moderated_by: user.id,
        moderated_at: new Date().toISOString(),
        moderation_note: String(formData.get("moderation_note") ?? "").trim() || null,
      })
      .eq("id", id);
    if (error) return errorResult("Gagal memperbarui status guestbook.");
    await revalidatePortfolio();
    return successResult(`Memperbarui status guestbook menjadi ${status}`, "Guestbook");
  });
}

export async function deleteGuestbookMessage(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Pesan").trim();
    if (!id) return errorResult("ID pesan tidak ditemukan.");
    const { error } = await supabase.from("guestbook").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Guestbook", title);
  });
}

export async function upsertSectionContent(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const jsonError = validateJsonFields(formData, [{ name: "meta", label: "Meta" }]);
    if (jsonError) return jsonError;

    const parsed = parseForm(sectionFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      section_key: String(formData.get("section_key") ?? "").trim(),
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      body: String(formData.get("body") ?? ""),
      about_headline: String(formData.get("about_headline") ?? ""),
      about_intro: String(formData.get("about_intro") ?? ""),
      focus_title: String(formData.get("focus_title") ?? ""),
      focus_body: String(formData.get("focus_body") ?? ""),
      kicker: String(formData.get("kicker") ?? ""),
      talk_label: String(formData.get("talk_label") ?? ""),
      cv_label: String(formData.get("cv_label") ?? ""),
      marquee_items: String(formData.get("marquee_items") ?? ""),
      proof_stats: String(formData.get("proof_stats") ?? ""),
      about_stats: String(formData.get("about_stats") ?? ""),
      craft_title: String(formData.get("craft_title") ?? ""),
      craft_body: String(formData.get("craft_body") ?? ""),
      nav_items: String(formData.get("nav_items") ?? ""),
      meta: String(formData.get("meta") ?? ""),
      status: String(formData.get("status") ?? "published"),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    let parsedMeta: Record<string, unknown> = {};
    if (input.meta?.trim()) {
      try {
        parsedMeta = JSON.parse(input.meta) as Record<string, unknown>;
      } catch {
        return zodValidationResult({ meta: ["Meta: JSON tidak valid"] }, formData);
      }
    }

    const meta: Record<string, unknown> = { ...parsedMeta };
    const setOrDelete = (key: string, value: string | undefined) => {
      if (value?.trim()) meta[key] = value.trim();
      else delete meta[key];
    };
    setOrDelete("about_headline", input.about_headline);
    setOrDelete("about_intro", input.about_intro);
    setOrDelete("focus_title", input.focus_title);
    setOrDelete("focus_body", input.focus_body);
    setOrDelete("kicker", input.kicker);
    setOrDelete("talk_label", input.talk_label);
    setOrDelete("cv_label", input.cv_label);
    setOrDelete("craft_title", input.craft_title);
    setOrDelete("craft_body", input.craft_body);

    if (input.marquee_items?.trim()) meta.marquee_items = parseJsonOrLines(input.marquee_items);
    else delete meta.marquee_items;
    if (input.proof_stats?.trim()) meta.stats = parseProofStatsInput(input.proof_stats);
    else if (input.section_key === "proof") delete meta.stats;
    if (input.about_stats?.trim()) meta.stats = parseAboutStatsInput(input.about_stats);
    else if (input.section_key === "about") delete meta.stats;
    if (input.nav_items?.trim()) meta.items = parseNavItemsInput(input.nav_items);
    else if (input.section_key === "nav") delete meta.items;

    const payload = {
      section_key: input.section_key,
      title: input.title || null,
      subtitle: input.subtitle || null,
      body: input.body || null,
      meta,
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const record = input.title || input.section_key;
    if (input.id) {
      const { error } = await supabase.from("section_content").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui section.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Sections", record);
    }

    const { error } = await supabase.from("section_content").insert(payload);
    if (error) return errorResult("Gagal membuat section.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Sections", record);
  });
}

export async function deleteSectionContent(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Section").trim();
    if (!id) return errorResult("ID section tidak ditemukan.");
    const { error } = await supabase.from("section_content").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Sections", title);
  });
}

export async function upsertMediaAsset(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(mediaFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      bucket: String(formData.get("bucket") ?? "portfolio-media"),
      path: String(formData.get("path") ?? "").trim(),
      public_url: String(formData.get("public_url") ?? "").trim(),
      mime_type: String(formData.get("mime_type") ?? ""),
      size_bytes: Number(formData.get("size_bytes") ?? 0) || undefined,
      width: Number(formData.get("width") ?? 0) || undefined,
      height: Number(formData.get("height") ?? 0) || undefined,
      alt: String(formData.get("alt") ?? ""),
      caption: String(formData.get("caption") ?? ""),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const payload = {
      bucket: input.bucket,
      path: input.path,
      public_url: input.public_url,
      mime_type: input.mime_type || null,
      size_bytes: input.size_bytes ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt || null,
      caption: input.caption || null,
      uploaded_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const record = input.path;
    if (input.id) {
      const { error } = await supabase.from("media_assets").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui media.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Media", record);
    }

    const { error } = await supabase.from("media_assets").insert(payload);
    if (error) return errorResult("Gagal membuat media.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Media", record);
  });
}

export async function deleteMediaAsset(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Media").trim();
    if (!id) return errorResult("ID media tidak ditemukan.");
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Media", title);
  });
}

export async function upsertSeoSettings(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const jsonError = validateJsonFields(formData, [{ name: "metadata", label: "Metadata" }]);
    if (jsonError) return jsonError;

    const parsed = parseForm(seoSettingsFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      landing_theme_preset: String(formData.get("landing_theme_preset") ?? "ember-night").trim(),
      site_title: String(formData.get("site_title") ?? "").trim(),
      title_template: String(formData.get("title_template") ?? "%s — Portfolio").trim(),
      default_description: String(formData.get("default_description") ?? ""),
      default_og_image_url: String(formData.get("default_og_image_url") ?? "").trim(),
      default_robots: String(formData.get("default_robots") ?? ""),
      metadata: String(formData.get("metadata") ?? ""),
      status: String(formData.get("status") ?? "published"),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    let parsedMetadata: Record<string, unknown> = {};
    if (input.metadata?.trim()) {
      try {
        parsedMetadata = JSON.parse(input.metadata) as Record<string, unknown>;
      } catch {
        return zodValidationResult({ metadata: ["Metadata: JSON tidak valid"] }, formData);
      }
    }

    const payload = {
      landing_theme_preset: input.landing_theme_preset,
      site_title: input.site_title,
      title_template: input.title_template,
      default_description: input.default_description || null,
      default_og_image_url: input.default_og_image_url ?? null,
      default_robots: input.default_robots || null,
      metadata: parsedMetadata,
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const payloadWithoutThemePreset = {
      site_title: input.site_title,
      title_template: input.title_template,
      default_description: input.default_description || null,
      default_og_image_url: input.default_og_image_url ?? null,
      default_robots: input.default_robots || null,
      metadata: { ...parsedMetadata, landing_theme_preset: input.landing_theme_preset },
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const isMissingLandingThemePresetColumn = (message: string | undefined) =>
      typeof message === "string" && message.includes("landing_theme_preset");

    const updateSeoSettingsById = async (id: string) => {
      const firstTry = await supabase.from("seo_settings").update(payload).eq("id", id);
      if (!firstTry.error) return null;
      if (!isMissingLandingThemePresetColumn(firstTry.error.message)) return firstTry.error.message;
      const fallbackTry = await supabase
        .from("seo_settings")
        .update(payloadWithoutThemePreset)
        .eq("id", id);
      return fallbackTry.error?.message ?? null;
    };

    const insertSeoSettings = async () => {
      const firstTry = await supabase.from("seo_settings").insert(payload);
      if (!firstTry.error) return null;
      if (!isMissingLandingThemePresetColumn(firstTry.error.message)) return firstTry.error.message;
      const fallbackTry = await supabase.from("seo_settings").insert(payloadWithoutThemePreset);
      return fallbackTry.error?.message ?? null;
    };

    let err: string | null = null;
    if (input.id) {
      err = await updateSeoSettingsById(input.id);
    } else {
      const { data: existing } = await supabase.from("seo_settings").select("id").limit(1).maybeSingle();
      err = existing?.id ? await updateSeoSettingsById(existing.id) : await insertSeoSettings();
    }
    if (err) return errorResult("Gagal menyimpan pengaturan SEO.");
    await revalidatePortfolio();
    return buildSaveSuccess("Memperbarui", "SEO", input.site_title);
  });
}

export async function upsertSeoPage(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const jsonError = validateJsonFields(formData, [{ name: "metadata", label: "Metadata" }]);
    if (jsonError) return jsonError;

    const parsed = parseForm(seoPageFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      page_key: String(formData.get("page_key") ?? "").trim(),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      canonical_url: String(formData.get("canonical_url") ?? "").trim(),
      og_image_url: String(formData.get("og_image_url") ?? "").trim(),
      robots: String(formData.get("robots") ?? ""),
      metadata: String(formData.get("metadata") ?? ""),
      status: String(formData.get("status") ?? "published"),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    let metadata: unknown = {};
    if (input.metadata?.trim()) {
      try {
        metadata = JSON.parse(input.metadata);
      } catch {
        return zodValidationResult({ metadata: ["Metadata: JSON tidak valid"] }, formData);
      }
    }

    const payload = {
      page_key: input.page_key,
      title: input.title || null,
      description: input.description || null,
      canonical_url: input.canonical_url ?? null,
      og_image_url: input.og_image_url ?? null,
      robots: input.robots || null,
      metadata,
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const record = input.title || input.page_key;
    if (input.id) {
      const { error } = await supabase.from("seo_pages").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui halaman SEO.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "SEO", record);
    }

    const { error } = await supabase.from("seo_pages").insert(payload);
    if (error) return errorResult("Gagal membuat halaman SEO.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "SEO", record);
  });
}

export async function upsertLoaderSettings(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(loaderSettingsFormSchema, formData, {
      label: String(formData.get("label") ?? "").trim(),
      messages: String(formData.get("messages") ?? ""),
      text_animation: String(formData.get("text_animation") ?? "slide-up").trim(),
      background_color: String(formData.get("background_color") ?? "").trim(),
      text_color: String(formData.get("text_color") ?? "").trim(),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const loaderConfig = {
      label: input.label,
      messages: parseLines(input.messages),
      text_animation: input.text_animation,
      background_color: input.background_color,
      text_color: input.text_color,
    };

    const { data: existing } = await supabase.from("seo_settings").select("*").limit(1).maybeSingle();
    const existingMetadata =
      existing?.metadata && typeof existing.metadata === "object" && !Array.isArray(existing.metadata)
        ? (existing.metadata as Record<string, unknown>)
        : {};

    const payload = {
      ...(existing
        ? {}
        : {
            site_title: "Portfolio",
            title_template: "%s — Portfolio",
            default_description: null,
            default_og_image_url: null,
            default_robots: "index,follow",
            status: "published" as const,
          }),
      metadata: { ...existingMetadata, loader_config: loaderConfig },
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase.from("seo_settings").update(payload).eq("id", existing.id);
      if (error) return errorResult("Gagal menyimpan pengaturan loader.");
    } else {
      const { error } = await supabase.from("seo_settings").insert(payload);
      if (error) return errorResult("Gagal menyimpan pengaturan loader.");
    }

    await revalidatePortfolio();
    return buildSaveSuccess("Memperbarui", "Loader", input.label);
  });
}

export async function deleteSeoPage(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Halaman SEO").trim();
    if (!id) return errorResult("ID halaman SEO tidak ditemukan.");
    const { error } = await supabase.from("seo_pages").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("SEO", title);
  });
}

export async function upsertSkillGroup(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(skillGroupFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      name: String(formData.get("name") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const payload = {
      name: input.name,
      sort_order: input.sort_order ?? 0,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      const { error } = await supabase.from("skill_groups").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui skill group.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Skills", input.name);
    }

    const { error } = await supabase.from("skill_groups").insert(payload);
    if (error) return errorResult("Gagal membuat skill group.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Skills", input.name);
  });
}

export async function deleteSkillGroup(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Skill group").trim();
    if (!id) return errorResult("ID skill group tidak ditemukan.");
    const { error: skillsError } = await supabase.from("skills").delete().eq("group_id", id);
    if (skillsError) return errorResult(`Gagal menghapus ${title}.`);
    const { error } = await supabase.from("skill_groups").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Skills", title);
  });
}

export async function reorderSkillGroup(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return reorderRecord("skill_groups", "Skills", prevOrFormData, maybeFormData);
}

export async function upsertSkill(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(skillFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      group_id: String(formData.get("group_id") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const payload = {
      group_id: input.group_id,
      name: input.name,
      sort_order: input.sort_order ?? 0,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      const { error } = await supabase.from("skills").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui skill.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Skills", input.name);
    }

    const { error } = await supabase.from("skills").insert(payload);
    if (error) return errorResult("Gagal membuat skill.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Skills", input.name);
  });
}

export async function deleteSkill(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Skill").trim();
    if (!id) return errorResult("ID skill tidak ditemukan.");
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Skills", title);
  });
}

export async function upsertEducation(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const parsed = parseForm(educationFormSchema, formData, {
      id: String(formData.get("id") ?? "").trim() || undefined,
      institution: String(formData.get("institution") ?? "").trim(),
      degree: String(formData.get("degree") ?? "").trim(),
      field: String(formData.get("field") ?? ""),
      start_date: String(formData.get("start_date") ?? ""),
      end_date: String(formData.get("end_date") ?? ""),
      gpa: String(formData.get("gpa") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      bullets: String(formData.get("bullets") ?? ""),
    });
    if (!parsed.ok) return parsed.result;
    const input = parsed.data;

    const payload = {
      institution: input.institution,
      degree: input.degree,
      field: input.field || null,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      gpa: input.gpa || null,
      sort_order: input.sort_order ?? 0,
      bullets: parseJsonOrLines(input.bullets ?? ""),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const record = `${input.degree} — ${input.institution}`;
    if (input.id) {
      const { error } = await supabase.from("education").update(payload).eq("id", input.id);
      if (error) return errorResult("Gagal memperbarui education.");
      await revalidatePortfolio();
      return buildSaveSuccess("Memperbarui", "Education", record);
    }

    const { error } = await supabase.from("education").insert(payload);
    if (error) return errorResult("Gagal membuat education.");
    await revalidatePortfolio();
    return buildSaveSuccess("Membuat", "Education", record);
  });
}

export async function deleteEducation(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Education").trim();
    if (!id) return errorResult("ID education tidak ditemukan.");
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) return errorResult(`Gagal menghapus ${title}.`);
    await revalidatePortfolio();
    return buildDeleteSuccess("Education", title);
  });
}

export async function reorderEducation(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return reorderRecord("education", "Education", prevOrFormData, maybeFormData);
}

export async function toggleRecordStatus(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const table = String(formData.get("table") ?? "").trim();
    const module = String(formData.get("module") ?? table).trim();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "Record").trim();
    const currentStatus = String(formData.get("currentStatus") ?? "draft") as PubStatus;

    if (!STATUS_TABLES.has(table)) return errorResult("Modul tidak mendukung status.");
    if (!id) return errorResult("ID tidak ditemukan.");

    const newStatus = toggleStatus(currentStatus);
    const { error } = await supabase
      .from(table)
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return errorResult(`Gagal mengubah status ${title}.`);
    await revalidatePortfolio();
    return buildStatusSuccess(module, title, newStatus);
  });
}

export async function bulkAction(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();

    const module = String(formData.get("module") ?? "").trim();
    const table = String(formData.get("table") ?? "").trim();
    const op = String(formData.get("op") ?? "").trim() as "delete" | "publish" | "unpublish";
    const idsRaw = String(formData.get("ids") ?? "[]");

    let ids: string[] = [];
    try {
      ids = JSON.parse(idsRaw) as string[];
    } catch {
      return errorResult("Daftar ID tidak valid.");
    }
    if (!ids.length) return errorResult("Tidak ada item dipilih.");

    const succeeded: string[] = [];
    const failed: string[] = [];
    const now = new Date().toISOString();

    for (const id of ids) {
      try {
        if (op === "delete") {
          if (table === "skill_groups") {
            await supabase.from("skills").delete().eq("group_id", id);
          }
          const { error } = await supabase.from(table).delete().eq("id", id);
          if (error) failed.push(id);
          else succeeded.push(id);
        } else if (op === "publish" || op === "unpublish") {
          const status = op === "publish" ? "published" : "draft";
          const { error } = await supabase
            .from(table)
            .update({
              status,
              published_at: status === "published" ? now : null,
              updated_by: user.id,
              updated_at: now,
            })
            .eq("id", id);
          if (error) failed.push(id);
          else succeeded.push(id);
        } else {
          failed.push(id);
        }
      } catch {
        failed.push(id);
      }
    }

    await revalidatePortfolio();
    const opLabel =
      op === "delete" ? "Menghapus" : op === "publish" ? "Mempublish" : "Meng-unpublish";
    return {
      ...buildBulkSuccess(module, opLabel, succeeded.length, failed.length),
      data: { succeeded, failed },
    };
  });
}

async function reorderRecord(
  table: ReorderTable,
  module: string,
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): Promise<ActionResult> {
  return runAction(async () => {
    const formData = resolveFormData(prevOrFormData, maybeFormData);
    const { supabase, user } = await requireAdmin();
    const id = String(formData.get("id") ?? "").trim();
    const direction = String(formData.get("direction") ?? "").trim();

    if (!id) return errorResult("ID tidak ditemukan.");
    if (direction !== "up" && direction !== "down") return errorResult("Arah tidak valid.");

    const { data: rows, error: listError } = await supabase
      .from(table)
      .select("id, sort_order")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (listError) return errorResult("Gagal memuat daftar untuk reorder.");

    const ordered = rows ?? [];
    const currentIndex = ordered.findIndex((row) => row.id === id);
    if (currentIndex < 0) return errorResult("Item tidak ditemukan.");

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const current = ordered[currentIndex];
    const target = ordered[targetIndex];
    if (!target) return buildReorderSuccess(module);

    const now = new Date().toISOString();
    const currentSortOrder = current.sort_order ?? 0;
    const targetSortOrder = target.sort_order ?? 0;

    const { error: currentError } = await supabase
      .from(table)
      .update({ sort_order: targetSortOrder, updated_by: user.id, updated_at: now })
      .eq("id", current.id);
    if (currentError) return errorResult("Gagal mengubah urutan.");

    const { error: targetError } = await supabase
      .from(table)
      .update({ sort_order: currentSortOrder, updated_by: user.id, updated_at: now })
      .eq("id", target.id);
    if (targetError) return errorResult("Gagal mengubah urutan.");

    await revalidatePortfolio();
    return buildReorderSuccess(module);
  });
}
