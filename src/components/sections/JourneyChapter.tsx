"use client";

import { useLayoutEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import type { Experience } from "@/types/portfolio";

function formatPeriod(e: Experience) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}

export function JourneyChapter({ experiences }: { experiences: Experience[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = root.querySelectorAll("[data-exp-card]");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        x: 40,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);
    return () => ctx.revert();
  }, [experiences]);

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col justify-center px-6 py-28 lg:px-16"
    >
      <h2
        id="chapter-title-path"
        className="mb-10 max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl"
      >
        Jalur kerja
        <span className="font-mono-meta mt-2 block text-sm font-normal text-[var(--muted-foreground)]">
          Milestones &amp; shipped responsibilities
        </span>
      </h2>
      <div className="grid max-w-4xl gap-6">
        {experiences.map((e) => (
          <Card
            key={e.id}
            data-exp-card
            className="border-[var(--border)] bg-[var(--card)]"
          >
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl">{e.role}</CardTitle>
                  <p className="font-mono-meta mt-1 text-sm text-[var(--primary)]">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                </div>
                <p className="font-mono-meta shrink-0 text-xs text-[var(--muted-foreground)]">
                  {formatPeriod(e)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {e.bullets.map((b) => (
                  <li key={b.slice(0, 40)} className="pl-1 marker:text-[var(--primary)]">
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
