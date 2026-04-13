"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import type { Project } from "@/types/portfolio";

export function ProjectsChapter({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = root.querySelectorAll("[data-proj-card]");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 36,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);
    return () => ctx.revert();
  }, [projects]);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col px-6 py-28 lg:min-w-[140vw] lg:px-16"
    >
      <h2
        id="chapter-title-shipped"
        className="mb-8 max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl"
      >
        Yang sudah dikirim
        <span className="font-mono-meta mt-2 block text-sm font-normal text-[var(--muted-foreground)]">
          Apps, integrations, production workflows
        </span>
      </h2>

      <div className="flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          {ordered.map((p) => (
            <Card
              key={p.id}
              data-proj-card
              className={`border-[var(--border)] bg-[var(--card)] transition-shadow ${
                p.featured ? "ring-1 ring-[var(--primary)]/40" : ""
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                  {p.featured ? (
                    <Badge className="shrink-0 font-mono-meta text-[10px]">
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
                  {p.stack.slice(0, 6).map((s) => (
                    <Badge key={s} variant="muted" className="font-mono-meta text-[10px]">
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
                  className="font-mono-meta px-0 text-xs"
                  onClick={() => setOpenId((id) => (id === p.id ? null : p.id))}
                  aria-expanded={openId === p.id}
                >
                  {openId === p.id ? "Sembunyikan detail" : "Detail dampak"}
                </Button>
                {openId === p.id ? (
                  <ul className="list-inside list-disc space-y-2 text-sm text-[var(--muted-foreground)]">
                    {p.bullets.map((b) => (
                      <li key={b.slice(0, 36)} className="marker:text-[var(--primary)]">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.repo_url ? (
                    <Button asChild variant="outline" size="sm" className="font-mono-meta h-8 text-xs">
                      <a href={p.repo_url} target="_blank" rel="noreferrer">
                        Repo
                      </a>
                    </Button>
                  ) : null}
                  {p.demo_url ? (
                    <Button asChild size="sm" className="font-mono-meta h-8 text-xs">
                      <a href={p.demo_url} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
