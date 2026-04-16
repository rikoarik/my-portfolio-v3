"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    if (isTouch || isSafari) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    // Hide native cursor
    document.documentElement.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    let visible = false;
    let hovering = false;
    let cursorText = "";
    let rafId = 0;
    let running = false;

    // Smooth ring follow via lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.15);

      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;

      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      start();
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      stop();
    };

    const setCursorText = (nextText: string) => {
      if (nextText === cursorText) return;
      cursorText = nextText;
      const textEl = ring.querySelector(".cc-text") as HTMLElement | null;
      if (textEl) {
        textEl.textContent = cursorText;
        textEl.style.opacity = cursorText ? "1" : "0";
      }
    };

    const setHoverMode = (mode: "data" | "clickable" | "none") => {
      if (mode === "data") {
        hovering = true;
        dot.style.opacity = cursorText ? "0" : "0.4";
        ring.style.borderColor = "var(--primary)";
        ring.style.background = "rgba(74, 157, 110, 0.12)";
        return;
      }
      if (mode === "clickable") {
        hovering = true;
        setCursorText("");
        dot.style.opacity = "1";
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(0.5)`;
        ring.style.borderColor = "var(--primary)";
        ring.style.background = "rgba(74, 157, 110, 0.08)";
        return;
      }
      hovering = false;
      setCursorText("");
      dot.style.opacity = "1";
      ring.style.borderColor = "color-mix(in srgb, var(--foreground) 25%, transparent)";
      ring.style.background = "transparent";
    };

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      show();
    };

    const onLeave = () => hide();
    const onEnter = () => show();

    // Event delegation: compute hover mode on pointerover/focusin, not every mousemove
    const computeHover = (t: EventTarget | null) => {
      const target = t instanceof Element ? t : null;
      const dataCursor = target?.closest("[data-cursor]") as HTMLElement | null;
      if (dataCursor) {
        setCursorText(dataCursor.getAttribute("data-cursor-text") || "");
        setHoverMode("data");
        return;
      }
      const clickable = target?.closest(
        "a, button, input, textarea, select, [role='button'], label",
      );
      setHoverMode(clickable ? "clickable" : "none");
    };

    const onOver = (e: PointerEvent) => computeHover(e.target);
    const onFocusIn = (e: FocusEvent) => computeHover(e.target);
    const onOut = (e: PointerEvent) => {
      const to = (e.relatedTarget instanceof Element ? e.relatedTarget : null) as Element | null;
      computeHover(to);
    };
    let hoverRaf = 0;
    const refreshHover = () => {
      if (!visible || hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        const t = document.elementFromPoint(pos.current.x, pos.current.y);
        computeHover(t);
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else if (visible) start();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", refreshHover, { passive: true });
    window.addEventListener("resize", refreshHover, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("pointerover", onOver, { capture: true, passive: true });
    document.addEventListener("pointerout", onOut, { capture: true, passive: true });
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", refreshHover);
      window.removeEventListener("resize", refreshHover);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("visibilitychange", onVisibility);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      document.documentElement.style.cursor = "";
      styleEl.remove();
    };
  }, []);

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
