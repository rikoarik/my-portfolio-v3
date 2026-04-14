"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education, Experience } from "@/types/portfolio";

function fmt(e: { start_date: string | null; end_date: string | null }) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}

export function TimelineCompact({
  experiences,
  education,
}: {
  experiences: Experience[];
  education: Education[];
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-title"
      className="px-5 py-16 sm:px-8 lg:px-14 xl:px-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h2
            id="timeline-title"
            className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold tracking-tight"
          >
            Timeline (compact)
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] sm:text-base">
            Ringkas, fokus highlight, bukan CV panjang.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {experiences.slice(0, 5).map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.4 }}
                >
                  <Card className="card-lift border-[var(--border)]/90 bg-[var(--card)]/65 backdrop-blur-md">
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-base sm:text-lg">
                            {e.role}
                          </CardTitle>
                          <p className="font-mono-meta mt-1 text-xs text-[var(--primary)]">
                            {e.company}
                            {e.location ? ` · ${e.location}` : ""}
                          </p>
                        </div>
                        <Badge
                          variant="muted"
                          className="font-mono-meta text-[10px]"
                        >
                          {fmt(e)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {e.bullets[0] ?? "—"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {education.slice(0, 1).map((ed) => (
              <Card
                key={ed.id}
                className="border-[var(--border)]/90 bg-[var(--card)]/65 backdrop-blur-md"
              >
                <CardHeader>
                  <p className="font-mono-meta text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    education
                  </p>
                  <CardTitle className="text-lg">{ed.institution}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {ed.degree}
                    {ed.gpa ? ` · GPA ${ed.gpa}` : ""}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {ed.bullets.slice(0, 3).map((b, i) => (
                      <li key={`ed-${i}`} className="flex gap-2">
                        <span className="text-[var(--primary)]">▹</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--muted)]/30 p-5">
              <p className="font-mono-meta text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                note
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Next iteration: bikin chapter khusus “how I build” (trade-offs,
                constraints, decision log).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

