"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { postGuestMessage } from "@/app/guestbook/actions";
import { loadGsap } from "@/lib/gsap";

export function CommentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [state, action, isPending] = useActionState(postGuestMessage, null);
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

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

    let tl: any = null;
    let mountedNow = true;

    void (async () => {
      const { gsap } = await loadGsap();
      if (!mountedNow) return;

      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { opacity: 0, y: 28, scale: 0.96 });
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(backdrop, { opacity: 1, duration: 0.26 }).to(
        panel,
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.25)" },
        "<+0.04",
      );
    })();

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      mountedNow = false;
      window.clearTimeout(t);
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
    if (state?.success) {
      const timer = window.setTimeout(() => {
        closeWithAnim();
      }, 1000);
      return () => window.clearTimeout(timer);
    }
  }, [state?.success, closeWithAnim]);

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
          aria-label="Tutup formulir pesan"
        >
          {"\u2715"}
        </button>

        <h3 id="ifs-guestbook-modal-title" className="text-2xl font-bold mb-2 text-[var(--foreground)]">
          Leave a Message
        </h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6">
          Your message will join the infinite field of drift.
        </p>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Your Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Satoshi"
              className="ifs-comment-modal-field w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="What's on your mind?"
              className="ifs-comment-modal-field w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
            />
          </div>

          {state?.error ? (
            <p className="text-red-500 text-xs font-medium">{state.error}</p>
          ) : null}

          {state?.success ? (
            <p className="text-emerald-500 text-xs font-medium">
              Pesan terkirim! Sampai jumpa di rute pelayaran.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || !!state?.success}
            className="ifs-comment-modal-submit w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? "Sending..." : state?.success ? "Success!" : "Post Message"}
          </button>
        </form>
      </div>
    </div>,
    portalRoot,
  );
}
