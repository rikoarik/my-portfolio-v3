"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadGsap, registerGsapPlugins } from "@/lib/gsap";
import type { Project } from "@/types/portfolio";

export function ProjectsChapter({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const cards = root.querySelectorAll("[data-proj-card]");
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
          y: 40,
          scale: 0.98,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
      }, root);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [projects, reduce]);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col px-5 py-24 sm:px-8 lg:min-w-[min(155vw,2200px)] lg:px-14 xl:px-20"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 max-w-2xl lg:mb-10"
      >
        <h2
          id="chapter-title-shipped"
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight"
        >
          Yang sudah dikirim
        </h2>
        <span className="font-mono-meta mt-2 block text-sm text-[var(--muted-foreground)]">
          Build cards · tap detail di mobile
        </span>
      </motion.div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {ordered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: reduce ? 0 : i * 0.04, duration: 0.45 }}
            whileHover={
              reduce
                ? undefined
                : { y: -6, transition: { duration: 0.25, ease: "easeOut" } }
            }
          >
            <Card
              data-proj-card
              className={`card-lift h-full border-[var(--border)]/90 bg-[var(--card)]/75 backdrop-blur-md ${
                p.featured
                  ? "ring-1 ring-[var(--primary)]/50 shadow-[0_0_40px_-16px_var(--primary-glow)]"
                  : ""
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug sm:text-lg">
                    {p.title}
                  </CardTitle>
                  {p.featured ? (
                    <Badge className="shrink-0 font-mono-meta text-[9px] sm:text-[10px] shadow-[0_0_12px_-4px_var(--primary-glow)]">
                      ★ featured
                    </Badge>
                  ) : null}
                </div>
                {p.subtitle ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {p.subtitle}
                  </p>
                ) : null}
                {p.period_label ? (
                  <p className="font-mono-meta text-xs text-[var(--primary)]">
                    {p.period_label}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.stack.slice(0, 8).map((s) => (
                    <Badge
                      key={s}
                      variant="muted"
                      className="font-mono-meta text-[9px] sm:text-[10px]"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="font-mono-meta h-8 px-0 text-xs text-[var(--primary)] hover:text-[var(--primary)]"
                  onClick={() => setOpenId((id) => (id === p.id ? null : p.id))}
                  aria-expanded={openId === p.id}
                >
                  {openId === p.id ? "↑ Sembunyikan detail" : "↓ Detail dampak"}
                </Button>
                <motion.div
                  initial={false}
                  animate={{ height: openId === p.id ? "auto" : 0, opacity: openId === p.id ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 pb-1 text-sm text-[var(--muted-foreground)]">
                    {p.bullets.map((b, bi) => (
                      <li key={`${p.id}-${bi}`} className="flex gap-2">
                        <span className="text-[var(--primary)]">▹</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.repo_url ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="font-mono-meta h-8 text-xs"
                    >
                      <a href={p.repo_url} target="_blank" rel="noreferrer">
                        Repo
                      </a>
                    </Button>
                  ) : null}
                  {p.demo_url ? (
                    <Button
                      asChild
                      size="sm"
                      className="font-mono-meta h-8 text-xs"
                    >
                      <a href={p.demo_url} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
