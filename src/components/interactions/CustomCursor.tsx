"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — dot + trailing ring.
 * Pure CSS transforms + rAF for positioning (no GSAP dependency).
 * Only renders on non-touch desktop devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(true); // assume touch until proven otherwise

  // Mount guard for SSR
  useEffect(() => {
    setMounted(true);
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide native cursor
    document.documentElement.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    let visible = false;
    let hovering = false;
    let cursorText = "";
    let rafId = 0;

    // Smooth ring follow via lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.15);

      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      show();

      // Check what we're hovering
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = target?.closest("a, button, input, textarea, select, [role='button'], label");
      const dataCursor = target?.closest("[data-cursor]") as HTMLElement | null;

      if (dataCursor) {
        hovering = true;
        const newText = dataCursor.getAttribute("data-cursor-text") || "";
        if (newText !== cursorText) {
          cursorText = newText;
          const textEl = ring.querySelector(".cc-text") as HTMLElement;
          if (textEl) {
            textEl.textContent = cursorText;
            textEl.style.opacity = cursorText ? "1" : "0";
          }
        }
        dot.style.opacity = cursorText ? "0" : "0.4";
        ring.style.borderColor = "var(--primary)";
        ring.style.background = "rgba(74, 157, 110, 0.12)";
      } else if (clickable) {
        hovering = true;
        cursorText = "";
        const textEl = ring.querySelector(".cc-text") as HTMLElement;
        if (textEl) textEl.style.opacity = "0";
        dot.style.opacity = "1";
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(0.5)`;
        ring.style.borderColor = "var(--primary)";
        ring.style.background = "rgba(74, 157, 110, 0.08)";
      } else {
        hovering = false;
        cursorText = "";
        const textEl = ring.querySelector(".cc-text") as HTMLElement;
        if (textEl) textEl.style.opacity = "0";
        dot.style.opacity = "1";
        ring.style.borderColor = "color-mix(in srgb, var(--foreground) 25%, transparent)";
        ring.style.background = "transparent";
      }
    };

    const onLeave = () => hide();
    const onEnter = () => show();

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.style.cursor = "";
      styleEl.remove();
    };
  }, [mounted, isTouch]);

  if (!mounted || isTouch) return null;

  return (
    <>
      {/* Ring — trails behind with lerp */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid color-mix(in srgb, var(--foreground) 25%, transparent)",
          background: "transparent",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transition: "width 0.3s, height 0.3s, border-color 0.25s, background 0.25s, opacity 0.25s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
        }}
      >
        <span
          className="cc-text"
          style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "var(--foreground)",
            opacity: 0,
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        />
      </div>

      {/* Dot — follows mouse exactly */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--foreground)",
          pointerEvents: "none",
          zIndex: 100000,
          opacity: 0,
          transition: "opacity 0.25s, transform 0.1s",
          willChange: "transform",
        }}
      />
    </>
  );
}
