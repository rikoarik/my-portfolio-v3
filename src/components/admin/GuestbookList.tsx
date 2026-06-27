"use client";

import { useState, useTransition } from "react";

import {
  bulkAction,
  deleteGuestbookMessage,
  updateGuestbookStatus,
} from "@/app/admin/actions";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ListFilterBar } from "@/components/admin/ListFilterBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { filterItems } from "@/lib/admin/list-filter";
import { notify } from "@/lib/admin/notify";
import { toggleSelection } from "@/lib/admin/bulk";

type GuestbookRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  status: "pending" | "approved" | "hidden";
  moderation_note?: string | null;
};

const STATUS_OPTIONS = ["pending", "approved", "hidden"] as const;

function formatDate(v: string) {
  const date = new Date(v);
  if (Number.isNaN(date.getTime())) return v;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function GuestbookAdmin({ rows }: { rows: GuestbookRow[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const filtered = filterItems(
    rows.map((r) => ({ ...r, title: r.name })),
    query,
    "all",
  );

  const updateStatus = (row: GuestbookRow, status: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", row.id);
      formData.set("status", status);
      formData.set("moderation_note", row.moderation_note ?? "");
      const result = await updateGuestbookStatus(null, formData);
      if (result.ok) notify.success(result.message);
      else if (result.kind === "error") notify.error(result.message);
    });
  };

  if (rows.length === 0) {
    return <AdminEmptyState title="Belum ada pesan" description="Tidak ada pesan guestbook." />;
  }

  return (
    <div className="space-y-4">
      <ListFilterBar query={query} status="all" onQueryChange={setQuery} onStatusChange={() => {}} />
      {selected.size > 0 ? (
        <BulkActionBar
          module="Guestbook"
          table="guestbook"
          selectedIds={[...selected]}
          bulkAction={bulkAction}
          deleteAction={bulkAction}
          onClear={() => setSelected(new Set())}
          onDone={() => setSelected(new Set())}
        />
      ) : null}
      <div className="grid gap-4">
        {filtered.map((row) => (
          <AdminListCard
            key={row.id}
            title={
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(row.id)}
                  onChange={() => setSelected((s) => toggleSelection(s, row.id))}
                  aria-label={`Pilih ${row.name}`}
                />
                {row.name}
              </span>
            }
            meta={
              <>
                {formatDate(row.created_at)} · <StatusBadge status={row.status} />
              </>
            }
            actions={
              <>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={pending}
                    onClick={() => updateStatus(row, status)}
                    className={`rounded-md border px-3 py-1 text-xs ${
                      row.status === status
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <DeleteButton
                  id={row.id}
                  title={row.name}
                  deleteAction={deleteGuestbookMessage}
                />
              </>
            }
          >
            <p className="text-sm">{row.message}</p>
            <div className="mt-4 space-y-2">
              <label className="text-xs text-[var(--muted-foreground)]">Catatan moderasi</label>
              <Textarea
                defaultValue={row.moderation_note ?? ""}
                rows={2}
                onBlur={(e) => {
                  const formData = new FormData();
                  formData.set("id", row.id);
                  formData.set("status", row.status);
                  formData.set("moderation_note", e.target.value);
                  startTransition(async () => {
                    const result = await updateGuestbookStatus(null, formData);
                    if (result.ok) notify.success(result.message);
                  });
                }}
              />
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}
