import { signOutAdmin } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ADMIN_NAV_GROUPS } from "@/lib/admin/nav-config";

import { AdminNavLink } from "./AdminNavLink";

export function AdminSidebar({
  userEmail,
  onNavigate,
  className,
}: {
  userEmail?: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <aside className={className ?? "admin-sidebar"}>
      <div className="space-y-1">
        <p className="admin-sidebar-title">CMS Panel</p>
        <p className="admin-sidebar-subtitle">Portfolio content management</p>
      </div>

      <nav className="admin-sidebar-nav mt-6 flex-1 space-y-5 overflow-y-auto">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="admin-nav-group-title">{group.title}</p>
            <div className="mt-1 grid gap-0.5">
              {group.items.map((item) => (
                <AdminNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  exact={item.exact}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer mt-auto space-y-3 pt-4">
        {userEmail ? (
          <div className="admin-user-chip">
            <span className="admin-user-chip-dot" aria-hidden />
            <span className="truncate text-xs">{userEmail}</span>
          </div>
        ) : null}
        <AdminNavLink href="/" label="Lihat situs" onNavigate={onNavigate} />
        <form action={signOutAdmin}>
          <SubmitButton variant="outline" size="sm" className="w-full" pendingText="Keluar...">
            Keluar
          </SubmitButton>
        </form>
      </div>
    </aside>
  );
}
