"use client";

import type { StatusFilter } from "@/lib/admin/list-filter";
import { Input } from "@/components/ui/input";

export function ListFilterBar({
  query,
  status,
  hasStatusFilter,
  onQueryChange,
  onStatusChange,
}: {
  query: string;
  status: StatusFilter;
  hasStatusFilter?: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Cari judul..."
        aria-label="Filter daftar"
        value={query}
        maxLength={200}
        onChange={(e) => onQueryChange(e.target.value.slice(0, 200))}
        className="max-w-sm"
      />
      {hasStatusFilter ? (
        <select
          aria-label="Filter status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
        >
          <option value="all">Semua status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      ) : null}
    </div>
  );
}
