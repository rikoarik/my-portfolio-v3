import { deleteMediaAsset, upsertMediaAsset } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type MediaRow = {
  id: string;
  path: string;
  public_url: string;
  alt: string | null;
  caption: string | null;
  mime_type: string | null;
};

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("media_assets").select("*").order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data as MediaRow[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Registrasi asset media + metadata.</p>
        {sp.saved ? <p className="mt-2 text-sm text-[var(--primary)]">Tersimpan.</p> : null}
        {sp.deleted ? <p className="mt-2 text-sm text-[var(--primary)]">Terhapus.</p> : null}
      </div>

      <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
        <CardHeader>
          <CardTitle>Tambah media</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertMediaAsset} className="grid gap-3 sm:grid-cols-2">
            <input name="bucket" defaultValue="portfolio-media" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="path" placeholder="covers/project-1.jpg" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
            <input name="public_url" placeholder="https://..." className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" required />
            <input name="mime_type" placeholder="image/jpeg" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="alt" placeholder="Alt text" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
            <input name="caption" placeholder="Caption" className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
            <SubmitButton pendingText="Menyimpan...">Simpan</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rows.map((row) => (
          <Card key={row.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader>
              <CardTitle className="truncate text-base">{row.path}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={upsertMediaAsset} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="path" defaultValue={row.path} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
                <input name="public_url" defaultValue={row.public_url} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" required />
                <input name="mime_type" defaultValue={row.mime_type ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <input name="alt" defaultValue={row.alt ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm" />
                <input name="caption" defaultValue={row.caption ?? ""} className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2" />
                <SubmitButton size="sm" variant="outline" pendingText="Updating...">Update</SubmitButton>
              </form>
              <a href={row.public_url} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline">
                Open asset
              </a>
              <form action={deleteMediaAsset}>
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
