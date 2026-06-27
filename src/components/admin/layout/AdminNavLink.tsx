"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function AdminNavLink({
  href,
  label,
  exact = false,
  onNavigate,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("admin-nav-link", active && "admin-nav-link--active")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
