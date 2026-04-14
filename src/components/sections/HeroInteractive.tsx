"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code, Link, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SiteProfile } from "@/types/portfolio";

/** Mirrors https://www.infinitefield.xyz/ — marquee, dual mantra, editorial, minimal CTA. */
export function HeroInteractive({ profile }: { profile: SiteProfile }) {
  const reduce = useReducedMotion() ?? false;
  const brand = profile.full_name.trim() || "Infinite Field";
  const mantra1 = "There is no limit";
  const mantra2 = "for those who think infinite.";
  const editorial =
    profile.tagline?.trim() ||
    "At Infinite Field, we go beyond the surface diving deep into the very fabric of data and technology to create precision-driven opportunities.";

  return (
    <section
      id="open"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20 lg:px-14 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_-10%,var(--ambient-a),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_80%,var(--ambient-b),transparent_55%)]" />
      <div className="grain-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          {/* Marquee brand — same rhythm as IF */}
          <div className="overflow-hidden border-b border-[var(--border)]/80 py-6 sm:py-8">
            <div className="marquee" aria-hidden>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
            </div>
            <div className="marquee marquee-slow mt-3 opacity-80" aria-hidden>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
              <span className="marquee-text">{brand}</span>
            </div>
          </div>

          <h1 id="hero-title" className="sr-only">
            {brand} — {profile.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)]/80 py-5">
            <p className="font-mono-meta text-[10px] uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
              {profile.title}
            </p>
            <a
              href="#manifesto"
              className="font-mono-meta text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--primary)] hover:underline"
            >
              Scroll To Start
            </a>
          </div>

          {/* Dual mantra blocks — like IF duplicate lines */}
          <div className="flex flex-1 flex-col justify-center gap-12 py-12 sm:gap-16 sm:py-16">
            <div className="space-y-1">
              <p className="if-mantra-line1">{mantra1}</p>
              <p className="if-mantra-line2">{mantra2}</p>
            </div>
            <div className="space-y-1 opacity-90">
              <p className="if-mantra-line1">{mantra1}</p>
              <p className="if-mantra-line2">{mantra2}</p>
            </div>
          </div>

          {/* Editorial — IF long paragraph */}
          <div
            id="manifesto"
            className="border-t border-[var(--border)]/80 pt-10 sm:pt-12"
          >
            <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--muted-foreground)] sm:text-base sm:leading-[1.8]">
              {editorial}
            </p>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 font-mono-meta text-[11px] uppercase tracking-[0.22em] text-[var(--foreground)]"
              >
                <span className="border-b border-[var(--foreground)] pb-0.5 transition group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]">
                  Work with me
                </span>
                <ArrowUpRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--primary)]"
                  aria-hidden
                />
              </a>

              <div className="flex flex-wrap items-center gap-2">
                {profile.github_url ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="font-mono-meta h-8 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    <a href={profile.github_url} target="_blank" rel="noreferrer">
                      <Code className="mr-1.5 h-3.5 w-3.5" />
                      Code
                    </a>
                  </Button>
                ) : null}
                {profile.linkedin_url ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="font-mono-meta h-8 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                      <Link className="mr-1.5 h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  </Button>
                ) : null}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="font-mono-meta h-8 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
