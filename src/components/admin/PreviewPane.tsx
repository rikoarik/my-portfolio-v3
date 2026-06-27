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
                <ul className="list-inside list-disc text-sm">
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
                <pre className="overflow-auto rounded bg-[var(--accent)]/30 p-2 text-xs">
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
          content: <p className="text-sm whitespace-pre-wrap">{field.value}</p>,
          invalid: false,
        };
      }),
    [fields],
  );

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {title ?? "Preview"}
      </h3>
      <div className="space-y-4">
        {rendered.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-medium text-[var(--muted-foreground)]">{field.label}</p>
            {field.invalid ? (
              <p className="mt-1 text-sm text-amber-600">Konten tidak valid atau kosong.</p>
            ) : field.content ? (
              <div className="mt-1">{field.content}</div>
            ) : (
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">—</p>
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
