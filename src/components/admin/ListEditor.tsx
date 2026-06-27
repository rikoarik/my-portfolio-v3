"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  addEntry,
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
}: {
  name: string;
  initialEntries: string[];
  label?: string;
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
    setDraft("");
    setAddError(null);
  };

  const handleRemove = (index: number) => {
    setEntries((prev) => removeEntry(prev, index));
  };

  return (
    <div className="space-y-3">
      {label ? (
        <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
      ) : null}
      <input type="hidden" name={name} value={serializeEntries(entries)} />
      <ul className="space-y-2">
        {entries.map((entry, index) => (
          <li
            key={`${entry}-${index}`}
            className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2"
          >
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
          placeholder="Tambah entri..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          Tambah
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
