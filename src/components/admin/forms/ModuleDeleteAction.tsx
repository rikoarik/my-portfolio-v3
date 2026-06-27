"use client";

import { useRouter } from "next/navigation";

import type { ActionResult } from "@/lib/admin/action-result";
import { DeleteButton } from "@/components/admin/DeleteButton";

export function ModuleDeleteAction({
  id,
  title,
  deleteAction,
  redirectTo,
  label = "Hapus",
}: {
  id: string;
  title: string;
  deleteAction: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  redirectTo: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <DeleteButton
      id={id}
      title={title}
      deleteAction={deleteAction}
      label={label}
      size="sm"
      onSuccess={() => router.push(redirectTo)}
    />
  );
}
