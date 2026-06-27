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

function experienceSearchText(e: Experience) {
  return [e.role, e.company, e.location, e.employment_type, ...(e.bullets ?? [])]
    .filter(Boolean)
    .join(" ");
}

export default async function AdminExperiencesPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("experiences").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: Experience[] = (data as Experience[] | null) ?? PORTFOLIO_SEED.experiences;

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Experiences"
        description="Klik baris untuk edit. Geser ↑↓ untuk urutan timeline."
        actions={
          <Button asChild size="lg">
            <Link href="/admin/dashboard/experiences/new">+ Experience baru</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((e) => ({
          id: e.id,
          title: e.role,
          status: e.status,
          subtitle: e.company,
          searchText: experienceSearchText(e),
          chips: e.location ? [e.location] : undefined,
        }))}
        module="Experiences"
        table="experiences"
        config={{
          editHrefPrefix: "/admin/dashboard/experiences/",
          hasStatus: true,
          hasReorder: true,
          hasBulk: true,
        }}
        emptyTitle="Belum ada experience"
        emptyDescription="Tambah pengalaman kerja pertama."
        emptyAction={
          <Button asChild size="sm">
            <Link href="/admin/dashboard/experiences/new">Tambah experience</Link>
          </Button>
        }
        deleteAction={deleteExperience}
        reorderAction={reorderExperience}
        bulkAction={bulkAction}
        toggleStatusAction={toggleRecordStatus}
      />
    </div>
  );
}
