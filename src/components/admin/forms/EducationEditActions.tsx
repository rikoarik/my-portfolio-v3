"use client";

import { deleteEducation } from "@/app/admin/actions";
import { ModuleDeleteAction } from "@/components/admin/forms/ModuleDeleteAction";

export function EducationEditActions({ id, title }: { id: string; title: string }) {
  return (
    <ModuleDeleteAction
      id={id}
      title={title}
      deleteAction={deleteEducation}
      redirectTo="/admin/dashboard/education"
      label="Hapus"
    />
  );
}
