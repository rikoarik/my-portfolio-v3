"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import { HeroContribution3D } from "@/components/portfolio/HeroContribution3D";
import { Meteors } from "@/components/ui/meteors";
import type { GitHubContributionSummary, SectionContent, SiteProfile } from "@/types/portfolio";

const SCROLLER = typeof document !== "undefined" ? document.documentElement : null;
const SCROLL_FADE_PX = 100;

/**
 * Minimal editorial hero: centered-left copy + bottom bar.
 * Pill nav lives in IFNav (PortfolioClient).
 */
export function PastelHero({
  profile,
  section,
  contributions,
}: {
  profile: SiteProfile;
  section?: SectionContent;
  contributions: GitHubContributionSummary | null;
}) {
  const fallbackName = profile.full_name || "Arik Riko Prasetya";
  const parts = fallbackName.split(" ");
  const firstLine = section?.title?.split(" ").slice(0, 2).join(" ") || parts.slice(0, 2).join(" ");
  const secondLine =
    section?.title?.split(" ").slice(2).join(" ") ||
    parts.slice(2).join(" ") ||
    profile.title;
  const taglineLines = (section?.body ?? "He didn't wait to be taught.\nHe just started building.")
    .split("\n")
    .filter(Boolean);
  const roleText = section?.subtitle ?? profile.title;
  const ctaLabel =
    typeof section?.meta?.cta_label === "string" ? section.meta.cta_label : "Explore Work";
  const ctaHref = typeof section?.meta?.cta_href === "string" ? section.meta.cta_href : "#projects";
  const sectionRef = useRef<HTMLElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineLine1Ref = useRef<HTMLParagraphElement>(null);
  const taglineLine2Ref = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const n1 = nameLine1Ref.current;
    const n2 = nameLine2Ref.current;
    const role = roleRef.current;
    const t1 = taglineLine1Ref.current;
    const t2 = taglineLine2Ref.current;
    const scrollInd = scrollIndicatorRef.current;

    if (!section || !n1 || !n2 || !role || !t1 || !t2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([n1, n2, role, t1, t2], { opacity: 1, y: 0 });
      if (scrollInd) {
        const y = SCROLLER?.scrollTop ?? window.scrollY;
        gsap.set(scrollInd, { autoAlpha: y > SCROLL_FADE_PX ? 0 : 1 });
      }
      return;
    }

    registerGsapPlugins();

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;pointer-events:none;visibility:hidden;";
    sentinel.style.height = `${SCROLL_FADE_PX}px`;
    section.prepend(sentinel);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [n1, n2],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.3,
        }
      );

      gsap.fromTo(
        role,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 }
      );

      gsap.fromTo(
        [t1, t2],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.7,
        }
      );

      if (scrollInd && SCROLLER) {
        const syncIndicator = () => {
          const y = SCROLLER.scrollTop || window.scrollY;
          gsap.set(scrollInd, { autoAlpha: y > SCROLL_FADE_PX ? 0 : 1 });
        };

        ScrollTrigger.create({
          trigger: sentinel,
          scroller: SCROLLER,
          start: "bottom top",
          onEnter: () => {
            gsap.to(scrollInd, { autoAlpha: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          },
          onLeaveBack: () => {
            gsap.to(scrollInd, { autoAlpha: 1, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
          },
        });

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          syncIndicator();
        });
      }
    }, section);

    return () => {
      sentinel.remove();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-transparent"
    >
      <Meteors number={25} />
      <div className="flex min-h-0 relative z-10 flex-1 flex-col px-5 pb-10 pt-[max(4.5rem,env(safe-area-inset-top))] sm:px-[36px]">
        <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
          <div className="max-w-[min(100%,520px)]">
            <h1 className="text-left text-[clamp(2.4rem,10vw,3.5rem)] font-bold leading-none tracking-[-0.03em] text-[var(--foreground)] sm:text-[clamp(3rem,8vw,5.5rem)]">
              <span ref={nameLine1Ref} className="block">
                {firstLine}
              </span>
              <span ref={nameLine2Ref} className="block">
                {secondLine}
              </span>
            </h1>

            <p
              ref={roleRef}
              className="mt-4 uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "color-mix(in srgb, var(--muted-foreground) 60%, transparent)",
              }}
            >
              {roleText}
            </p>

            <div className="mt-6 max-w-[340px] space-y-1">
              <p
                ref={taglineLine1Ref}
                className="text-[0.9rem] italic text-[var(--muted-foreground)]"
              >
                {taglineLines[0] ?? ""}
              </p>
              <p ref={taglineLine2Ref} className="text-[0.9rem] font-medium text-[var(--foreground)]">
                {taglineLines[1] ?? profile.tagline}
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroContribution3D summary={contributions} />
          </div>
        </div>

        <div className="mt-10 max-w-[min(100%,520px)] shrink-0 sm:mt-12">
          <a
            href={ctaHref}
            className="inline-block rounded-full font-mono-meta uppercase transition-transform duration-200 hover:scale-[1.03]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--foreground) 82%, transparent)",
              color: "var(--background)",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: "0.68rem",
              letterSpacing: "0.07em",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="pointer-events-none absolute z-10 flex flex-col items-center gap-2"
        style={{
          bottom: 28,
          right: 36,
          color: "color-mix(in srgb, var(--muted-foreground) 40%, transparent)",
        }}
        aria-hidden
      >
        <span className="block bg-current" style={{ width: 1, height: 24 }} />
        <span
          className="font-mono-meta text-[0.65rem] tracking-[0.08em]"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}
