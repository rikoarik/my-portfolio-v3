import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EducationForm } from "@/components/admin/forms/EducationForm";

export const dynamic = "force-dynamic";

export default async function NewEducationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="New education" description="Buat entri pendidikan baru." />
      <EducationForm education={{ sort_order: 0 }} isNew />
    </div>
  );
}
