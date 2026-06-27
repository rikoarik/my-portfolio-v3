import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="Edit education" description={`ID: ${id}`} />
      <EducationForm education={edu} />
    </div>
  );
}
