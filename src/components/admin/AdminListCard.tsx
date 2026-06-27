import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminListCard({
  title,
  meta,
  children,
  actions,
  editHref,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  editHref?: string;
}) {
  const inner = (
    <Card className="admin-card border-[var(--border)] bg-[var(--card)] py-0 shadow-none transition hover:border-[var(--primary)]/30">
      <CardHeader className="flex flex-col gap-1 px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold leading-snug">{title}</CardTitle>
          {meta ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">{meta}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        ) : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );

  if (editHref) {
    return (
      <Link href={editHref} className="block rounded-[var(--admin-radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
        {inner}
      </Link>
    );
  }

  return inner;
}
