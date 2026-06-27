import Link from "next/link";

import {
  bulkAction,
  deleteProject,
  reorderProject,
  toggleRecordStatus,
} from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { fetchRecentMediaOptions } from "@/lib/admin/media-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types/portfolio";

export const dynamic = "force-dynamic";

function projectSearchText(p: Project) {
  return [p.title, p.subtitle, ...(p.stack ?? []), ...(p.tags ?? [])]
    .filter(Boolean)
    .join(" ");
}

export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("projects").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Project[] = (data as Project[] | null) ?? PORTFOLIO_SEED.projects;

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Projects"
        description="Klik baris untuk edit. Geser ↑↓ untuk urutan. Filter featured atau status."
        actions={
          <Button asChild size="lg">
            <Link href="/admin/dashboard/projects/new">+ Project baru</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.status,
          subtitle: p.subtitle,
          thumbnailUrl: (p as { cover_url?: string }).cover_url ?? null,
          searchText: projectSearchText(p),
          featured: Boolean(p.featured),
          chips: p.stack?.slice(0, 4),
          meta: p.featured ? "Featured" : null,
        }))}
        module="Projects"
        table="projects"
        config={{
          editHrefPrefix: "/admin/dashboard/projects/",
          hasStatus: true,
          hasReorder: true,
          hasBulk: true,
        }}
        showFeaturedFilter
        emptyTitle="Belum ada project"
        emptyDescription="Mulai dengan project pertama — cukup isi judul, cover, dan stack."
        emptyAction={
          <Button asChild size="sm">
            <Link href="/admin/dashboard/projects/new">Buat project pertama</Link>
          </Button>
        }
        deleteAction={deleteProject}
        reorderAction={reorderProject}
        bulkAction={bulkAction}
        toggleStatusAction={toggleRecordStatus}
      />
    </div>
  );
}
