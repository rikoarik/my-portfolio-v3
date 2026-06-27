"use client";

import { useMemo } from "react";

import { parseJsonOrLines } from "@/lib/admin/validation";

type PreviewField = {
  label: string;
  value: string;
  type?: "text" | "array" | "json";
};

export function PreviewPane({
  title,
  fields,
}: {
  title?: string;
  fields: PreviewField[];
}) {
  const rendered = useMemo(
    () =>
      fields.map((field) => {
        if (!field.value.trim()) {
          return { ...field, content: null, invalid: false };
        }
        if (field.type === "array") {
          try {
            const items = parseJsonOrLines(field.value);
            return {
              ...field,
              content: (
                <ul className="max-h-24 list-inside list-disc overflow-y-auto text-xs leading-snug">
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ),
              invalid: false,
            };
          } catch {
            return { ...field, content: null, invalid: true };
          }
        }
        if (field.type === "json") {
          try {
            const parsed = JSON.parse(field.value);
            return {
              ...field,
              content: (
                <pre className="max-h-32 overflow-auto rounded bg-[var(--accent)]/30 p-1.5 text-[10px] leading-snug">
                  {JSON.stringify(parsed, null, 2)}
                </pre>
              ),
              invalid: false,
            };
          } catch {
            return { ...field, content: null, invalid: true };
          }
        }
        return {
          ...field,
          content: <p className="text-xs leading-snug whitespace-pre-wrap">{field.value}</p>,
          invalid: false,
        };
      }),
    [fields],
  );

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2.5">
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {title ?? "Preview"}
      </h3>
      <div className="space-y-2">
        {rendered.map((field) => (
          <div key={field.label}>
            <p className="text-[10px] font-medium text-[var(--muted-foreground)]">{field.label}</p>
            {field.invalid ? (
              <p className="mt-0.5 text-xs text-amber-600">Konten tidak valid atau kosong.</p>
            ) : field.content ? (
              <div className="mt-0.5">{field.content}</div>
            ) : (
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">—</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function usePreviewFields(
  formId: string,
  fieldDefs: { name: string; label: string; type?: PreviewField["type"] }[],
): PreviewField[] {
  if (typeof document === "undefined") return fieldDefs.map((d) => ({ ...d, value: "" }));

  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return fieldDefs.map((d) => ({ ...d, value: "" }));

  return fieldDefs.map((def) => {
    const el = form.elements.namedItem(def.name);
    const value =
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
        ? el.value
        : "";
    return { label: def.label, value, type: def.type };
  });
}
