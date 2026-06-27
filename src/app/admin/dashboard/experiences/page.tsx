import Link from "next/link";

import {
  bulkAction,
  deleteExperience,
  reorderExperience,
  toggleRecordStatus,
} from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("experiences").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Experience[] = (data as Experience[] | null) ?? PORTFOLIO_SEED.experiences;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experiences"
        description="Kelola timeline career, bullets, dan status publish."
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/experiences/new">Tambah</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((e) => ({
          id: e.id,
          title: e.role,
          status: e.status,
          subtitle: e.company,
          meta: <>sort {e.sort_order ?? 0}</>,
        }))}
        module="Experiences"
        table="experiences"
        config={{
          editHref: (id) => `/admin/dashboard/experiences/${id}`,
          hasStatus: true,
          hasReorder: true,
          hasBulk: true,
        }}
        deleteAction={deleteExperience}
        reorderAction={reorderExperience}
        bulkAction={bulkAction}
        toggleStatusAction={toggleRecordStatus}
      />
    </div>
  );
}
