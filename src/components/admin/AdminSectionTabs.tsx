"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const SECTION_TABS = ["all", "hero", "about", "proof", "contact", "nav"] as const;

export function AdminSectionTabs({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SECTION_TABS.map((tab) => {
        const href =
          tab === "all"
            ? "/admin/dashboard/sections"
            : `/admin/dashboard/sections?tab=${tab}`;
        const isActive = active === tab;
        return (
          <Link
            key={tab}
            href={href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              isActive
                ? "border-[var(--primary)] bg-[var(--accent)] text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[#bfdbfe] hover:bg-[var(--admin-accent-soft)]",
            )}
          >
            {tab}
          </Link>
        );
      })}
    </div>
  );
}
