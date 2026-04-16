"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadGsap, registerGsapPlugins } from "@/lib/gsap";
import type { Experience } from "@/types/portfolio";

function formatPeriod(e: Experience) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}

export function JourneyChapter({ experiences }: { experiences: Experience[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const cards = root.querySelectorAll("[data-exp-card]");
    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void (async () => {
      await registerGsapPlugins();
      if (!mounted) return;
      const { gsap } = await loadGsap();
      if (!mounted) return;

      ctx = gsap.context(() => {
        gsap.from(cards, {
          opacity: 0,
          x: 48,
          duration: 0.55,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
      }, root);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [experiences, reduce]);

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col justify-center px-5 py-24 sm:px-8 lg:px-14 xl:px-20"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 max-w-2xl sm:mb-10 lg:mb-12"
      >
        <h2
          id="chapter-title-path"
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight"
        >
          Jalur kerja
        </h2>
        <span className="font-mono-meta mt-2 block text-sm text-[var(--muted-foreground)]">
          Milestones &amp; dampak di produksi
        </span>
      </motion.div>

      <div className="grid max-w-4xl gap-5 sm:gap-6">
        {experiences.map((e, i) => (
          <motion.div
            key={e.id}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.45 }}
          >
            <Card
              data-exp-card
              className="card-lift border-[var(--border)]/90 bg-[var(--card)]/70 backdrop-blur-md"
            >
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-xl">{e.role}</CardTitle>
                    <p className="font-mono-meta mt-1 text-sm text-[var(--primary)]">
                      {e.company}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                  </div>
                  <p className="font-mono-meta shrink-0 rounded-md border border-[var(--border)] bg-[var(--muted)]/50 px-2 py-1 text-[10px] text-[var(--muted-foreground)] sm:text-xs">
                    {formatPeriod(e)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {e.bullets.map((b, bi) => (
                    <li key={`${e.id}-${bi}`} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)]"
                        aria-hidden
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
