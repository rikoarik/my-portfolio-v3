import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminListCard({
  title,
  meta,
  children,
  actions,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card className="admin-card border-[var(--border)] bg-[var(--card)] shadow-none">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="truncate text-base font-semibold">{title}</CardTitle>
          {meta ? (
            <p className="font-mono-meta mt-1 text-xs text-[var(--muted-foreground)]">{meta}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
