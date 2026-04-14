"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code, Link, Mail, MapPin, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SiteProfile } from "@/types/portfolio";

export function IntroChapter({ profile }: { profile: SiteProfile }) {
  const reduce = useReducedMotion() ?? false;

  const { container, item } = useMemo(() => {
    const dur = reduce ? 0 : 0.55;
    const stagger = reduce ? 0 : 0.11;
    return {
      container: {
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: reduce ? 0 : 0.08,
          },
        },
      },
      item: {
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: dur,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      },
    };
  }, [reduce]);

  return (
    <div className="relative flex min-h-full flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:px-14 xl:px-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-8 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(52_245_197_/_0.12),transparent_65%)] blur-2xl sm:h-96 sm:w-96" />

      <motion.div
        className="relative max-w-3xl space-y-6 sm:space-y-8 xl:max-w-4xl"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div variants={item} className="flex flex-wrap items-center gap-3">
          <span className="font-mono-meta inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Production story
          </span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span className="font-mono-meta text-[10px] text-[var(--muted-foreground)] sm:text-xs">
            scroll to explore →
          </span>
        </motion.div>

        <motion.h1
          id="chapter-title-open"
          variants={item}
          className="text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[1.02] tracking-tight"
        >
          <span className="text-shimmer block">{profile.full_name}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="font-mono-meta text-base text-[var(--primary)] sm:text-lg"
        >
          {profile.title}
        </motion.p>

        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg lg:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]"
        >
          <MapPin
            className="h-4 w-4 shrink-0 text-[var(--primary)]"
            aria-hidden
          />
          <span>{profile.location}</span>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-3">
          {profile.github_url ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-mono-meta border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm transition-all hover:border-[var(--primary)]/40 hover:shadow-[0_0_24px_-8px_var(--primary-glow)]"
            >
              <a href={profile.github_url} target="_blank" rel="noreferrer">
                <Code className="h-4 w-4" />
                Code
              </a>
            </Button>
          ) : null}
          {profile.linkedin_url ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-mono-meta border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm transition-all hover:border-[var(--primary)]/40"
            >
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                <Link className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            size="lg"
            className="font-mono-meta shadow-[0_0_32px_-10px_var(--primary-glow)]"
          >
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
          {["Kotlin", "Flutter", "React Native", "Fintech", "Clean arch"].map(
            (t) => (
              <Badge
                key={t}
                variant="secondary"
                className="border border-[var(--border)] bg-[var(--muted)]/80 px-3 py-1 text-xs font-normal backdrop-blur-sm"
              >
                {t}
              </Badge>
            ),
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
