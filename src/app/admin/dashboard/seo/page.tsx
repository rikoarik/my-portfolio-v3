import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeoPagesList } from "@/components/admin/SeoPagesList";
import { SeoPageCreateForm, SeoSettingsForm } from "@/components/admin/forms/SeoForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SeoSettingsRow = {
  id: string;
  landing_theme_preset?: string;
  site_title: string;
  title_template: string;
  default_description: string | null;
  default_og_image_url: string | null;
  default_robots: string | null;
  metadata: unknown;
  status: "draft" | "published";
};

type SeoPageRow = {
  id: string;
  page_key: string;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  robots: string | null;
  metadata: unknown;
  status: "draft" | "published";
};

function parseMetadata(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  return meta as Record<string, unknown>;
}

export default async function AdminSeoPage() {
  const supabase = await createSupabaseServerClient();
  const { data: settings } = supabase
    ? await supabase.from("seo_settings").select("*").limit(1).maybeSingle()
    : { data: null };
  const { data: pages } = supabase
    ? await supabase.from("seo_pages").select("*").order("page_key", { ascending: true })
    : { data: [] };
  const setting = settings as SeoSettingsRow | null;
  const settingMetadata = parseMetadata(setting?.metadata);
  const currentLandingThemePreset =
    setting?.landing_theme_preset ??
    (typeof settingMetadata.landing_theme_preset === "string"
      ? settingMetadata.landing_theme_preset
      : "ember-night");
  const rows = (pages as SeoPageRow[]) ?? [];

  return (
    <div className="space-y-3">
      <AdminPageHeader title="SEO" description="Global metadata dan override per halaman." />
      <SeoSettingsForm setting={setting} currentLandingThemePreset={currentLandingThemePreset} />
      <SeoPageCreateForm />
      <SeoPagesList rows={rows} />
    </div>
  );
}
