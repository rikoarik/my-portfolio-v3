import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LoaderForm } from "@/components/admin/forms/LoaderForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function parseMetadata(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  return meta as Record<string, unknown>;
}

export default async function AdminLoaderPage() {
  const supabase = await createSupabaseServerClient();
  const { data: settings } = supabase
    ? await supabase.from("seo_settings").select("*").limit(1).maybeSingle()
    : { data: null };

  const metadata = parseMetadata(settings?.metadata);
  const config =
    metadata.loader_config && typeof metadata.loader_config === "object"
      ? (metadata.loader_config as Record<string, unknown>)
      : {};

  const messages = Array.isArray(config.messages)
    ? config.messages.filter((m): m is string => typeof m === "string").join("\n")
    : "Preparing scene\nLoading portfolio\nAlmost ready";

  const valueOf = (key: string, fallback: string) =>
    typeof config[key] === "string" && (config[key] as string).trim()
      ? (config[key] as string)
      : fallback;

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Loader Settings"
        description="Konfigurasi loader portfolio."
      />
      <LoaderForm
        initial={{
          label: valueOf("label", "Loading"),
          messages,
          text_animation: valueOf("text_animation", "slide-up"),
          background_color: valueOf("background_color", "#0a0a0a"),
          text_color: valueOf("text_color", "#ffffff"),
        }}
      />
    </div>
  );
}
