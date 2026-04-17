import Link from "next/link";

import { deleteProject, reorderProject } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; moved?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("projects").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Project[] = (data as Project[] | null) ?? PORTFOLIO_SEED.projects;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage project wall + case studies.
          </p>
          {sp.saved ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Tersimpan. Cache akan ter-update.
            </p>
          ) : null}
          {sp.deleted ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Terhapus.
            </p>
          ) : null}
          {sp.moved ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Urutan diperbarui.
            </p>
          ) : null}
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/projects/new">Tambah</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {rows.map((p, index) => (
          <Card key={p.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg">{p.title}</CardTitle>
                <p className="font-mono-meta mt-1 text-xs text-[var(--muted-foreground)]">
                  sort {p.sort_order ?? 0} · featured {String(Boolean(p.featured))} ·{" "}
                  {p.status ?? "published"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={reorderProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="direction" value="up" />
                  <SubmitButton
                    variant="outline"
                    size="sm"
                    pendingText="Moving..."
                    disabled={index === 0}
                  >
                    ↑
                  </SubmitButton>
                </form>
                <form action={reorderProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="direction" value="down" />
                  <SubmitButton
                    variant="outline"
                    size="sm"
                    pendingText="Moving..."
                    disabled={index === rows.length - 1}
                  >
                    ↓
                  </SubmitButton>
                </form>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/dashboard/projects/${p.id}`}>Edit</Link>
                </Button>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <SubmitButton variant="outline" size="sm" pendingText="Deleting...">Delete</SubmitButton>
                </form>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              {p.subtitle ?? "—"}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

