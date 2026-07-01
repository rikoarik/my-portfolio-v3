import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SectionEditActions } from "@/components/admin/forms/SectionEditActions";
import { SectionForm, type SectionData } from "@/components/admin/forms/SectionForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase.from("section_content").select("*").eq("id", id).maybeSingle()
    : { data: null };

  const section =
    (data as SectionData | null) ??
    PORTFOLIO_SEED.sections.find((s) => s.id === id) ??
    null;

  if (!section) notFound();

  const title = section.title || section.section_key;

  return (
    <>
      <AdminPageHeader
        title={title}
        backHref="/admin/dashboard/sections"
        backLabel="Daftar"
      />
      <SectionForm
        section={section}
        title={title}
        headerActions={
          section.id ? (
            <SectionEditActions id={section.id} title={title} />
          ) : null
        }
      />
    </>
  );
}
