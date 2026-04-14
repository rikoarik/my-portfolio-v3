"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Lenis from "lenis";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import { MagneticHover } from "@/components/interactions/MagneticHover";

const DEFAULT_NAV_ITEMS = [
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "career", label: "Career" },
  { id: "guestbook", label: "Guestbook" },
  { id: "contact", label: "Contact" },
] as const;

const SCROLLER = typeof document !== "undefined" ? document.documentElement : null;

const BACKDROP_HERO = "blur(0px)";
const BACKDROP_FLOAT = "blur(16px)";
const NAV_SCROLL_OFFSET_DESKTOP = 84;
const NAV_SCROLL_OFFSET_MOBILE = 64;
const NAV_GUESTBOOK_EXTRA_OFFSET_DESKTOP = 92;
const NAV_GUESTBOOK_EXTRA_OFFSET_MOBILE = 72;

type WindowWithLenis = Window & { __portfolioLenis?: Lenis };

function setNavBackdrop(el: HTMLElement, value: string) {
  el.style.setProperty("backdrop-filter", value);
  el.style.setProperty("-webkit-backdrop-filter", value);
}

const stickyBarVars: gsap.TweenVars = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  xPercent: 0,
  borderRadius: "0px",
  backgroundColor: "rgba(255, 255, 255, 0)",
  boxShadow: "none",
  padding: "0.75rem max(1.25rem, env(safe-area-inset-left)) 0.75rem max(1.25rem, env(safe-area-inset-right))",
};

const floatingBarVars: gsap.TweenVars = {
  position: "fixed",
  top: 16,
  left: "50%",
  right: "auto",
  width: "fit-content",
  xPercent: -50,
  borderRadius: "999px",
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: "0.4rem 0.5rem",
};

export function IFNav({
  brand,
  items,
}: {
  brand: string;
  items?: { id: string; label: string }[];
}) {
  const navItems = useMemo(() => (items?.length ? items : DEFAULT_NAV_ITEMS), [items]);
  const [active, setActive] = useState<string>("");
  const [barMode, setBarMode] = useState<"hero" | "float">("hero");
  const [isDesktopLayout, setIsDesktopLayout] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const isFloatingRef = useRef(false);
  const prevActiveRef = useRef<string>("");

  const getCurrentScrollY = useCallback(() => {
    const lenis = (window as WindowWithLenis).__portfolioLenis;
    if (lenis) return lenis.scroll;
    return window.scrollY || document.documentElement.scrollTop;
  }, []);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const baseOffset = isDesktopLayout ? NAV_SCROLL_OFFSET_DESKTOP : NAV_SCROLL_OFFSET_MOBILE;
      const guestbookExtra =
        id === "guestbook"
          ? isDesktopLayout
            ? NAV_GUESTBOOK_EXTRA_OFFSET_DESKTOP
            : NAV_GUESTBOOK_EXTRA_OFFSET_MOBILE
          : 0;
      const offset = guestbookExtra - baseOffset;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lenis = (window as WindowWithLenis).__portfolioLenis;

      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          immediate: reduced,
          ...(reduced ? {} : { duration: 0.95 }),
        });
      } else {
        const top = Math.max(0, Math.round(target.getBoundingClientRect().top + getCurrentScrollY() + offset));
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      }
    },
    [getCurrentScrollY, isDesktopLayout],
  );

  const scrollToTop = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = (window as WindowWithLenis).__portfolioLenis;
    if (lenis) {
      lenis.scrollTo(0, {
        immediate: reduced,
        ...(reduced ? {} : { duration: 0.95 }),
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 481px)");
    const update = () => setIsDesktopLayout(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const pill = pillRef.current;
    const heroEl = document.getElementById("hero");
    if (!pill || !SCROLLER || !heroEl) return;

    const mqDesktop = window.matchMedia("(min-width: 481px)");
    if (!mqDesktop.matches) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(pill, floatingBarVars);
      setNavBackdrop(pill, BACKDROP_FLOAT);
      pill.style.setProperty("border", "1px solid var(--border)");
      isFloatingRef.current = true;
      queueMicrotask(() => setBarMode("float"));
      return;
    }

    registerGsapPlugins();

    const applySticky = () => {
      if (!isFloatingRef.current) return;
      isFloatingRef.current = false;
      setBarMode("hero");
      gsap.to(pill, {
        ...stickyBarVars,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: "auto",
        onStart: () => {
          setNavBackdrop(pill, BACKDROP_HERO);
          pill.style.setProperty("border", "none");
        },
      });
    };

    const applyFloating = () => {
      if (isFloatingRef.current) return;
      isFloatingRef.current = true;
      setBarMode("float");
      gsap.to(pill, {
        ...floatingBarVars,
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
        onStart: () => {
          setNavBackdrop(pill, BACKDROP_FLOAT);
          pill.style.setProperty("border", "1px solid var(--border)");
        },
      });
    };

    gsap.set(pill, stickyBarVars);
    setNavBackdrop(pill, BACKDROP_HERO);
    pill.style.setProperty("border", "none");
    isFloatingRef.current = false;
    queueMicrotask(() => setBarMode("hero"));

    const syncActiveFromViewport = () => {
      const mid = getCurrentScrollY() + window.innerHeight * 0.5;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const top = r.top + getCurrentScrollY();
        const bottom = top + r.height;
        if (mid >= top && mid <= bottom) {
          setActive(item.id);
          return;
        }
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroEl,
        scroller: SCROLLER,
        start: "bottom top",
        onEnter: applyFloating,
        onLeaveBack: applySticky,
      });

      navItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          scroller: SCROLLER,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(item.id);
          },
        });
      });

      ScrollTrigger.refresh();

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom <= 0) {
          gsap.set(pill, floatingBarVars);
          setNavBackdrop(pill, BACKDROP_FLOAT);
          pill.style.setProperty("border", "1px solid var(--border)");
          isFloatingRef.current = true;
          queueMicrotask(() => setBarMode("float"));
        }
        syncActiveFromViewport();
      });
    }, pill);

    return () => {
      ctx.revert();
      pill.style.removeProperty("border");
    };
  }, [getCurrentScrollY, navItems]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 481px)").matches) return;

    const prev = prevActiveRef.current;
    prevActiveRef.current = active;
    if (!active || prev === active) return;

    const link = nav.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!link) return;

    gsap.fromTo(
      link,
      { scale: 0.8, transformOrigin: "50% 50%" },
      { scale: 1, duration: 0.35, ease: "back.out(1.4)", overwrite: "auto" }
    );
  }, [active]);

  const heroVisual = barMode === "hero" && isDesktopLayout;

  return (
    <nav
      id="nav"
      ref={navRef}
      className="ifs-nav-root pointer-events-none fixed inset-x-0 top-0 z-[55]"
      aria-label="Site navigation"
    >
      <div
        ref={pillRef}
        className={
          `ifs-nav ifs-nav--visible pointer-events-auto flex flex-wrap items-center ${
            !isDesktopLayout ? "justify-center" : ""
          } gap-1 ${heroVisual ? "ifs-nav--hero" : ""}`
        }
      >
        <MagneticHover strength={15}>
          <button
            type="button"
            className={
              heroVisual
                ? "ifs-nav-brand"
                : "ifs-nav-brand"
            }
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            {brand}
          </button>
        </MagneticHover>
        {navItems.map((item) => (
          <MagneticHover key={item.id} strength={15}>
            <a
              href={`#${item.id}`}
              className={
                heroVisual
                  ? `ifs-nav-link ${
                      active === item.id ? "underline decoration-2 underline-offset-4" : ""
                    }`
                  : `ifs-nav-link${active === item.id ? " ifs-nav-link--active" : ""}`
              }
              onClick={(e) => {
                e.preventDefault();
                setActive(item.id);
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          </MagneticHover>
        ))}
      </div>
    </nav>
  );
}
