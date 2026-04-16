"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/gsap";

/**
 * Lenis drives scroll via transform; ScrollTrigger must read/write through this proxy
 * or pin/end positions break and the page can feel “stuck” mid-document.
 */
export function SmoothScroller() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    // Safari: Lenis transform scrolling + ScrollTrigger proxy often breaks pins/animations.
    if (isSafari) return;

    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    (window as Window & { __portfolioLenis?: typeof lenis }).__portfolioLenis = lenis;

    const el = document.documentElement;

    ScrollTrigger.scrollerProxy(el, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    lenis.on("scroll", ScrollTrigger.update);

    let rafId: number;
    let running = true;
    const raf = (time: number) => {
      if (!running) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onRefresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onRefresh);

    // Some sections change height after first paint (fonts, images, content-visibility, GSAP).
    // Keep Lenis scroll limits in sync to avoid "stuck" scroll near mid-page.
    let roRaf = 0;
    const scheduleRefresh = () => {
      if (roRaf) return;
      roRaf = requestAnimationFrame(() => {
        roRaf = 0;
        onRefresh();
      });
    };
    const roTarget = document.getElementById("main") ?? document.body;
    const ro =
      typeof ResizeObserver !== "undefined" && roTarget
        ? new ResizeObserver(() => scheduleRefresh())
        : null;
    if (ro && roTarget) ro.observe(roTarget);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        running = false;
        cancelAnimationFrame(rafId);
        return;
      }
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      delete (window as Window & { __portfolioLenis?: typeof lenis }).__portfolioLenis;
      window.removeEventListener("resize", onRefresh);
      document.removeEventListener("visibilitychange", onVisibility);
      ro?.disconnect();
      if (roRaf) cancelAnimationFrame(roRaf);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(el, undefined);
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
