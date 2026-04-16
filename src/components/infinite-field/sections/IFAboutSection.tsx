"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import type { SectionContent } from "@/types/portfolio";

/* ── Character-split text for mask reveal ── */
function SplitChars({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          <span className="inline-flex overflow-hidden">
            {word.split("").map((char, ci) => (
              <span
                key={ci}
                className="ifs-about-char inline-block will-change-transform"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ── Line-by-line wrapper for mask reveal ── */
function MaskLine({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="ifs-about-line will-change-transform">{children}</div>
    </div>
  );
}

/* ── Stat counter with GSAP ── */
function StatBlock({
  value,
  suffix = "+",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  return (
    <div className="ifs-stat-block flex flex-col gap-2">
      <div className="flex items-baseline gap-1">
        <span
          ref={numRef}
          data-stat-value={value}
          className="ifs-stat-num font-black text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] leading-none tracking-tighter text-[var(--foreground)]"
        >
          0
        </span>
        <span className="text-[var(--primary)] font-bold text-3xl sm:text-4xl md:text-5xl">
          {suffix}
        </span>
      </div>
      <span className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] opacity-70">
        {label}
      </span>
    </div>
  );
}

import { InteractiveGridBackground } from "@/components/visual/InteractiveGridBackground";

export function IFAboutSection({
  section,
}: {
  section?: SectionContent;
}) {
  const rootRef = useRef<HTMLElement>(null);

  const headline =
    typeof section?.meta?.about_headline === "string" && section.meta.about_headline.trim()
      ? section.meta.about_headline
      : "Build products that feel clear, fast, and human.";
  const subline =
    typeof section?.meta?.about_intro === "string" && section.meta.about_intro.trim()
      ? section.meta.about_intro
      : "I turn ambitious product goals into production-ready interfaces — balancing clean architecture, sharp UX details, and smooth physics-based interactions that help users trust what they use.";
  const philosophyTitle =
    typeof section?.subtitle === "string" && section.subtitle.trim()
      ? section.subtitle
      : "Philosophy";
  const philosophyBody =
    typeof section?.body === "string" && section.body.trim()
      ? section.body
      : "I believe digital experiences should evoke emotion. Every pixel is an opportunity to tell a story and create a profound human connection.";
  const focusTitle =
    typeof section?.meta?.focus_title === "string" ? section.meta.focus_title : "Focus";
  const focusBody =
    typeof section?.meta?.focus_body === "string"
      ? section.meta.focus_body
      : "Specializing in high-end interactive frontend. I combine brutalist editorial aesthetics with creative engineering to craft award-winning, immersive digital products.";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerGsapPlugins();

    const ctx = gsap.context(() => {
      /* ── 1. Hero char reveal ────────────────────── */
      const chars = root.querySelectorAll(".ifs-about-char");
      gsap.set(chars, { y: "120%", opacity: 0, rotateZ: 8 });
      gsap.to(chars, {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        duration: 1.2,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.querySelector(".ifs-about-hero"),
          start: "top 80%",
        },
      });

      /* ── 2. Mask-line reveals ────────────────────── */
      const lines = root.querySelectorAll(".ifs-about-line");
      gsap.set(lines, { y: "100%", opacity: 0 });
      gsap.to(lines, {
        y: "0%",
        opacity: 1,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root.querySelector(".ifs-about-body"),
          start: "top 82%",
        },
      });

      /* ── 3. Horizontal marquee text (parallax) ── */
      const marquee = root.querySelector(".ifs-about-marquee");
      if (marquee) {
        gsap.to(marquee, {
          xPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: marquee,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      /* ── 4. Parallax divider line (scrub draw) ── */
      const divider = root.querySelector(".ifs-about-divider");
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: divider,
              start: "top 90%",
              end: "top 40%",
              scrub: true,
            },
          }
        );
      }

      /* ── 5. Stat counter animation ────────────── */
      const statNums = root.querySelectorAll<HTMLElement>(".ifs-stat-num");
      statNums.forEach((el) => {
        const target = parseInt(el.dataset.statValue ?? "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate() {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });

      /* ── 6. Grid cards stagger ─────────────────── */
      const gridCards = root.querySelectorAll(".ifs-about-card");
      gsap.set(gridCards, { y: 80, opacity: 0, scale: 0.96 });
      gsap.to(gridCards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.querySelector(".ifs-about-grid"),
          start: "top 80%",
        },
      });

      /* ── 7. Stat blocks stagger ────────────────── */
      const statBlocks = root.querySelectorAll(".ifs-stat-block");
      gsap.set(statBlocks, { y: 60, opacity: 0 });
      gsap.to(statBlocks, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.querySelector(".ifs-about-stats"),
          start: "top 85%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, [headline]);

  return (
    <section
      ref={rootRef}
      id="about"
      aria-labelledby="about-title"
      className="ifs-section relative overflow-hidden bg-[var(--background)]"
      style={{ padding: 0 }}
    >
      <InteractiveGridBackground />

      {/* ── PART 1: Hero Statement ── */}
      <div className="ifs-about-hero relative w-full pt-32 sm:pt-40 md:pt-52 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[85rem] mx-auto">
          {/* Section Label */}
          <div className="mb-12 md:mb-20">
            <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] opacity-60">
              [ 01 — {section?.title ?? "About Me"} ]
            </p>
          </div>

          {/* Massive Headline */}
          <h2
            id="about-title"
            className="font-sans font-black text-[clamp(2.5rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em] text-[var(--foreground)] uppercase max-w-[20ch]"
          >
            <SplitChars text={headline} />
          </h2>
        </div>
      </div>

      {/* ── PART 2: Horizontal Marquee Divider ── */}
      <div className="relative w-full overflow-hidden py-8 sm:py-12 md:py-16 border-y border-[var(--border)]">
        <div className="ifs-about-marquee whitespace-nowrap flex items-center gap-8 sm:gap-12 will-change-transform">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[clamp(3rem,10vw,12rem)] font-black uppercase tracking-tighter select-none shrink-0"
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
                opacity: 0.15,
              }}
            >
              {section?.title ?? "About Me"} •
            </span>
          ))}
        </div>
      </div>

      {/* ── PART 3: Body Content ── */}
      <div className="ifs-about-body relative w-full py-24 sm:py-32 md:py-40 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-12">

          {/* LEFT: Subline */}
          <div className="lg:col-span-5">
            <MaskLine className="mb-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-[1.4] text-[var(--foreground)]">
                {subline}
              </p>
            </MaskLine>
          </div>

          {/* RIGHT: Stats Row */}
          <div className="lg:col-span-6 lg:col-start-7 ifs-about-stats flex flex-wrap gap-12 sm:gap-16 lg:gap-20 items-start lg:pt-4">
            <StatBlock value={4} suffix="+" label="Years Experience" />
            <StatBlock value={20} suffix="+" label="Projects Shipped" />
            <StatBlock value={100} suffix="%" label="Passion Driven" />
          </div>
        </div>

        {/* Scrub Divider */}
        <div className="ifs-about-divider w-full h-[1px] bg-[var(--border)] my-16 md:my-24 will-change-transform" />

        {/* ── PART 4: Philosophy & Focus Grid ── */}
        <div className="ifs-about-grid max-w-[85rem] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">

          {/* Card A — Philosophy */}
          <div className="ifs-about-card relative p-8 sm:p-10 rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_80%,transparent)] backdrop-blur-sm group hover:border-[var(--foreground)] transition-colors duration-500">
            <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] group-hover:border-[var(--foreground)] transition-all duration-500">
              <span className="text-xl leading-none group-hover:rotate-45 transition-transform duration-500">↗</span>
            </div>
            <span className="font-mono-meta text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] opacity-50 block mb-8">
              ( 01 )
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-6">
              {philosophyTitle}
            </h3>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              {philosophyBody}
            </p>
          </div>

          {/* Card B — Focus (offset down for asymmetry) */}
          <div className="ifs-about-card relative p-8 sm:p-10 rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_80%,transparent)] backdrop-blur-sm sm:mt-16 group hover:border-[var(--foreground)] transition-colors duration-500">
            <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] group-hover:border-[var(--foreground)] transition-all duration-500">
              <span className="text-xl leading-none group-hover:rotate-45 transition-transform duration-500">↗</span>
            </div>
            <span className="font-mono-meta text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] opacity-50 block mb-8">
              ( 02 )
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-6">
              {focusTitle}
            </h3>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              {focusBody}
            </p>
          </div>

          {/* Card C — Craft (bonus card for visual balance) */}
          <div className="ifs-about-card relative p-8 sm:p-10 rounded-[2rem] border border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] sm:col-span-2 lg:col-span-1 group">
            <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-[var(--background)]/30 flex items-center justify-center text-[var(--background)] group-hover:bg-[var(--background)] group-hover:text-[var(--foreground)] transition-all duration-500">
              <span className="text-xl leading-none group-hover:rotate-45 transition-transform duration-500">↗</span>
            </div>
            <span className="font-mono-meta text-[10px] uppercase tracking-[0.25em] opacity-50 block mb-8">
              ( 03 )
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
              Craft
            </h3>
            <p className="text-base sm:text-lg opacity-70 leading-relaxed">
              Every project is an opportunity to push the boundaries of what's possible on the web. I obsess over the details that make experiences feel magical.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}