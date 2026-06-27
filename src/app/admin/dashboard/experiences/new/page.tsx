import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  return <ExperienceForm experience={{ sort_order: 0, status: "draft" }} isNew />;
}
