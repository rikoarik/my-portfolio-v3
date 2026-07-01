import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SectionForm } from "@/components/admin/forms/SectionForm";

export const dynamic = "force-dynamic";

export default async function NewSectionPage() {
  return (
    <>
      <AdminPageHeader
        title="Section baru"
        backHref="/admin/dashboard/sections"
        backLabel="Daftar"
      />
      <SectionForm section={{ section_key: "", status: "published" }} isNew />
    </>
  );
}
