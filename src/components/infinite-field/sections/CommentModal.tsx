"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { postGuestMessage, type GuestMessageActionState } from "@/app/guestbook/actions";
import { useT } from "@/i18n/context";
import { loadGsap } from "@/lib/gsap";

export function CommentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const [state, action, isPending] = useActionState<GuestMessageActionState, FormData>(
    postGuestMessage,
    null,
  );
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const errorMessage = state && "errorKey" in state ? t(state.errorKey) : null;
  const isSuccess = Boolean(state && "success" in state);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const closeWithAnim = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) {
      onClose();
      return;
    }
    void (async () => {
      const { gsap } = await loadGsap();
      const tl = gsap.timeline({
        defaults: { ease: "power3.in" },
        onComplete: () => {
          closingRef.current = false;
          onClose();
        },
      });
      tl.to(panel, { opacity: 0, y: 18, scale: 0.97, duration: 0.26 }).to(
        backdrop,
        { opacity: 0, duration: 0.2 },
        "<0.04",
      );
    })();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      closingRef.current = false;
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    let tl: { kill: () => void } | null = null;
    let mountedNow = true;

    void (async () => {
      const { gsap } = await loadGsap();
      if (!mountedNow) return;

      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { opacity: 0, y: 28, scale: 0.96 });
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl = timeline;
      timeline.to(backdrop, { opacity: 1, duration: 0.26 }).to(
        panel,
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.25)" },
        "<+0.04",
      );
    })();

    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      mountedNow = false;
      window.clearTimeout(focusTimer);
      tl?.kill();
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWithAnim();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeWithAnim]);

  useEffect(() => {
    if (isSuccess) {
      const timer = window.setTimeout(() => {
        closeWithAnim();
      }, 1000);
      return () => window.clearTimeout(timer);
    }
  }, [isSuccess, closeWithAnim]);

  if (!isOpen || !mounted) return null;

  const portalRoot = document.getElementById("main") ?? document.body;

  return createPortal(
    <div
      ref={backdropRef}
      className="ifs-comment-backdrop fixed inset-0 z-[100] flex items-center justify-center px-[max(1rem,env(safe-area-inset-left),env(safe-area-inset-right))] py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8"
      onClick={closeWithAnim}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="ifs-comment-modal relative w-full max-w-md rounded-2xl p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ifs-guestbook-modal-title"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={closeWithAnim}
          className="ifs-comment-modal-close absolute top-4 right-4"
          aria-label={t("guestbook.modal.closeAria")}
        >
          {"\u2715"}
        </button>

        <h3 id="ifs-guestbook-modal-title" className="text-2xl font-bold mb-2 text-[var(--foreground)]">
          {t("guestbook.modal.title")}
        </h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6">
          {t("guestbook.modal.subtitle")}
        </p>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              {t("guestbook.modal.nameLabel")}
            </label>
            <input
              name="name"
              required
              placeholder={t("guestbook.modal.namePlaceholder")}
              className="ifs-comment-modal-field w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              {t("guestbook.modal.messageLabel")}
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder={t("guestbook.modal.messagePlaceholder")}
              className="ifs-comment-modal-field w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
            />
          </div>

          {errorMessage ? (
            <p className="text-red-500 text-xs font-medium">{errorMessage}</p>
          ) : null}

          {isSuccess ? (
            <p className="text-emerald-500 text-xs font-medium">
              {t("guestbook.modal.successMessage")}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || isSuccess}
            className="ifs-comment-modal-submit w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending
              ? t("guestbook.modal.sending")
              : isSuccess
                ? t("guestbook.modal.success")
                : t("guestbook.modal.post")}
          </button>
        </form>
      </div>
    </div>,
    portalRoot,
  );
}
