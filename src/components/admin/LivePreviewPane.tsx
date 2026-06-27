"use client";

import { useEffect, useState } from "react";

import { PreviewPane } from "./PreviewPane";

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "array" | "json";
};

export function LivePreviewPane({
  formId,
  title,
  fields,
}: {
  formId: string;
  title?: string;
  fields: FieldDef[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    const readValues = () => {
      const next: Record<string, string> = {};
      for (const field of fields) {
        const el = form.querySelector(`[name="${field.name}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null;
        next[field.name] = el?.value ?? "";
      }
      setValues(next);
    };

    readValues();
    const handler = () => readValues();
    form.addEventListener("input", handler);
    form.addEventListener("change", handler);
    return () => {
      form.removeEventListener("input", handler);
      form.removeEventListener("change", handler);
    };
  }, [formId, fields]);

  return (
    <PreviewPane
      title={title}
      fields={fields.map((f) => ({
        label: f.label,
        value: values[f.name] ?? "",
        type: f.type,
      }))}
    />
  );
}
