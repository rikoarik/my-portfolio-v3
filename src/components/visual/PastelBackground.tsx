"use client";

import { useEffect, useRef } from "react";

type PastelBackgroundProps = {
  className?: string;
  parallax?: boolean;
};

/**
 * Fixed pastel mesh backdrop with slow blob drift.
 * Add once near app root so page content scrolls above it.
 */
export function PastelBackground({ className = "", parallax = true }: PastelBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tx = Math.max(-20, Math.min(20, nx * 40));
      ty = Math.max(-20, Math.min(20, ny * 40));
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        root.style.setProperty("--pb-parallax-x", `${tx}px`);
        root.style.setProperty("--pb-parallax-y", `${ty}px`);
        raf = 0;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pastel-bg pointer-events-none fixed inset-0 overflow-hidden ${className}`}
    >
      <div className="pastel-bg__base" />
      <div className="pastel-bg__blob pastel-bg__blob--1" />
      <div className="pastel-bg__blob pastel-bg__blob--2" />
      <div className="pastel-bg__blob pastel-bg__blob--3" />
      <div className="pastel-bg__blob pastel-bg__blob--4" />
      <div className="pastel-bg__blob pastel-bg__blob--5" />
      <div className="pastel-bg__noise" />
      <div className="pastel-bg__grid" />
      <div className="pastel-bg__vignette" />
    </div>
  );
}

