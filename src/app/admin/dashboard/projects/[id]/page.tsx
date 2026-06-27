import { notFound } from "next/navigation";

import { ProjectEditActions } from "@/components/admin/forms/ProjectEditActions";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { fetchRecentMediaOptions } from "@/lib/admin/media-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const [{ data }, mediaOptions] = await Promise.all([
    supabase
      ? supabase.from("projects").select("*").eq("id", id).maybeSingle()
      : Promise.resolve({ data: null }),
    fetchRecentMediaOptions(supabase),
  ]);

  const fallback = PORTFOLIO_SEED.projects.find((p) => p.id === id) ?? null;
  const p = data ?? fallback;
  if (!p) return notFound();

  return (
    <ProjectForm
      project={p}
      mediaOptions={mediaOptions}
      title={p.title}
      headerActions={<ProjectEditActions id={p.id} title={p.title} />}
    />
  );
}
