import Link from "next/link";

import { deleteExperience } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("experiences").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Experience[] =
    (data as Experience[] | null) ?? PORTFOLIO_SEED.experiences;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Experiences</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Ringkas, highlight only.
          </p>
          {sp.saved ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Tersimpan.
            </p>
          ) : null}
          {sp.deleted ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Terhapus.
            </p>
          ) : null}
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/experiences/new">Tambah</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {rows.map((e) => (
          <Card key={e.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg">{e.role}</CardTitle>
                <p className="font-mono-meta mt-1 text-xs text-[var(--muted-foreground)]">
                  {e.company} · sort {e.sort_order ?? 0} · {e.status ?? "published"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/dashboard/experiences/${e.id}`}>Edit</Link>
                </Button>
                <form action={deleteExperience}>
                  <input type="hidden" name="id" value={e.id} />
                  <SubmitButton variant="outline" size="sm" pendingText="Deleting...">Delete</SubmitButton>
                </form>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              {e.bullets[0] ?? "—"}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

