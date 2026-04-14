"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { postGuestMessage } from "@/app/guestbook/actions";
import { gsap } from "@/lib/gsap";

export function CommentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [state, action, isPending] = useActionState(postGuestMessage, null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        ".ifs-comment-modal",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power4.out" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        onClose();
        // Reset state or handle success UI
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="ifs-comment-backdrop fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="ifs-comment-modal relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-2">Leave a Message</h3>
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
              className="w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
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
              className="w-full px-4 py-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
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
            className="w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? "Sending..." : state?.success ? "Success!" : "Post Message"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
