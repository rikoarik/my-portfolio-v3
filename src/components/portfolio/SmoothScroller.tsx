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
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onRefresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onRefresh);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      delete (window as Window & { __portfolioLenis?: typeof lenis }).__portfolioLenis;
      window.removeEventListener("resize", onRefresh);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(el, undefined);
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
