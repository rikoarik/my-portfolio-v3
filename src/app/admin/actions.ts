"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  experienceFormSchema,
  loaderSettingsFormSchema,
  mediaFormSchema,
  parseCaseStudyInput,
  parseLines,
  parseJsonOrLines,
  projectFormSchema,
  sectionFormSchema,
  seoPageFormSchema,
  seoSettingsFormSchema,
} from "@/lib/admin/validation";
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

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateSiteProfile(formData: FormData) {
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
    locale_ui: "id",
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
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("site_profile").insert(payload);
    if (error) throw new Error(error.message);
  }

  await revalidatePortfolio();
  redirect("/admin/dashboard/profile?saved=1");
}

export async function upsertProject(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = projectFormSchema.parse({
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
    featured: Boolean(formData.get("featured")),
    status: String(formData.get("status") ?? "published"),
  });

  let case_study = null;
  if (input.case_study?.trim()) {
    case_study = parseCaseStudyInput(input.case_study);
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
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }

  await revalidatePortfolio();
  redirect("/admin/dashboard/projects?saved=1");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await revalidatePortfolio();
  redirect("/admin/dashboard/projects?deleted=1");
}

export async function reorderProject(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "").trim();

  if (!id) throw new Error("Missing id");
  if (direction !== "up" && direction !== "down") {
    throw new Error("Direction invalid");
  }

  const { data: rows, error: listError } = await supabase
    .from("projects")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (listError) throw new Error(listError.message);

  const ordered = rows ?? [];
  const currentIndex = ordered.findIndex((row) => row.id === id);
  if (currentIndex < 0) throw new Error("Project tidak ditemukan");

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const current = ordered[currentIndex];
  const target = ordered[targetIndex];

  if (!target) {
    redirect("/admin/dashboard/projects");
  }

  const now = new Date().toISOString();
  const currentSortOrder = current.sort_order ?? 0;
  const targetSortOrder = target.sort_order ?? 0;

  const { error: currentError } = await supabase
    .from("projects")
    .update({
      sort_order: targetSortOrder,
      updated_by: user.id,
      updated_at: now,
    })
    .eq("id", current.id);
  if (currentError) throw new Error(currentError.message);

  const { error: targetError } = await supabase
    .from("projects")
    .update({
      sort_order: currentSortOrder,
      updated_by: user.id,
      updated_at: now,
    })
    .eq("id", target.id);
  if (targetError) throw new Error(targetError.message);

  await revalidatePortfolio();
  redirect("/admin/dashboard/projects?moved=1");
}

export async function upsertExperience(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = experienceFormSchema.parse({
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

  if (input.id) {
    const { error } = await supabase
      .from("experiences")
      .update(payload)
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("experiences").insert(payload);
    if (error) throw new Error(error.message);
  }

  await revalidatePortfolio();
  redirect("/admin/dashboard/experiences?saved=1");
}

export async function deleteExperience(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await revalidatePortfolio();
  redirect("/admin/dashboard/experiences?deleted=1");
}

export async function reorderExperience(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "").trim();

  if (!id) throw new Error("Missing id");
  if (direction !== "up" && direction !== "down") {
    throw new Error("Direction invalid");
  }

  const { data: rows, error: listError } = await supabase
    .from("experiences")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (listError) throw new Error(listError.message);

  const ordered = rows ?? [];
  const currentIndex = ordered.findIndex((row) => row.id === id);
  if (currentIndex < 0) throw new Error("Experience tidak ditemukan");

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const current = ordered[currentIndex];
  const target = ordered[targetIndex];

  if (!target) {
    redirect("/admin/dashboard/experiences");
  }

  const now = new Date().toISOString();
  const currentSortOrder = current.sort_order ?? 0;
  const targetSortOrder = target.sort_order ?? 0;

  const { error: currentError } = await supabase
    .from("experiences")
    .update({
      sort_order: targetSortOrder,
      updated_by: user.id,
      updated_at: now,
    })
    .eq("id", current.id);
  if (currentError) throw new Error(currentError.message);

  const { error: targetError } = await supabase
    .from("experiences")
    .update({
      sort_order: currentSortOrder,
      updated_by: user.id,
      updated_at: now,
    })
    .eq("id", target.id);
  if (targetError) throw new Error(targetError.message);

  await revalidatePortfolio();
  redirect("/admin/dashboard/experiences?moved=1");
}

export async function updateGuestbookStatus(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const allowed = new Set(["pending", "approved", "hidden"]);
  if (!id) throw new Error("Missing id");
  if (!allowed.has(status)) throw new Error("Status invalid");

  const { error } = await supabase
    .from("guestbook")
    .update({
      status,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
      moderation_note: String(formData.get("moderation_note") ?? "").trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await revalidatePortfolio();
  redirect("/admin/dashboard/guestbook?saved=1");
}

export async function deleteGuestbookMessage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");

  const { error } = await supabase.from("guestbook").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await revalidatePortfolio();
  redirect("/admin/dashboard/guestbook?deleted=1");
}

export async function upsertSectionContent(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = sectionFormSchema.parse({
    id: String(formData.get("id") ?? "").trim() || undefined,
    section_key: String(formData.get("section_key") ?? "").trim(),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    body: String(formData.get("body") ?? ""),
    about_headline: String(formData.get("about_headline") ?? ""),
    about_intro: String(formData.get("about_intro") ?? ""),
    focus_title: String(formData.get("focus_title") ?? ""),
    focus_body: String(formData.get("focus_body") ?? ""),
    meta: String(formData.get("meta") ?? ""),
    status: String(formData.get("status") ?? "published"),
  });
  const parsedMeta =
    input.meta?.trim() ? (JSON.parse(input.meta) as Record<string, unknown>) : {};
  const meta: Record<string, unknown> = { ...parsedMeta };
  if (input.about_headline?.trim()) {
    meta.about_headline = input.about_headline.trim();
  } else {
    delete meta.about_headline;
  }
  if (input.about_intro?.trim()) {
    meta.about_intro = input.about_intro.trim();
  } else {
    delete meta.about_intro;
  }
  if (input.focus_title?.trim()) {
    meta.focus_title = input.focus_title.trim();
  } else {
    delete meta.focus_title;
  }
  if (input.focus_body?.trim()) {
    meta.focus_body = input.focus_body.trim();
  } else {
    delete meta.focus_body;
  }
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
  if (input.id) {
    const { error } = await supabase.from("section_content").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("section_content").insert(payload);
    if (error) throw new Error(error.message);
  }
  await revalidatePortfolio();
  redirect("/admin/dashboard/sections?saved=1");
}

export async function deleteSectionContent(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("section_content").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await revalidatePortfolio();
  redirect("/admin/dashboard/sections?deleted=1");
}

export async function upsertMediaAsset(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = mediaFormSchema.parse({
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
  if (input.id) {
    const { error } = await supabase.from("media_assets").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("media_assets").insert(payload);
    if (error) throw new Error(error.message);
  }
  await revalidatePortfolio();
  redirect("/admin/dashboard/media?saved=1");
}

export async function deleteMediaAsset(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await revalidatePortfolio();
  redirect("/admin/dashboard/media?deleted=1");
}

export async function upsertSeoSettings(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = seoSettingsFormSchema.parse({
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
  const parsedMetadata =
    input.metadata?.trim() ? (JSON.parse(input.metadata) as Record<string, unknown>) : {};
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
    metadata: {
      ...parsedMetadata,
      landing_theme_preset: input.landing_theme_preset,
    },
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };

  const isMissingLandingThemePresetColumn = (message: string | undefined) =>
    typeof message === "string" && message.includes("landing_theme_preset");

  const updateSeoSettingsById = async (id: string) => {
    const firstTry = await supabase.from("seo_settings").update(payload).eq("id", id);
    if (!firstTry.error) return;
    if (!isMissingLandingThemePresetColumn(firstTry.error.message)) {
      throw new Error(firstTry.error.message);
    }
    const fallbackTry = await supabase
      .from("seo_settings")
      .update(payloadWithoutThemePreset)
      .eq("id", id);
    if (fallbackTry.error) throw new Error(fallbackTry.error.message);
  };

  const insertSeoSettings = async () => {
    const firstTry = await supabase.from("seo_settings").insert(payload);
    if (!firstTry.error) return;
    if (!isMissingLandingThemePresetColumn(firstTry.error.message)) {
      throw new Error(firstTry.error.message);
    }
    const fallbackTry = await supabase.from("seo_settings").insert(payloadWithoutThemePreset);
    if (fallbackTry.error) throw new Error(fallbackTry.error.message);
  };

  if (input.id) {
    await updateSeoSettingsById(input.id);
  } else {
    const { data: existing } = await supabase.from("seo_settings").select("id").limit(1).maybeSingle();
    if (existing?.id) {
      await updateSeoSettingsById(existing.id);
    } else {
      await insertSeoSettings();
    }
  }
  await revalidatePortfolio();
  redirect("/admin/dashboard/seo?saved=1");
}

export async function upsertSeoPage(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = seoPageFormSchema.parse({
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
  const payload = {
    page_key: input.page_key,
    title: input.title || null,
    description: input.description || null,
    canonical_url: input.canonical_url ?? null,
    og_image_url: input.og_image_url ?? null,
    robots: input.robots || null,
    metadata: input.metadata?.trim() ? (JSON.parse(input.metadata) as unknown) : {},
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from("seo_pages").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("seo_pages").insert(payload);
    if (error) throw new Error(error.message);
  }
  await revalidatePortfolio();
  redirect("/admin/dashboard/seo?saved=1");
}

export async function upsertLoaderSettings(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = loaderSettingsFormSchema.parse({
    label: String(formData.get("label") ?? "").trim(),
    messages: String(formData.get("messages") ?? ""),
    text_animation: String(formData.get("text_animation") ?? "slide-up").trim(),
    background_color: String(formData.get("background_color") ?? "").trim(),
    text_color: String(formData.get("text_color") ?? "").trim(),
  });

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
    metadata: {
      ...existingMetadata,
      loader_config: loaderConfig,
    },
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase.from("seo_settings").update(payload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("seo_settings").insert(payload);
    if (error) throw new Error(error.message);
  }

  await revalidatePortfolio();
  redirect("/admin/dashboard/loader?saved=1");
}

export async function deleteSeoPage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("seo_pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await revalidatePortfolio();
  redirect("/admin/dashboard/seo?deleted=1");
}
