"use client";

import type { StatusFilter } from "@/lib/admin/list-filter";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function ListFilterBar({
  query,
  status,
  hasStatusFilter,
  featuredOnly,
  showFeaturedFilter,
  onQueryChange,
  onStatusChange,
  onFeaturedChange,
}: {
  query: string;
  status: StatusFilter;
  hasStatusFilter?: boolean;
  featuredOnly?: boolean;
  showFeaturedFilter?: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onFeaturedChange?: (featuredOnly: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Cari judul, stack, tags..."
          aria-label="Filter daftar"
          value={query}
          maxLength={200}
          onChange={(e) => onQueryChange(e.target.value.slice(0, 200))}
          className="max-w-md"
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
      {showFeaturedFilter && onFeaturedChange ? (
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={!featuredOnly}
            onClick={() => onFeaturedChange(false)}
            label="Semua"
          />
          <FilterChip
            active={Boolean(featuredOnly)}
            onClick={() => onFeaturedChange(true)}
            label="Featured saja"
          />
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50",
      )}
    >
      {label}
    </button>
  );
}
