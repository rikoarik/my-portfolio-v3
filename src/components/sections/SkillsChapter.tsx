"use client";

import { useLayoutEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import type { SkillGroup } from "@/types/portfolio";

export function SkillsChapter({ groups }: { groups: SkillGroup[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = root.querySelectorAll("[data-skill-block]");
    const ctx = gsap.context(() => {
      gsap.from(blocks, {
        opacity: 0,
        y: 24,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);
    return () => ctx.revert();
  }, [groups]);

  return (
    <div
      ref={rootRef}
      className="flex min-h-full flex-col justify-center px-6 py-28 lg:px-16"
    >
      <h2
        id="chapter-title-stack"
        className="mb-10 max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl"
      >
        Stack
        <span className="font-mono-meta mt-2 block text-sm font-normal text-[var(--muted-foreground)]">
          Tools I ship with
        </span>
      </h2>
      <div className="grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div
            key={g.id}
            data-skill-block
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <h3 className="font-mono-meta text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
              {g.name}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.skills.map((s) => (
                <Badge key={s.id} variant="secondary" className="font-normal">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
