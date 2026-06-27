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
  sort_order?: number;
};

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
    <div className="space-y-6">
      <AdminPageHeader
        title="Education"
        description="Kelola riwayat pendidikan dan bullets."
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/education/new">Tambah</Link>
          </Button>
        }
      />

      <FilterableList
        items={rows.map((e) => ({
          id: e.id,
          title: e.degree,
          subtitle: e.institution,
          meta: <>sort {e.sort_order ?? 0}</>,
        }))}
        module="Education"
        table="education"
        config={{
          editHref: (id) => `/admin/dashboard/education/${id}`,
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
