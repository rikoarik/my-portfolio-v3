"use client";

import { useEffect, useMemo, useState } from "react";

import type { ActionResult } from "@/lib/admin/action-result";
import { filterItems, type StatusFilter } from "@/lib/admin/list-filter";
import { toggleSelection } from "@/lib/admin/bulk";

import { AdminEmptyState } from "./AdminEmptyState";
import { BulkActionBar } from "./BulkActionBar";
import { ListFilterBar } from "./ListFilterBar";
import { ListItemRow, type ListItemConfig } from "./ListItemRow";

export type FilterableItem = {
  id: string;
  title: string;
  status?: string | null;
  subtitle?: string | null;
  meta?: React.ReactNode;
};

export function FilterableList({
  items,
  module,
  table,
  config,
  emptyTitle,
  emptyDescription,
  emptyAction,
  deleteAction,
  reorderAction,
  bulkAction,
  toggleStatusAction,
}: {
  items: FilterableItem[];
  module: string;
  table: string;
  config: ListItemConfig;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  deleteAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  reorderAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  bulkAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  toggleStatusAction?: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [displayOrder, setDisplayOrder] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterItems(items, query, status),
    [items, query, status],
  );

  useEffect(() => {
    setDisplayOrder(filtered.map((item) => item.id));
  }, [filtered]);

  const displayItems = useMemo(() => {
    const byId = new Map(filtered.map((item) => [item.id, item]));
    return displayOrder
      .map((itemId) => byId.get(itemId))
      .filter((item): item is FilterableItem => Boolean(item));
  }, [displayOrder, filtered]);

  const orderedIds = displayOrder;

  if (items.length === 0 && emptyTitle) {
    return (
      <AdminEmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ListFilterBar
        query={query}
        status={status}
        hasStatusFilter={config.hasStatus}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />

      {config.hasBulk && selected.size > 0 && bulkAction ? (
        <BulkActionBar
          module={module}
          table={table}
          selectedIds={[...selected]}
          hasStatus={config.hasStatus}
          bulkAction={bulkAction}
          deleteAction={deleteAction}
          onClear={() => setSelected(new Set())}
          onDone={() => setSelected(new Set())}
        />
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          Tidak ada item cocok dengan filter aktif.
        </p>
      ) : (
        <div className="grid gap-4">
          {displayItems.map((item, index) => (
            <ListItemRow
              key={item.id}
              item={item}
              index={index}
              total={displayItems.length}
              orderedIds={orderedIds}
              module={module}
              table={table}
              config={config}
              selected={selected.has(item.id)}
              onToggleSelect={
                config.hasBulk
                  ? () => setSelected((s) => toggleSelection(s, item.id))
                  : undefined
              }
              deleteAction={deleteAction}
              reorderAction={reorderAction}
              toggleStatusAction={toggleStatusAction}
              onOptimisticReorder={setDisplayOrder}
              onRollback={setDisplayOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
