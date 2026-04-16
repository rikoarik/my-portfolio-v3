"use client";

import { useEffect, useRef } from "react";

/**
 * Soft radial spotlight that follows the mouse cursor.
 * Uses CSS custom properties for zero-layout-thrash updates.
 * Renders a fixed full-screen div with a radial-gradient.
 */
export function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    // Throttle with rAF for smooth 60fps
    let rafId = 0;
    let mx = 0.5;
    let my = 0.5;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          el.style.setProperty("--spot-x", `${(mx * 100).toFixed(1)}%`);
          el.style.setProperty("--spot-y", `${(my * 100).toFixed(1)}%`);
          
          // Set global vars on root for the InteractiveGrid to use
          document.documentElement.style.setProperty("--mouse-x", `${(mx * 100).toFixed(1)}%`);
          document.documentElement.style.setProperty("--mouse-y", `${(my * 100).toFixed(1)}%`);
          
          rafId = 0;
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="mouse-spotlight"
      style={{
        "--spot-x": "50%",
        "--spot-y": "50%",
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
