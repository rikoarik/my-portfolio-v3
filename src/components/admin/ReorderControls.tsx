"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ActionResult } from "@/lib/admin/action-result";
import { notify } from "@/lib/admin/notify";
import { canMove, move as reorderMove } from "@/lib/admin/reorder";
import { Button } from "@/components/ui/button";

export function ReorderControls({
  id,
  index,
  total,
  orderedIds,
  module,
  reorderAction,
  onOptimisticReorder,
  onRollback,
}: {
  id: string;
  index: number;
  total: number;
  orderedIds?: string[];
  module: string;
  reorderAction: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  onOptimisticReorder?: (nextOrder: string[]) => void;
  onRollback?: (prevOrder: string[]) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optIndex, setOptIndex] = useState(index);

  useEffect(() => {
    setOptIndex(index);
  }, [index]);

  const handleMove = (direction: "up" | "down") => {
    if (!canMove(optIndex, total, direction)) return;

    const prevOrder = orderedIds ? [...orderedIds] : undefined;
    const prevIndex = optIndex;
    const nextIndex = direction === "up" ? optIndex - 1 : optIndex + 1;

    if (orderedIds?.length) {
      const items = orderedIds.map((itemId) => ({ id: itemId }));
      const next = reorderMove(items, id, direction);
      onOptimisticReorder?.(next.map((item) => item.id));
    }

    setOptIndex(nextIndex);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("direction", direction);
      const result = await reorderAction(null, formData);
      if (result.ok) {
        notify.success(result.message);
        router.refresh();
      } else {
        if (prevOrder) onRollback?.(prevOrder);
        setOptIndex(prevIndex);
        if (result.kind === "error") {
          notify.error(result.message);
        }
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canMove(optIndex, total, "up") || pending}
        onClick={() => handleMove("up")}
        aria-label={`Move ${module} item up`}
      >
        ↑
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canMove(optIndex, total, "down") || pending}
        onClick={() => handleMove("down")}
        aria-label={`Move ${module} item down`}
      >
        ↓
      </Button>
    </>
  );
}
