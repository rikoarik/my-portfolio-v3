"use client";

import { deleteExperience } from "@/app/admin/actions";
import { ModuleDeleteAction } from "@/components/admin/forms/ModuleDeleteAction";

export function ExperienceEditActions({ id, title }: { id: string; title: string }) {
  return (
    <ModuleDeleteAction
      id={id}
      title={title}
      deleteAction={deleteExperience}
      redirectTo="/admin/dashboard/experiences"
      label="Hapus"
    />
  );
}
