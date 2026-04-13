"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";

import { STORY_CHAPTERS, type ChapterId } from "./story-meta";

type Props = {
  children: React.ReactNode[];
  offlineBanner?: boolean;
};

export function StoryShell({ children, offlineBanner }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState<ChapterId>("open");

  useLayoutEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      const isLg = () => window.matchMedia("(min-width: 1024px)").matches;
      const reduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const clearSt = () => {
        stRef.current?.kill();
        stRef.current = null;
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === root) t.kill();
        });
        gsap.killTweensOf(track);
        gsap.set(track, { clearProps: "transform" });
      };

      const build = () => {
        clearSt();
        if (!isLg()) return;

        if (reduced()) {
          track.classList.add(
            "overflow-x-auto",
            "snap-x",
            "snap-mandatory",
            "scrollbar-thin",
          );
          Array.from(track.children).forEach((el) => {
            el.classList.add("snap-center");
          });
          return;
        }

        track.classList.remove(
          "overflow-x-auto",
          "snap-x",
          "snap-mandatory",
          "scrollbar-thin",
        );
        Array.from(track.children).forEach((el) => {
          el.classList.remove("snap-center");
        });

        const scrollDist = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -scrollDist(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${scrollDist()}`,
            pin: true,
            scrub: 0.85,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                STORY_CHAPTERS.length - 1,
                Math.round(self.progress * (STORY_CHAPTERS.length - 1)),
              );
              setActive(STORY_CHAPTERS[idx].id);
            },
          },
        });

        stRef.current = tween.scrollTrigger ?? null;
      };

      build();

      const onResize = () => build();
      const onMq = () => build();
      window.addEventListener("resize", onResize);
      window
        .matchMedia("(min-width: 1024px)")
        .addEventListener("change", onMq);
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .addEventListener("change", onMq);

      return () => {
        window.removeEventListener("resize", onResize);
        window
          .matchMedia("(min-width: 1024px)")
          .removeEventListener("change", onMq);
        window
          .matchMedia("(prefers-reduced-motion: reduce)")
          .removeEventListener("change", onMq);
        clearSt();
      };
    }, root);

    return () => ctx.revert();
  }, [children]);

  const scrollToChapter = (dir: -1 | 1) => {
    const st = stRef.current;
    if (st && st.animation) {
      const step = 1 / (STORY_CHAPTERS.length - 1);
      const next = Math.min(1, Math.max(0, st.progress + dir * step));
      const y = st.start + next * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }

    const track = trackRef.current;
    if (!track || !window.matchMedia("(min-width: 1024px)").matches) return;
    const w = window.innerWidth;
    const delta = dir * w;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      if (e.key === "ArrowRight") scrollToChapter(1);
      if (e.key === "ArrowLeft") scrollToChapter(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const panels = Array.isArray(children) ? children : [children];

  return (
    <div>
      {offlineBanner ? (
        <div
          className="font-mono-meta border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200"
          role="status"
        >
          Mode offline — menampilkan data seed. Hubungkan Supabase untuk konten
          live.
        </div>
      ) : null}

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-start justify-between gap-4 p-4 lg:p-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {STORY_CHAPTERS.map((ch) => (
            <Badge
              key={ch.id}
              variant={active === ch.id ? "default" : "muted"}
              className="font-mono-meta cursor-default text-[10px] uppercase tracking-wider lg:text-xs"
              aria-current={active === ch.id ? "step" : undefined}
            >
              {ch.label}
            </Badge>
          ))}
        </div>
        <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Bab sebelumnya"
            onClick={() => scrollToChapter(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Bab berikutnya"
            onClick={() => scrollToChapter(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div ref={rootRef} className="hidden min-h-screen lg:block">
        <div
          ref={trackRef}
          className="flex h-screen w-max flex-row flex-nowrap will-change-transform"
        >
          {panels.map((panel, i) => (
            <section
              key={STORY_CHAPTERS[i]?.id ?? i}
              className="box-border flex h-screen w-screen shrink-0 flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--background)]"
              aria-labelledby={`chapter-title-${STORY_CHAPTERS[i]?.id ?? i}`}
            >
              {panel}
            </section>
          ))}
        </div>
      </div>

      <div className="snap-y snap-mandatory lg:hidden">
        {panels.map((panel, i) => (
          <section
            key={`m-${STORY_CHAPTERS[i]?.id ?? i}`}
            className="min-h-[88dvh] snap-start border-b border-[var(--border)] py-20"
          >
            {panel}
          </section>
        ))}
      </div>
    </div>
  );
}
