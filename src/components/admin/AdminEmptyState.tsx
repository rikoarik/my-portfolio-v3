import type { ReactNode } from "react";

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-empty">
      <p className="text-sm font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
