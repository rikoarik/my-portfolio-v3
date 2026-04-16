import { z } from "zod";

const publicationStatusSchema = z.enum(["draft", "published"]);
const landingThemePresetSchema = z.enum([
  "ember-night",
  "forest-hearth",
  "cocoa-slate",
  "dusk-mocha",
  "sage-mist",
  "linen-dawn",
  "rose-clay",
  "ocean-paper",
  "amber-fog",
  "pine-smoke",
  "tyrian-banana",
  "moss-cloud",
  "golden-parchment",
  "amber-mirage",
  "pistachio-espresso",
  "matcha-coal",
]);
const loaderAnimationSchema = z.enum([
  "fade",
  "slide-up",
  "pulse",
  "typewriter",
  "flip",
  "glitch",
]);

export function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseJsonOrLines(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const checked = z.array(z.string()).safeParse(parsed);
      if (checked.success) return checked.data.map((s) => s.trim()).filter(Boolean);
    } catch {
      return parseLines(value);
    }
  }
  return parseLines(value);
}

export function parseCaseStudyInput(value: string) {
  if (!value.trim()) return null;
  const parsed = JSON.parse(value) as unknown;
  return z
    .object({
      problem: z.string().min(1),
      constraints: z.array(z.string()),
      solution: z.string().min(1),
      results: z.array(z.string()),
    })
    .parse(parsed);
}

const nullableUrl = z.union([z.literal(""), z.string().url()]).transform((v) => (v ? v : null));

export const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title wajib"),
  subtitle: z.string().optional(),
  period_label: z.string().optional(),
  stack: z.string().optional(),
  bullets: z.string().optional(),
  tags: z.string().optional(),
  case_study: z.string().optional(),
  cover_url: nullableUrl.optional(),
  repo_url: nullableUrl.optional(),
  demo_url: nullableUrl.optional(),
  sort_order: z.coerce.number().int().default(0),
  featured: z.boolean().default(false),
  status: publicationStatusSchema.default("published"),
});

export const experienceFormSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Company wajib"),
  role: z.string().min(1, "Role wajib"),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  bullets: z.string().optional(),
  status: publicationStatusSchema.default("published"),
});

export const sectionFormSchema = z.object({
  id: z.string().optional(),
  section_key: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  about_headline: z.string().optional(),
  about_intro: z.string().optional(),
  meta: z.string().optional(),
  status: publicationStatusSchema.default("published"),
});

export const mediaFormSchema = z.object({
  id: z.string().optional(),
  bucket: z.string().min(1).default("portfolio-media"),
  path: z.string().min(1, "Path wajib"),
  public_url: z.string().url("Public URL tidak valid"),
  mime_type: z.string().optional(),
  size_bytes: z.coerce.number().int().optional(),
  width: z.coerce.number().int().optional(),
  height: z.coerce.number().int().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const seoSettingsFormSchema = z.object({
  id: z.string().optional(),
  landing_theme_preset: landingThemePresetSchema.default("ember-night"),
  site_title: z.string().min(1),
  title_template: z.string().min(1),
  default_description: z.string().optional(),
  default_og_image_url: nullableUrl.optional(),
  default_robots: z.string().optional(),
  metadata: z.string().optional(),
  status: publicationStatusSchema.default("published"),
});

export const seoPageFormSchema = z.object({
  id: z.string().optional(),
  page_key: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical_url: nullableUrl.optional(),
  og_image_url: nullableUrl.optional(),
  robots: z.string().optional(),
  metadata: z.string().optional(),
  status: publicationStatusSchema.default("published"),
});

export const loaderSettingsFormSchema = z.object({
  label: z.string().min(1).max(40),
  messages: z.string().min(1),
  text_animation: loaderAnimationSchema.default("slide-up"),
  background_color: z.string().min(1).max(40),
  text_color: z.string().min(1).max(40),
});
