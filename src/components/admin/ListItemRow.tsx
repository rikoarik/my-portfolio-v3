"use client";

import Link from "next/link";

import type { ActionResult } from "@/lib/admin/action-result";
import { Button } from "@/components/ui/button";

import { AdminListCard } from "./AdminListCard";
import { DeleteButton } from "./DeleteButton";
import { ReorderControls } from "./ReorderControls";
import { StatusBadge } from "./StatusBadge";
import { StatusToggle } from "./StatusToggle";

export type ListItemConfig = {
  editHref?: (id: string) => string;
  hasStatus?: boolean;
  hasReorder?: boolean;
  hasBulk?: boolean;
};

export function ListItemRow({
  item,
  index,
  total,
  orderedIds,
  module,
  table,
  config,
  selected,
  onToggleSelect,
  deleteAction,
  reorderAction,
  toggleStatusAction,
  onOptimisticReorder,
  onRollback,
}: {
  item: {
    id: string;
    title: string;
    status?: string | null;
    subtitle?: string | null;
    meta?: React.ReactNode;
  };
  index: number;
  total: number;
  orderedIds: string[];
  module: string;
  table: string;
  config: ListItemConfig;
  selected?: boolean;
  onToggleSelect?: () => void;
  deleteAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  reorderAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  toggleStatusAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  onOptimisticReorder?: (nextOrder: string[]) => void;
  onRollback?: (prevOrder: string[]) => void;
}) {
  return (
    <AdminListCard
      title={
        <span className="flex items-center gap-2">
          {config.hasBulk && onToggleSelect ? (
            <input
              type="checkbox"
              aria-label={`Pilih ${item.title}`}
              checked={selected}
              onChange={onToggleSelect}
              className="size-4"
            />
          ) : null}
          {item.title}
        </span>
      }
      meta={
        item.meta ?? (
          <>
            {config.hasStatus && item.status ? (
              <>
                <StatusBadge status={item.status} />
              </>
            ) : null}
          </>
        )
      }
      actions={
        <>
          {config.hasReorder && reorderAction ? (
            <ReorderControls
              id={item.id}
              index={index}
              total={total}
              orderedIds={orderedIds}
              module={module}
              reorderAction={reorderAction}
              onOptimisticReorder={onOptimisticReorder}
              onRollback={onRollback}
            />
          ) : null}
          {config.hasStatus && item.status && toggleStatusAction ? (
            <StatusToggle
              id={item.id}
              title={item.title}
              table={table}
              module={module}
              currentStatus={item.status as "draft" | "published"}
              toggleAction={toggleStatusAction}
            />
          ) : null}
          {config.editHref ? (
            <Button asChild variant="outline" size="sm">
              <Link href={config.editHref(item.id)}>Edit</Link>
            </Button>
          ) : null}
          {deleteAction ? (
            <DeleteButton
              id={item.id}
              title={item.title}
              deleteAction={deleteAction}
            />
          ) : null}
        </>
      }
    >
      {item.subtitle ? (
        <p className="text-sm text-[var(--muted-foreground)]">{item.subtitle}</p>
      ) : null}
    </AdminListCard>
  );
}
