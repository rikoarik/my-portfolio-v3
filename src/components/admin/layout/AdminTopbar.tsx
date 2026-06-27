"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ModuleSearch } from "@/components/admin/ModuleSearch";
import { getAdminPageTitle } from "@/lib/admin/nav-config";

import { AdminMobileNav } from "./AdminMobileNav";

export function AdminTopbar({
  userEmail,
  pathname,
}: {
  userEmail?: string | null;
  pathname: string;
}) {
  const title = getAdminPageTitle(pathname);

  return (
    <header className="admin-topbar">
      <div className="flex min-w-0 items-center gap-3">
        <AdminMobileNav userEmail={userEmail} />
        <div className="min-w-0">
          <p className="admin-topbar-kicker">CMS / {title}</p>
          <h1 className="admin-topbar-title truncate">{title}</h1>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <ModuleSearch />
        <Link href="/" className="admin-topbar-link hidden sm:inline-flex">
          Lihat situs
          <ExternalLink className="size-3.5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
