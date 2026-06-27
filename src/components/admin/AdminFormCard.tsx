import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminFormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="admin-card border-[var(--border)] bg-[var(--card)] shadow-none">
      <CardHeader className="space-y-0.5 p-3 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="p-3 pt-0">{children}</CardContent>
    </Card>
  );
}
