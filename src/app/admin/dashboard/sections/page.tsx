import { deleteSectionContent, upsertSectionContent } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SectionRow = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  meta: unknown;
  status: "draft" | "published";
};

function parseMeta(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  return meta as Record<string, unknown>;
}

export default async function AdminSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("section_content").select("*").order("section_key", { ascending: true })
    : { data: [] };
  const rows = (data as SectionRow[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Sections</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Kelola copy tiap section homepage.</p>
        {sp.saved ? <p className="mt-2 text-sm text-[var(--primary)]">Tersimpan.</p> : null}
        {sp.deleted ? <p className="mt-2 text-sm text-[var(--primary)]">Terhapus.</p> : null}
      </div>

      <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
        <CardHeader>
          <CardTitle>Tambah section content</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertSectionContent} className="grid gap-3 sm:grid-cols-2">
            <input name="section_key" placeholder="hero/about/contact/proof/nav" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
            <input name="title" placeholder="Title" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="subtitle" placeholder="Subtitle" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <textarea name="body" placeholder="Body text" rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <input
              name="about_headline"
              placeholder="About headline (khusus section_key=about)"
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            />
            <textarea
              name="about_intro"
              placeholder="About intro paragraph (khusus section_key=about)"
              rows={3}
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            />
            <input
              name="focus_title"
              placeholder="Focus title (khusus section_key=about)"
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            />
            <textarea
              name="focus_body"
              placeholder="Focus body (khusus section_key=about)"
              rows={3}
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            />
            <textarea name="meta" placeholder='{"cta_label":"Explore Work"}' rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <select name="status" defaultValue="published" className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <SubmitButton pendingText="Menyimpan...">Simpan</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rows.map((row) => (
          (() => {
            const meta = parseMeta(row.meta);
            const aboutHeadline =
              typeof meta.about_headline === "string" ? meta.about_headline : "";
            const aboutIntro =
              typeof meta.about_intro === "string" ? meta.about_intro : "";
            const focusTitle =
              typeof meta.focus_title === "string" ? meta.focus_title : "";
            const focusBody =
              typeof meta.focus_body === "string" ? meta.focus_body : "";
            return (
          <Card key={row.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader>
              <CardTitle>{row.section_key}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={upsertSectionContent} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="section_key" defaultValue={row.section_key} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
                <input name="title" defaultValue={row.title ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <input name="subtitle" defaultValue={row.subtitle ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
                <textarea name="body" defaultValue={row.body ?? ""} rows={3} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
                <input
                  name="about_headline"
                  defaultValue={aboutHeadline}
                  placeholder="About headline (khusus section_key=about)"
                  className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                />
                <textarea
                  name="about_intro"
                  defaultValue={aboutIntro}
                  placeholder="About intro paragraph (khusus section_key=about)"
                  rows={3}
                  className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                />
                <input
                  name="focus_title"
                  defaultValue={focusTitle}
                  placeholder="Focus title (khusus section_key=about)"
                  className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                />
                <textarea
                  name="focus_body"
                  defaultValue={focusBody}
                  placeholder="Focus body (khusus section_key=about)"
                  rows={3}
                  className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                />
                <textarea
                  name="meta"
                  defaultValue={JSON.stringify(row.meta ?? {}, null, 2)}
                  rows={3}
                  className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                />
                <select name="status" defaultValue={row.status ?? "published"} className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <SubmitButton variant="outline" pendingText="Updating...">Update</SubmitButton>
              </form>
              <form action={deleteSectionContent}>
                <input type="hidden" name="id" value={row.id} />
                <SubmitButton size="sm" variant="outline" pendingText="Deleting...">Delete</SubmitButton>
              </form>
            </CardContent>
          </Card>
            );
          })()
        ))}
      </div>
    </div>
  );
}
