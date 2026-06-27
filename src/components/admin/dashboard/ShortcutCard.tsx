import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  green: "bg-green-50 text-green-600 border-green-100",
  orange: "bg-amber-50 text-amber-600 border-amber-100",
} as const;

export function ShortcutCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: keyof typeof COLOR_MAP;
}) {
  return (
    <Link href={href} className="block h-full">
      <article className="admin-card admin-card-hover flex h-full flex-col gap-3 p-4 transition-all">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("inline-flex rounded-lg border p-2", COLOR_MAP[color])}>
            <Icon className="size-4" aria-hidden />
          </span>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">{description}</p>
        </div>
      </article>
    </Link>
  );
}
