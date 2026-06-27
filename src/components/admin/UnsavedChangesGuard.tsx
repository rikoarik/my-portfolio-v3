"use client";

import { useEffect, useRef } from "react";

import { isDirty } from "@/lib/admin/dirty";
import { registerDirtyCheck as registerGlobalDirtyCheck } from "@/lib/admin/dirty-guard";

import { useUnsavedChangesGuard } from "./EditorForm";

export function UnsavedChangesGuard({ formId }: { formId?: string }) {
  const { registerDirtyCheck, state } = useUnsavedChangesGuard();
  const baselineRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(
      formId ? `#${formId}` : "form[data-editor-form]",
    );
    if (!form) return;

    const captureBaseline = () => {
      const values: Record<string, string> = {};
      const data = new FormData(form);
      for (const [key, val] of data.entries()) {
        if (typeof val === "string") values[key] = val;
      }
      baselineRef.current = values;
    };

    const checkDirty = () => {
      const current: Record<string, string> = {};
      const data = new FormData(form);
      for (const [key, val] of data.entries()) {
        if (typeof val === "string") current[key] = val;
      }
      return isDirty(baselineRef.current, current);
    };

    captureBaseline();
    registerDirtyCheck(checkDirty);
    const unregisterGlobal = registerGlobalDirtyCheck(checkDirty);

    return () => {
      unregisterGlobal();
    };
  }, [registerDirtyCheck, formId]);

  useEffect(() => {
    if (!state?.ok) return;
    const form = document.querySelector<HTMLFormElement>(
      formId ? `#${formId}` : "form[data-editor-form]",
    );
    if (!form) return;
    const values: Record<string, string> = {};
    const data = new FormData(form);
    for (const [key, val] of data.entries()) {
      if (typeof val === "string") values[key] = val;
    }
    baselineRef.current = values;
  }, [state, formId]);

  return null;
}
