"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import type { Project } from "@/types/portfolio";

function byFeaturedThenOrder(projects: Project[]) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest];
}

export function HorizontalPinnedProjectWall({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Project | null>(null);

  const ordered = useMemo(() => byFeaturedThenOrder(projects), [projects]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useLayoutEffect(() => {
    if (reduce) return;
    registerGsapPlugins();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const ctx = gsap.context(() => {
      const cards = track.querySelectorAll("[data-wall-card]");
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const snapTo = () => {
        const steps = Math.max(1, cards.length - 1);
        return 1 / steps;
      };

      const layers = root.querySelectorAll("[data-wall-layer]");
      if (layers.length) {
        gsap.fromTo(
          layers,
          { y: 18, opacity: 0.7 },
          {
            y: -18,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.55,
            },
          },
        );
      }

      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.6,
            },
          },
        );
      }

      const distNow = dist();
      if (!distNow) {
        gsap.set(track, { x: 0 });
        return;
      }

      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.65,
          snap: {
            snapTo: snapTo,
            duration: { min: 0.12, max: 0.35 },
            delay: 0.05,
            ease: "power2.out",
          },
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [ordered, reduce]);

  return (
    <section
      id="project-wall"
      aria-labelledby="wall-title"
      className="relative border-y border-[var(--border)]/60 bg-[var(--background)]/10"
    >
      <div
        data-parallax
        data-wall-layer
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_30%,var(--ambient-a),transparent_65%)]"
      />
      <div
        data-parallax
        data-wall-layer
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_60%,var(--ambient-b),transparent_60%)]"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent opacity-70" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent opacity-70" />

      <div className="px-5 py-14 sm:px-8 lg:px-0">
        <div className="mx-auto max-w-6xl lg:px-14 xl:px-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col gap-2"
          >
            <h2
              id="wall-title"
              className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold tracking-tight"
            >
              Project wall (cinematic)
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] sm:text-base">
              Scroll vertikal → track horizontal. Klik kartu untuk detail ringkas.
            </p>
          </motion.div>
        </div>

        {/* Desktop pinned track */}
        <div ref={rootRef} className="hidden lg:block">
          <div
            ref={trackRef}
            className="flex w-max gap-5 px-14 pb-10 pt-2 xl:px-20"
          >
            {ordered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="text-left"
                aria-label={`Open project: ${p.title}`}
              >
                <Card
                  data-wall-card
                  className="card-lift surface-premium rim-warm noise-soft w-[420px] rounded-3xl backdrop-blur-md"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{p.title}</CardTitle>
                      {p.featured ? (
                        <Badge className="font-mono-meta text-[10px] shadow-[0_0_14px_-6px_var(--primary-glow)]">
                          featured
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
                      {(p.tags ?? []).slice(0, 4).map((t) => (
                        <Badge
                          key={`t-${p.id}-${t}`}
                          variant="outline"
                          className="font-mono-meta text-[10px]"
                        >
                          {t}
                        </Badge>
                      ))}
                      {p.stack.slice(0, 8).map((s) => (
                        <Badge
                          key={s}
                          variant="muted"
                          className="font-mono-meta text-[10px]"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {p.bullets[0] ?? "—"}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-[var(--primary)]">
                      <span className="font-mono-meta">open</span>
                      <span aria-hidden>→</span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden">
          <ScrollArea className="w-full">
            <div className="flex w-max gap-4 px-5 pb-4">
              {ordered.map((p) => (
                <button
                  key={`m-${p.id}`}
                  type="button"
                  onClick={() => setOpen(p)}
                  className="text-left"
                >
                  <Card className="card-lift surface-premium rim-warm noise-soft w-[78vw] max-w-[420px] rounded-3xl backdrop-blur-md">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{p.title}</CardTitle>
                        {p.featured ? (
                          <Badge className="font-mono-meta text-[10px]">★</Badge>
                        ) : null}
                      </div>
                      {p.subtitle ? (
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {p.subtitle}
                        </p>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {p.bullets[0] ?? "—"}
                      </p>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </div>
      </div>

      {/* Lightweight modal */}
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            aria-label="Close"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--popover)] p-6 text-[var(--popover-foreground)] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Project detail: ${open.title}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono-meta text-xs text-[var(--muted-foreground)]">
                  project
                </p>
                <h3 className="mt-1 truncate text-xl font-bold">{open.title}</h3>
                {open.subtitle ? (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {open.subtitle}
                  </p>
                ) : null}
              </div>
              <Button type="button" variant="outline" onClick={() => setOpen(null)}>
                Close
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(open.tags ?? []).slice(0, 8).map((t) => (
                <Badge key={`d-t-${t}`} variant="outline" className="font-mono-meta text-[10px]">
                  {t}
                </Badge>
              ))}
              {open.stack.slice(0, 12).map((s) => (
                <Badge key={`d-${s}`} variant="muted" className="font-mono-meta text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>

            <ul className="mt-6 space-y-2 text-sm text-[var(--muted-foreground)]">
              {open.bullets.slice(0, 6).map((b, i) => (
                <li key={`d-${open.id}-${i}`} className="flex gap-2">
                  <span className="text-[var(--primary)]">▹</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {open.repo_url ? (
                <Button asChild variant="outline" className="font-mono-meta">
                  <a href={open.repo_url} target="_blank" rel="noreferrer">
                    Repo <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              {open.demo_url ? (
                <Button asChild className="font-mono-meta">
                  <a href={open.demo_url} target="_blank" rel="noreferrer">
                    Demo <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}

