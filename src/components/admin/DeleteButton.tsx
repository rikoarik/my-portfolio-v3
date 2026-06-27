"use client";

import { useState, useTransition } from "react";

import type { ActionResult } from "@/lib/admin/action-result";
import { notify } from "@/lib/admin/notify";
import { Button } from "@/components/ui/button";

import { ConfirmDialog } from "./ConfirmDialog";

type DeleteAction = (
  prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

export function DeleteButton({
  id,
  title,
  deleteAction,
  onSuccess,
  label = "Delete",
  variant = "outline" as const,
  size = "sm" as const,
}: {
  id: string;
  title: string;
  deleteAction: DeleteAction;
  onSuccess?: () => void;
  label?: string;
  variant?: "outline";
  size?: "sm" | "default";
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", title);
    startTransition(async () => {
      const result = await deleteAction(null, formData);
      if (result.ok) {
        notify.success(result.message);
        setOpen(false);
        onSuccess?.();
      } else if (result.kind === "error") {
        notify.error(result.message);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        disabled={pending}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        title="Konfirmasi hapus"
        description={`Hapus "${title}"? Tindakan ini tidak bisa dibatalkan.`}
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
