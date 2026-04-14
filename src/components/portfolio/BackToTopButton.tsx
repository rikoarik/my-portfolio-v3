"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";

type WindowWithLenis = Window & { __portfolioLenis?: Lenis };

const SCROLL_SHOW_THRESHOLD = 160;

function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = (window as WindowWithLenis).__portfolioLenis;

  if (lenis) {
    lenis.scrollTo(0, {
      immediate: reduced,
      ...(reduced ? {} : { duration: 1.1 }),
    });
    return;
  }

  if (reduced) {
    window.scrollTo(0, 0);
    return;
  }

  const hero = document.getElementById("hero");
  if (hero) {
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Fixed pojok kanan bawah — di atas lapisan konten (z-50) supaya klik tidak ketutup kolom pointer-events.
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getScrollY = () => {
      const lenis = (window as WindowWithLenis).__portfolioLenis;
      if (lenis) return lenis.scroll;
      return window.scrollY || document.documentElement.scrollTop;
    };

    const update = () => {
      setVisible(getScrollY() > SCROLL_SHOW_THRESHOLD);
    };

    update();

    let unsubLenis: (() => void) | undefined;
    const attachLenis = (): boolean => {
      const L = (window as WindowWithLenis).__portfolioLenis;
      if (!L) return false;
      unsubLenis = L.on("scroll", update);
      return true;
    };

    let pollId: ReturnType<typeof setInterval> | undefined;
    if (!attachLenis()) {
      let attempts = 0;
      pollId = setInterval(() => {
        attempts += 1;
        if (attachLenis() || attempts >= 50) {
          if (pollId !== undefined) clearInterval(pollId);
        }
      }, 40);
    }

    window.addEventListener("scroll", update, { passive: true });
    return () => {
      if (pollId !== undefined) clearInterval(pollId);
      unsubLenis?.();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`font-mono-meta fixed z-[50] rounded-md border border-[var(--border)] bg-[var(--background)]/85 px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted-foreground)] shadow-sm backdrop-blur-sm transition-[color,opacity,transform] hover:text-[var(--foreground)] active:scale-[0.98] ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        right: "max(0.75rem, env(safe-area-inset-right))",
      }}
      aria-label="Kembali ke atas"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      ↑ Atas
    </button>
  );
}
