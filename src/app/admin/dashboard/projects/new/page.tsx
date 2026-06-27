import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="New project"
        description="Buat project baru dengan editor terstruktur dan preview langsung."
      />
      <ProjectForm project={{ sort_order: 0, status: "published" }} isNew />
    </div>
  );
}
