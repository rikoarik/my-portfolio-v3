import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="New experience" description="Buat experience baru." />
      <ExperienceForm experience={{ sort_order: 0, status: "published" }} isNew />
    </div>
  );
}
