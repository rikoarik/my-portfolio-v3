"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/portfolio";

function pickFeatured(projects: Project[]) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, 4);
}

export function CaseStudiesSection({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const featured = useMemo(() => pickFeatured(projects), [projects]);
  const p = featured[active];

  return (
    <section
      id="case-studies"
      aria-labelledby="case-title"
      className="px-5 py-16 sm:px-8 lg:px-14 xl:px-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2
              id="case-title"
              className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold tracking-tight"
            >
              Case studies (featured)
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">
              Bukan sekadar list. Ini 3–4 proyek unggulan dengan dampak nyata.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {featured.map((x, idx) => (
              <Button
                key={x.id}
                type="button"
                variant={idx === active ? "default" : "outline"}
                size="sm"
                onClick={() => setActive(idx)}
                className="font-mono-meta h-9"
              >
                {idx + 1}
                <span className="ml-2 max-w-[14rem] truncate">{x.title}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {p ? (
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="surface-premium rim-warm noise-soft rounded-3xl backdrop-blur-md">
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-xl sm:text-2xl">{p.title}</CardTitle>
                    {p.subtitle ? (
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {p.subtitle}
                      </p>
                    ) : null}
                    {p.period_label ? (
                      <p className="font-mono-meta mt-2 text-xs text-[var(--primary)]">
                        {p.period_label}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(p.tags ?? []).slice(0, 6).map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="font-mono-meta text-[10px]"
                      >
                        {t}
                      </Badge>
                    ))}
                    {p.stack.slice(0, 10).map((s) => (
                      <Badge
                        key={s}
                        variant="muted"
                        className="font-mono-meta text-[10px]"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {p.case_study ? (
                    <div className="grid gap-4 lg:grid-cols-12">
                      <div className="surface-premium rim-warm noise-soft rounded-2xl p-5 lg:col-span-7">
                        <p className="section-kicker">Problem</p>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {p.case_study.problem}
                        </p>
                      </div>

                      <div className="surface-premium rim-warm noise-soft rounded-2xl p-5 lg:col-span-5">
                        <p className="section-kicker">Constraints</p>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {p.case_study.constraints.map((c, i) => (
                            <li key={`${p.id}-c-${i}`} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="surface-premium rim-warm noise-soft rounded-2xl p-5 lg:col-span-7">
                        <p className="section-kicker">Solution</p>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {p.case_study.solution}
                        </p>
                      </div>

                      <div className="surface-premium rim-warm noise-soft rounded-2xl p-5 lg:col-span-5">
                        <p className="section-kicker">Results</p>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {p.case_study.results.map((r, i) => (
                            <li key={`${p.id}-r-${i}`} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-mono-meta text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Highlights
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {p.bullets.slice(0, 4).map((b, i) => (
                          <li key={`${p.id}-cs-${i}`} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="font-mono-meta text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Next
                  </p>
                  <div className="surface-premium rim-warm noise-soft rounded-2xl p-4">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {p.case_study
                        ? "Case narrative dari CMS/seed (`case_study`). Tanpa field itu, section pakai bullets."
                        : "Tambah `case_study` di admin untuk narrative lengkap (Problem → Constraints → Solution → Results)."}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="font-mono-meta mt-2 h-9 px-0 text-xs text-[var(--primary)]"
                      onClick={() => {
                        const next = (active + 1) % featured.length;
                        setActive(next);
                      }}
                    >
                      Next case
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

