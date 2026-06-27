import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("experiences").select("*").eq("id", id).maybeSingle()
    : { data: null };
  const fallback = PORTFOLIO_SEED.experiences.find((e) => e.id === id) ?? null;
  const e = data ?? fallback;
  if (!e) return notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="Edit experience" description={`ID: ${id}`} />
      <ExperienceForm experience={e} />
    </div>
  );
}
