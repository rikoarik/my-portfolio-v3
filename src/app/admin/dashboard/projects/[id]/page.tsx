import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("projects").select("*").eq("id", id).maybeSingle()
    : { data: null };

  const fallback = PORTFOLIO_SEED.projects.find((p) => p.id === id) ?? null;
  const p = data ?? fallback;
  if (!p) return notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Edit project"
        description={
          <>
            ID: <code className="font-mono-meta">{id}</code>
          </>
        }
      />
      <ProjectForm project={p} />
    </div>
  );
}
