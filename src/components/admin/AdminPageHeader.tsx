import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Kembali",
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mb-3 space-y-1">
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center text-xs font-medium text-[var(--primary)] hover:underline"
        >
          ← {backLabel}
        </a>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
          {description ? (
            <div className="mt-0.5 max-w-2xl text-xs text-[var(--muted-foreground)]">{description}</div>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-1.5">{actions}</div> : null}
      </div>
    </div>
  );
}
