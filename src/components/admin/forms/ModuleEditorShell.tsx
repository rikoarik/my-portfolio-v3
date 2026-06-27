"use client";

import type { ReactNode } from "react";

/** Form column + optional preview; columns don't stretch to match height. */
export function ModuleEditorShell({
  form,
  preview,
}: {
  form: ReactNode;
  preview?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:gap-3">
      <div className="min-w-0 flex-1 lg:max-w-2xl">{form}</div>
      {preview ? (
        <div className="hidden w-full shrink-0 lg:block lg:w-48 xl:w-52">{preview}</div>
      ) : null}
    </div>
  );
}
