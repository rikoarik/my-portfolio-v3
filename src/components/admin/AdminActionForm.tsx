"use client";

import type { ReactNode } from "react";

import type { ActionResult } from "@/lib/admin/action-result";

import { EditorForm } from "./EditorForm";

export function AdminActionForm({
  action,
  children,
  className,
  formId,
}: {
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  formId?: string;
}) {
  return (
    <EditorForm action={action} className={className} formId={formId}>
      {children}
    </EditorForm>
  );
}
