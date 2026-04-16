"use client";

import { loadGsap, registerGsapPlugins } from "@/lib/gsap";

type SectionEl = HTMLElement & { dataset: { section?: string; accent?: string } };

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setAmbient(accent: string | undefined) {
  const root = document.documentElement;
  if (!accent) return;

  // Warm calm presets; can extend later.
  if (accent === "apricot") {
    root.style.setProperty("--ambient-a", "rgb(255 178 107 / 0.14)");
    root.style.setProperty("--ambient-b", "rgb(243 154 182 / 0.10)");
    root.style.setProperty("--ambient-c", "rgb(255 238 209 / 0.08)");
  } else if (accent === "rose") {
    root.style.setProperty("--ambient-a", "rgb(243 154 182 / 0.14)");
    root.style.setProperty("--ambient-b", "rgb(255 178 107 / 0.09)");
    root.style.setProperty("--ambient-c", "rgb(255 238 209 / 0.08)");
  } else if (accent === "cream") {
    root.style.setProperty("--ambient-a", "rgb(255 238 209 / 0.12)");
    root.style.setProperty("--ambient-b", "rgb(255 178 107 / 0.09)");
    root.style.setProperty("--ambient-c", "rgb(243 154 182 / 0.08)");
  }
}

export function setupSectionCinematics(root: HTMLElement) {
  if (prefersReducedMotion()) return () => {};

  const sections = Array.from(root.querySelectorAll("[data-section]")).filter(
    (n): n is SectionEl => n instanceof HTMLElement,
  );
  if (!sections.length) return () => {};

  let ctx: { revert: () => void } | null = null;
  let mounted = true;

  void (async () => {
    await registerGsapPlugins();
    if (!mounted) return;
    const { gsap } = await loadGsap();
    if (!mounted) return;

    ctx = gsap.context(() => {
      sections.forEach((section) => {
        const accent = section.dataset.accent;

        // Mask-ish reveal: clipPath + fade + lift + blur.
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 22,
            filter: "blur(10px)",
            clipPath: "inset(12% 0% 18% 0% round 28px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              end: "top 45%",
              scrub: 0.55,
              onEnter: () => setAmbient(accent),
              onEnterBack: () => setAmbient(accent),
            },
          },
        );

        // Subtle background parallax inside each section (optional).
        const parallax = section.querySelector("[data-parallax]");
        if (parallax instanceof HTMLElement) {
          gsap.fromTo(
            parallax,
            { y: 18, opacity: 0.75 },
            {
              y: -18,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        }
      });
    }, root);
  })();

  return () => {
    mounted = false;
    ctx?.revert();
  };
}

