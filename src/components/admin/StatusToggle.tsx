"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ActionResult } from "@/lib/admin/action-result";
import { notify } from "@/lib/admin/notify";
import { toggleStatus, type PubStatus } from "@/lib/admin/status";
import { Button } from "@/components/ui/button";

import { StatusBadge } from "./StatusBadge";

export function StatusToggle({
  id,
  title,
  table,
  module,
  currentStatus,
  toggleAction,
}: {
  id: string;
  title: string;
  table: string;
  module: string;
  currentStatus: PubStatus;
  toggleAction: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);

  const handleToggle = () => {
    const next = toggleStatus(optimisticStatus);
    startTransition(async () => {
      setOptimisticStatus(next);
      const formData = new FormData();
      formData.set("table", table);
      formData.set("module", module);
      formData.set("id", id);
      formData.set("title", title);
      formData.set("currentStatus", optimisticStatus);
      const result = await toggleAction(null, formData);
      if (result.ok) {
        notify.success(result.message);
        router.refresh();
      } else if (result.kind === "error") {
        notify.error(result.message);
        router.refresh();
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={pending}
      aria-busy={pending}
      aria-label={`Toggle status for ${title}`}
    >
      <StatusBadge status={optimisticStatus} />
    </Button>
  );
}
