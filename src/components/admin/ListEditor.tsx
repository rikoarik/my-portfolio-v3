"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  addEntry,
  moveEntry,
  removeEntry,
  serializeEntries,
  type AddResult,
} from "@/lib/admin/list-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADD_ERROR_MESSAGES: Record<
  "empty" | "too-long" | "duplicate" | "max-entries",
  string
> = {
  empty: "Entri kosong tidak diizinkan.",
  "too-long": "Panjang entri maksimum 200 karakter.",
  duplicate: "Entri duplikat tidak diizinkan.",
  "max-entries": "Maksimum 100 entri.",
};

export function ListEditor({
  name,
  initialEntries,
  label,
  onEntriesChange,
  hideFromSubmit,
}: {
  name: string;
  initialEntries: string[];
  label?: string;
  onEntriesChange?: (entries: string[]) => void;
  /** When true, entries are not written to FormData (use with onEntriesChange). */
  hideFromSubmit?: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [draft, setDraft] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const handleAdd = () => {
    const result = addEntry(entries, draft);
    if (!result.ok) {
      setAddError(ADD_ERROR_MESSAGES[result.reason]);
      return;
    }
    setEntries(result.entries);
    onEntriesChange?.(result.entries);
    setDraft("");
    setAddError(null);
  };

  const handleRemove = (index: number) => {
    setEntries((prev) => {
      const next = removeEntry(prev, index);
      onEntriesChange?.(next);
      return next;
    });
  };

  const handleMove = (index: number, dir: "up" | "down") => {
    setEntries((prev) => {
      const next = moveEntry(prev, index, dir);
      onEntriesChange?.(next);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
      ) : null}
      <input type="hidden" name={hideFromSubmit ? undefined : name} value={serializeEntries(entries)} />
      <ul className="space-y-1">
        {entries.map((entry, index) => (
          <li
            key={`${entry}-${index}`}
            className="flex items-center gap-1 rounded border border-[var(--border)] px-2 py-1"
          >
            <div className="flex shrink-0 flex-col gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-1.5"
                disabled={index === 0}
                onClick={() => handleMove(index, "up")}
                aria-label="Naikkan"
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-1.5"
                disabled={index === entries.length - 1}
                onClick={() => handleMove(index, "down")}
                aria-label="Turunkan"
              >
                ↓
              </Button>
            </div>
            <span className="flex-1 text-sm">{entry}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              aria-label={`Hapus entri ${entry}`}
            >
              <X className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tambah..."
          className="h-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          +
        </Button>
      </div>
      {addError ? (
        <p className="text-sm text-red-600" role="alert">
          {addError}
        </p>
      ) : null}
    </div>
  );
}
