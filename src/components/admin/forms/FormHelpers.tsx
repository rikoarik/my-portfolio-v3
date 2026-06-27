"use client";

import { useState } from "react";

import { useEditorFormState } from "@/components/admin/EditorForm";
import { cn } from "@/lib/utils";

export function FormTabs({
  tabs,
  defaultTab,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className="space-y-2">
      <div
        role="tablist"
        className="flex gap-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] p-0.5"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "flex-1 rounded px-2 py-1.5 text-xs font-medium transition",
              active === tab.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) =>
        active === tab.id ? (
          <div key={tab.id} role="tabpanel" className="space-y-2">
            {tab.content}
          </div>
        ) : null,
      )}
    </div>
  );
}

export function FormToolbar({
  formId,
  backHref,
  saveLabel = "Simpan",
  title,
  headerActions,
  statusDefault,
  featuredDefault,
  showStatus = false,
  showFeatured = false,
  children,
}: {
  formId: string;
  backHref?: string;
  saveLabel?: string;
  title?: string;
  headerActions?: React.ReactNode;
  statusDefault?: "draft" | "published";
  featuredDefault?: boolean;
  showStatus?: boolean;
  showFeatured?: boolean;
  children?: React.ReactNode;
}) {
  const ctx = useEditorFormState();
  const pending = ctx?.pending ?? false;
  const status =
    (ctx?.state && !ctx.state.ok && ctx.state.kind === "validation"
      ? ctx.state.values.status
      : statusDefault) ?? "draft";

  return (
    <div className="sticky top-0 z-20 mb-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-[var(--border)] bg-[var(--background)] py-1 backdrop-blur">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {backHref ? (
          <a
            href={backHref}
            className="shrink-0 text-[10px] font-medium text-[var(--primary)] hover:underline"
          >
            ← Daftar
          </a>
        ) : null}
        {title ? (
          <span className="hidden max-w-[12rem] truncate text-xs font-semibold sm:inline md:max-w-xs">
            {title}
          </span>
        ) : null}
        {showStatus ? (
          <PublishToggle key={status} name="status" defaultValue={status as "draft" | "published"} />
        ) : null}
        {showFeatured ? (
          <label className="flex items-center gap-1 text-[10px]">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={featuredDefault}
              className="size-3"
            />
            Featured
          </label>
        ) : null}
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {headerActions}
        <button
          type="submit"
          form={formId}
          disabled={pending}
          className="inline-flex h-7 items-center justify-center rounded-md bg-[var(--primary)] px-3 text-xs font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "..." : saveLabel}
        </button>
      </div>
    </div>
  );
}

export function CollapsibleFormSection({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className="group rounded-lg border border-[var(--border)] bg-[var(--card)]"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {description ? (
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
            ) : null}
          </div>
          <span className="text-xs text-[var(--muted-foreground)] transition group-open:rotate-180">
            ▼
          </span>
        </div>
      </summary>
      <div className="space-y-4 border-t border-[var(--border)] px-4 pb-4 pt-3">{children}</div>
    </details>
  );
}

export function PublishToggle({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: "draft" | "published";
}) {
  return (
    <div className="inline-flex rounded-md border border-[var(--border)] p-0.5">
      {(["draft", "published"] as const).map((value) => (
        <label
          key={value}
          className={cn(
            "cursor-pointer rounded px-2.5 py-1 text-xs font-medium capitalize transition",
            "has-[:checked]:bg-[var(--primary)] has-[:checked]:text-[var(--primary-foreground)]",
          )}
        >
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={defaultValue === value}
            className="sr-only"
          />
          {value === "draft" ? "Draft" : "Published"}
        </label>
      ))}
    </div>
  );
}

export function StickyFormActions({
  formId,
  backHref,
  saveLabel = "Simpan",
}: {
  formId: string;
  backHref?: string;
  pendingText?: string;
  saveLabel?: string;
}) {
  const ctx = useEditorFormState();
  const pending = ctx?.pending ?? false;

  return (
    <div className="sticky bottom-0 z-10 -mx-0.5 border-t border-[var(--border)] bg-[var(--background)]/95 px-0.5 py-2 backdrop-blur sm:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {backHref ? (
          <a
            href={backHref}
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Batal
          </a>
        ) : (
          <span />
        )}
        <button
          type="submit"
          form={formId}
          disabled={pending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : saveLabel}
        </button>
      </div>
      <p className="mt-1 text-right text-[10px] text-[var(--muted-foreground)]">
        ⌘/Ctrl + S untuk simpan
      </p>
    </div>
  );
}
