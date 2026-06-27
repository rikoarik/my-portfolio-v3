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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("projects").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Project[] = (data as Project[] | null) ?? PORTFOLIO_SEED.projects;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Manage project wall, cover images, and case studies."
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/projects/new">Tambah</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.status,
          subtitle: p.subtitle,
          meta: (
            <>
              sort {p.sort_order ?? 0} · featured {String(Boolean(p.featured))}
            </>
          ),
        }))}
        module="Projects"
        table="projects"
        config={{
          editHref: (id) => `/admin/dashboard/projects/${id}`,
          hasStatus: true,
          hasReorder: true,
          hasBulk: true,
        }}
        emptyTitle="Belum ada project"
        emptyDescription="Tambah project pertama untuk tampil di Selected Works."
        emptyAction={
          <Button asChild size="sm">
            <Link href="/admin/dashboard/projects/new">Tambah project</Link>
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
