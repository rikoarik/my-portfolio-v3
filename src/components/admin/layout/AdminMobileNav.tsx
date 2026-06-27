"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminSidebar } from "./AdminSidebar";

export function AdminMobileNav({ userEmail }: { userEmail?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="admin-mobile-trigger lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="admin-mobile-overlay lg:hidden" role="presentation">
          <button
            type="button"
            className="admin-mobile-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />
          <div className="admin-mobile-drawer">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-3">
              <p className="text-sm font-semibold">Menu</p>
              <button
                type="button"
                className="admin-mobile-trigger"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <AdminSidebar
              userEmail={userEmail}
              onNavigate={() => setOpen(false)}
              className="admin-sidebar admin-sidebar--drawer"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
