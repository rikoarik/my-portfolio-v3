"use client";

import { deleteProject } from "@/app/admin/actions";
import { ModuleDeleteAction } from "@/components/admin/forms/ModuleDeleteAction";

export function ProjectEditActions({ id, title }: { id: string; title: string }) {
  return (
    <ModuleDeleteAction
      id={id}
      title={title}
      deleteAction={deleteProject}
      redirectTo="/admin/dashboard/projects"
      label="Hapus"
    />
  );
}
