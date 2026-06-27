import Link from "next/link";

import { deleteEducation, reorderEducation } from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EducationRow = {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  sort_order?: number;
  bullets?: string[];
};

function educationSearchText(e: EducationRow) {
  return [e.degree, e.institution, e.field, ...(e.bullets ?? [])].filter(Boolean).join(" ");
}

export default async function AdminEducationPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("education").select("*").order("sort_order", { ascending: true })
    : { data: null };

  const rows: EducationRow[] =
    (data as EducationRow[] | null) ??
    (PORTFOLIO_SEED.education as EducationRow[] | undefined) ??
    [];

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Education"
        description="Klik baris untuk edit. Geser ↑↓ untuk urutan."
        actions={
          <Button asChild size="lg">
            <Link href="/admin/dashboard/education/new">+ Education baru</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((e) => ({
          id: e.id,
          title: e.degree,
          subtitle: e.institution,
          searchText: educationSearchText(e),
          chips: e.field ? [e.field] : undefined,
        }))}
        module="Education"
        table="education"
        config={{
          editHrefPrefix: "/admin/dashboard/education/",
          hasReorder: true,
        }}
        emptyTitle="Belum ada education"
        emptyDescription="Tambah entri pendidikan pertama."
        emptyAction={
          <Button asChild size="sm">
            <Link href="/admin/dashboard/education/new">Tambah education</Link>
          </Button>
        }
        deleteAction={deleteEducation}
        reorderAction={reorderEducation}
      />
    </div>
  );
}
