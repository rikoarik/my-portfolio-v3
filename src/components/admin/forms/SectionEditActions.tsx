"use client";

import { deleteSectionContent } from "@/app/admin/actions";
import { ModuleDeleteAction } from "@/components/admin/forms/ModuleDeleteAction";

export function SectionEditActions({ id, title }: { id: string; title: string }) {
  return (
    <ModuleDeleteAction
      id={id}
      title={title}
      deleteAction={deleteSectionContent}
      redirectTo="/admin/dashboard/sections"
      label="Hapus"
    />
  );
}
