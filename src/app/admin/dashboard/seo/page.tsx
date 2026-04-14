import { deleteSeoPage, upsertSeoPage, upsertSeoSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SeoSettingsRow = {
  id: string;
  landing_theme_preset:
    | "ember-night"
    | "forest-hearth"
    | "cocoa-slate"
    | "dusk-mocha"
    | "sage-mist"
    | "linen-dawn"
    | "rose-clay"
    | "ocean-paper"
    | "amber-fog"
    | "pine-smoke";
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

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Global metadata dan override per halaman.</p>
        {sp.saved ? <p className="mt-2 text-sm text-[var(--primary)]">Tersimpan.</p> : null}
        {sp.deleted ? <p className="mt-2 text-sm text-[var(--primary)]">Terhapus.</p> : null}
      </div>

      <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
        <CardHeader>
          <CardTitle>SEO global</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertSeoSettings} className="grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="id" value={setting?.id ?? ""} />
            <label className="grid gap-1 text-xs text-[var(--muted-foreground)] sm:col-span-2">
              Landing color preset
              <select
                name="landing_theme_preset"
                defaultValue={currentLandingThemePreset}
                className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--foreground)]"
              >
                <option value="ember-night">Ember Night (warm dark)</option>
                <option value="forest-hearth">Forest Hearth (green warm)</option>
                <option value="cocoa-slate">Cocoa Slate (purple cocoa)</option>
                <option value="dusk-mocha">Dusk Mocha (semi dark warm)</option>
                <option value="sage-mist">Sage Mist (semi dark calm)</option>
                <option value="linen-dawn">Linen Dawn (soft light warm)</option>
                <option value="rose-clay">Rose Clay (semi dark rosy)</option>
                <option value="ocean-paper">Ocean Paper (light calm blue)</option>
                <option value="amber-fog">Amber Fog (light warm neutral)</option>
                <option value="pine-smoke">Pine Smoke (deep calm green)</option>
              </select>
            </label>
            <input name="site_title" defaultValue={setting?.site_title ?? ""} placeholder="Site title" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
            <input name="title_template" defaultValue={setting?.title_template ?? "%s — Portfolio"} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
            <textarea name="default_description" defaultValue={setting?.default_description ?? ""} rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <input name="default_og_image_url" defaultValue={setting?.default_og_image_url ?? ""} placeholder="https://..." className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <input name="default_robots" defaultValue={setting?.default_robots ?? "index,follow"} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <select name="status" defaultValue={setting?.status ?? "published"} className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <textarea
              name="metadata"
              defaultValue={JSON.stringify(setting?.metadata ?? {}, null, 2)}
              rows={3}
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            />
            <SubmitButton pendingText="Menyimpan SEO...">Simpan global SEO</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
        <CardHeader>
          <CardTitle>Tambah SEO page</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertSeoPage} className="grid gap-3 sm:grid-cols-2">
            <input name="page_key" placeholder="home, projects, about" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
            <input name="title" placeholder="Title override" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <textarea name="description" rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <input name="canonical_url" placeholder="https://..." className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="og_image_url" placeholder="https://..." className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="robots" placeholder="index,follow" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <select name="status" defaultValue="published" className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <textarea name="metadata" defaultValue="{}" rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <SubmitButton pendingText="Menambah...">Tambah</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rows.map((row) => (
          <Card key={row.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader>
              <CardTitle>{row.page_key}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={upsertSeoPage} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="page_key" defaultValue={row.page_key} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
                <input name="title" defaultValue={row.title ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <textarea name="description" defaultValue={row.description ?? ""} rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
                <input name="canonical_url" defaultValue={row.canonical_url ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <input name="og_image_url" defaultValue={row.og_image_url ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <input name="robots" defaultValue={row.robots ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <select name="status" defaultValue={row.status ?? "published"} className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <textarea name="metadata" defaultValue={JSON.stringify(row.metadata ?? {}, null, 2)} rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
                <SubmitButton size="sm" variant="outline" pendingText="Updating...">Update</SubmitButton>
              </form>
              <form action={deleteSeoPage}>
                <input type="hidden" name="id" value={row.id} />
                <SubmitButton size="sm" variant="outline" pendingText="Deleting...">Delete</SubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
