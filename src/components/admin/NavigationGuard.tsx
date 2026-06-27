"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { isAnyFormDirty } from "@/lib/admin/dirty-guard";

import { ConfirmDialog } from "./ConfirmDialog";

function isInternalNavLink(anchor: HTMLAnchorElement, pathname: string): boolean {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    return url.pathname !== pathname;
  } catch {
    return false;
  }
}

export function NavigationGuard({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isAnyFormDirty()) return;

      const anchor = (event.target as Element).closest("a");
      if (!anchor || !isInternalNavLink(anchor, pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(anchor.getAttribute("href"));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  const handleDiscard = useCallback(() => {
    if (pendingHref) {
      router.push(pendingHref);
    }
    setPendingHref(null);
  }, [pendingHref, router]);

  const handleStay = useCallback(() => {
    setPendingHref(null);
  }, []);

  return (
    <ConfirmDialog
      open={pendingHref !== null}
      title="Perubahan belum disimpan"
      description="Ada perubahan yang belum disimpan. Buang perubahan dan lanjut navigasi?"
      confirmLabel="Buang perubahan"
      cancelLabel="Tetap di halaman"
      onConfirm={handleDiscard}
      onCancel={handleStay}
    />
  );
}
