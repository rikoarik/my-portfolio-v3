import { EducationForm } from "@/components/admin/forms/EducationForm";

export const dynamic = "force-dynamic";

export default async function NewEducationPage() {
  return <EducationForm education={{ sort_order: 0 }} isNew />;
}
