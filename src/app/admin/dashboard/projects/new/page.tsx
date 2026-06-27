import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { fetchRecentMediaOptions } from "@/lib/admin/media-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createSupabaseServerClient();
  const mediaOptions = await fetchRecentMediaOptions(supabase);

  return (
    <>
      <AdminPageHeader
        title="Project baru"
        backHref="/admin/dashboard/projects"
        backLabel="Daftar"
      />
      <ProjectForm
        project={{ sort_order: 0, status: "draft" }}
        isNew
        mediaOptions={mediaOptions}
      />
    </>
  );
}
