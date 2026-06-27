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
  editHrefPrefix?: string;
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
    thumbnailUrl?: string | null;
    chips?: string[];
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
  const editHref = config.editHrefPrefix
    ? `${config.editHrefPrefix}${item.id}`
    : undefined;

  return (
    <AdminListCard
      editHref={editHref}
      title={
        <span className="flex items-center gap-3">
          {config.hasBulk && onToggleSelect ? (
            <input
              type="checkbox"
              aria-label={`Pilih ${item.title}`}
              checked={selected}
              onChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="size-4 shrink-0"
            />
          ) : null}
          {item.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnailUrl}
              alt=""
              className="size-10 shrink-0 rounded object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-[var(--accent)] text-xs text-[var(--muted-foreground)]">
              —
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-semibold">{item.title}</span>
            {item.subtitle ? (
              <span className="mt-0.5 block truncate text-sm font-normal text-[var(--muted-foreground)]">
                {item.subtitle}
              </span>
            ) : null}
          </span>
        </span>
      }
      meta={
        <>
          {config.hasStatus && item.status ? <StatusBadge status={item.status} /> : null}
          {item.meta ? <span className="text-[var(--muted-foreground)]">{item.meta}</span> : null}
          {item.chips?.slice(0, 4).map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-mono-meta text-[10px] text-[var(--muted-foreground)]"
            >
              {chip}
            </span>
          ))}
        </>
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
          {editHref ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href={editHref}>Edit</Link>
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
    />
  );
}
