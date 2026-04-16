"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { loadGsap, registerGsapPlugins } from "@/lib/gsap";
import type { SkillGroup } from "@/types/portfolio";

export function SkillsChapter({ groups }: { groups: SkillGroup[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const blocks = root.querySelectorAll("[data-skill-block]");
    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void (async () => {
      await registerGsapPlugins();
      if (!mounted) return;
      const { gsap } = await loadGsap();
      if (!mounted) return;

      ctx = gsap.context(() => {
        gsap.from(blocks, {
          opacity: 0,
          y: 32,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }, root);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [groups, reduce]);

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col justify-center px-5 py-24 sm:px-8 lg:px-14 xl:px-20"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-10 max-w-2xl"
      >
        <h2
          id="chapter-title-stack"
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight"
        >
          Stack
        </h2>
        <span className="font-mono-meta mt-2 block text-sm text-[var(--muted-foreground)]">
          Tools, patterns, delivery
        </span>
      </motion.div>

      <div className="grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {groups.map((g, gi) => (
          <div
            key={g.id}
            data-skill-block
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)]/90 bg-[var(--card)]/70 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)]/35 hover:shadow-[0_0_40px_-20px_var(--primary-glow)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--primary)]/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <motion.h3
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : gi * 0.06 }}
              className="font-mono-meta relative text-sm font-semibold uppercase tracking-[0.15em] text-[var(--primary)]"
            >
              {g.name}
            </motion.h3>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {g.skills.map((s, si) => (
                <motion.span
                  key={s.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: reduce ? 0 : gi * 0.04 + si * 0.02,
                    type: "spring",
                    stiffness: 380,
                    damping: 22,
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="border border-[var(--border)]/80 bg-[var(--muted)]/60 font-normal backdrop-blur-sm"
                  >
                    {s.name}
                  </Badge>
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
