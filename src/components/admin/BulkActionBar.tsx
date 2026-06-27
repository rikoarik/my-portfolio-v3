"use client";

import { useState, useTransition } from "react";

import type { ActionResult } from "@/lib/admin/action-result";
import { notify } from "@/lib/admin/notify";
import { Button } from "@/components/ui/button";

import { ConfirmDialog } from "./ConfirmDialog";

export function BulkActionBar({
  module,
  table,
  selectedIds,
  hasStatus,
  bulkAction,
  deleteAction,
  onClear,
  onDone,
}: {
  module: string;
  table: string;
  selectedIds: string[];
  hasStatus?: boolean;
  bulkAction: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  deleteAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  onClear: () => void;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const runBulk = (op: "delete" | "publish" | "unpublish") => {
    startTransition(async () => {
      const action = op === "delete" && deleteAction ? deleteAction : bulkAction;
      const formData = new FormData();
      formData.set("module", module);
      formData.set("table", table);
      formData.set("op", op);
      formData.set("ids", JSON.stringify(selectedIds));
      const result = await action(null, formData);
      if (result.ok) {
        notify.success(result.message);
        setConfirmDelete(false);
        onDone();
      } else if (result.kind === "error") {
        notify.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--accent)]/30 px-4 py-3">
      <span className="text-sm font-medium">{selectedIds.length} dipilih</span>
      {hasStatus ? (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => runBulk("publish")}
          >
            Publish
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => runBulk("unpublish")}
          >
            Unpublish
          </Button>
        </>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="text-red-600 hover:text-red-700"
        disabled={pending}
        onClick={() => setConfirmDelete(true)}
      >
        Hapus
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onClear}>
        Batal pilih
      </Button>
      <ConfirmDialog
        open={confirmDelete}
        title="Konfirmasi hapus massal"
        description={`Hapus ${selectedIds.length} item? Tindakan ini tidak bisa dibatalkan.`}
        pending={pending}
        onConfirm={() => runBulk("delete")}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
