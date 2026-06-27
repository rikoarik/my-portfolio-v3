import { notFound } from "next/navigation";

import { EducationEditActions } from "@/components/admin/forms/EducationEditActions";
import { EducationForm } from "@/components/admin/forms/EducationForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("education").select("*").eq("id", id).maybeSingle()
    : { data: null };
  const fallback = PORTFOLIO_SEED.education.find((edu) => edu.id === id) ?? null;
  const edu = data ?? fallback;
  if (!edu) return notFound();

  return (
    <EducationForm
      education={edu}
      title={`${edu.degree} · ${edu.institution}`}
      headerActions={<EducationEditActions id={edu.id} title={edu.degree} />}
    />
  );
}
