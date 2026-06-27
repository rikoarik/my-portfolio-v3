"use client";

import { usePathname } from "next/navigation";

import { NavigationGuard } from "@/components/admin/NavigationGuard";

import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      <NavigationGuard pathname={pathname} />
      <div className="admin-shell min-h-screen">
        <AdminSidebar userEmail={userEmail} className="admin-sidebar hidden lg:flex" />
        <div className="admin-main-column">
          <AdminTopbar userEmail={userEmail} pathname={pathname} />
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </>
  );
}
