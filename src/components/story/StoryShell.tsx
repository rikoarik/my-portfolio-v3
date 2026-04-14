"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";

import { STORY_CHAPTERS, type ChapterId } from "./story-meta";

type Props = {
  children: React.ReactNode[];
  offlineBanner?: boolean;
};

function panelId(i: number) {
  return `story-panel-${STORY_CHAPTERS[i]?.id ?? i}`;
}

function mobilePanelId(i: number) {
  return `m-${panelId(i)}`;
}

export function StoryShell({ children, offlineBanner }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState<ChapterId>("open");
  const [progressPct, setProgressPct] = useState(0);
  const panels = Array.isArray(children) ? children : [children];

  const scrollToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(STORY_CHAPTERS.length - 1, index));
    const st = stRef.current;
    if (st?.animation) {
      const step = 1 / (STORY_CHAPTERS.length - 1);
      const next = clamped * step;
      const y = st.start + next * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    const track = trackRef.current;
    if (
      track &&
      window.matchMedia("(min-width: 1024px)").matches &&
      track.scrollWidth > track.clientWidth
    ) {
      const w = window.innerWidth;
      track.scrollTo({ left: clamped * w, behavior: "smooth" });
      return;
    }
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const el = document.getElementById(
      mobile ? mobilePanelId(clamped) : panelId(clamped),
    );
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const scrollToChapter = useCallback(
    (dir: -1 | 1) => {
      const idx = STORY_CHAPTERS.findIndex((c) => c.id === active);
      const next = Math.max(0, Math.min(STORY_CHAPTERS.length - 1, idx + dir));
      scrollToIndex(next);
    },
    [active, scrollToIndex],
  );

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
        if (!isLg()) {
          setProgressPct(0);
          return;
        }

        if (reduced()) {
          track.classList.add(
            "overflow-x-auto",
            "snap-x",
            "snap-mandatory",
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
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgressPct(Math.round(self.progress * 1000) / 10);
              const idx = Math.min(
                STORY_CHAPTERS.length - 1,
                Math.round(self.progress * (STORY_CHAPTERS.length - 1)),
              );
              setActive(STORY_CHAPTERS[idx].id);
            },
          },
        });

        stRef.current = tween.scrollTrigger ?? null;
        ScrollTrigger.refresh();
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

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      if (e.key === "ArrowRight") scrollToChapter(1);
      if (e.key === "ArrowLeft") scrollToChapter(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollToChapter]);

  /* Mobile: track scroll snap → active chapter */
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(max-width: 1023px)").matches) {
      return;
    }
    const sections = STORY_CHAPTERS.map((_, i) =>
      document.getElementById(mobilePanelId(i)),
    ).filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting && en.intersectionRatio >= 0.35)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const slug = visible.target.id
          .replace(/^m-story-panel-/, "")
          .replace(/^story-panel-/, "") as ChapterId;
        if (STORY_CHAPTERS.some((c) => c.id === slug)) {
          setActive(slug);
          const idx = STORY_CHAPTERS.findIndex((c) => c.id === slug);
          setProgressPct((idx / (STORY_CHAPTERS.length - 1)) * 100);
        }
      },
      { root: null, threshold: [0.2, 0.35, 0.5] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [panels.length]);

  return (
    <div className="relative">
      {offlineBanner ? (
        <div
          className="font-mono-meta relative z-20 border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200"
          role="status"
        >
          Mode offline — data seed. Hubungkan Supabase untuk konten live.
        </div>
      ) : null}

      {/* Top bar: progress + chapter pills (desktop) */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-50">
        <div className="pointer-events-auto">
          <Progress
            value={progressPct}
            className="h-1 rounded-none bg-[var(--muted)]/80"
            aria-label="Progres cerita"
          />
          <div className="flex flex-col gap-3 px-3 pb-2 pt-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <ScrollArea className="w-full max-w-full lg:max-w-[70%]">
              <div className="flex w-max gap-2 pb-1 pt-0.5">
                {STORY_CHAPTERS.map((ch, i) => (
                  <Tooltip key={ch.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => scrollToIndex(i)}
                        className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      >
                        <Badge
                          variant={active === ch.id ? "default" : "muted"}
                          className={`font-mono-meta cursor-pointer px-3 py-1 text-[10px] uppercase tracking-widest transition-all duration-300 sm:text-xs ${
                            active === ch.id
                              ? "shadow-[0_0_20px_-4px_var(--primary-glow)] ring-1 ring-[var(--primary)]/50"
                              : "hover:ring-1 hover:ring-[var(--border)]"
                          }`}
                        >
                          <span className="mr-1.5 opacity-50">0{i + 1}</span>
                          {ch.label}
                        </Badge>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-mono-meta">
                      {ch.labelEn} — klik atau gunakan ← →
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-1.5 lg:hidden" />
            </ScrollArea>

            <div className="pointer-events-auto hidden shrink-0 items-center gap-2 lg:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm"
                aria-label="Bab sebelumnya"
                onClick={() => scrollToChapter(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm"
                aria-label="Bab berikutnya"
                onClick={() => scrollToChapter(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop horizontal */}
      <div ref={rootRef} className="relative z-10 hidden min-h-screen lg:block">
        <div
          ref={trackRef}
          className="flex h-screen w-max flex-row flex-nowrap will-change-transform"
        >
          {panels.map((panel, i) => (
            <section
              key={STORY_CHAPTERS[i]?.id ?? i}
              id={panelId(i)}
              className="box-border flex h-screen w-screen shrink-0 flex-col overflow-y-auto border-r border-[var(--border)]/80 bg-[var(--background)]/40 backdrop-blur-[2px]"
              aria-labelledby={`chapter-title-${STORY_CHAPTERS[i]?.id ?? i}`}
            >
              {panel}
            </section>
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="relative z-10 snap-y snap-mandatory pb-24 lg:hidden">
        {panels.map((panel, i) => (
          <section
            key={`m-${STORY_CHAPTERS[i]?.id ?? i}`}
            id={mobilePanelId(i)}
            className="min-h-[92dvh] snap-start snap-always border-b border-[var(--border)]/60 px-1 pt-24 sm:px-3"
          >
            {panel}
          </section>
        ))}
      </div>

      {/* Mobile dock */}
      <nav
        className="pb-safe pointer-events-none fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        aria-label="Navigasi bab"
      >
        <div className="pointer-events-auto mx-3 mb-3 rounded-2xl border border-[var(--border)]/80 bg-[var(--card)]/90 p-2 shadow-[0_-8px_40px_-12px_rgb(0_0_0_/_0.5)] backdrop-blur-xl">
          <ScrollArea className="w-full">
            <div className="flex w-max gap-2 px-1">
              {STORY_CHAPTERS.map((ch, i) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  className={`flex min-w-[3.25rem] flex-col items-center rounded-xl px-2 py-2 text-[10px] font-medium transition-all active:scale-95 ${
                    active === ch.id
                      ? "bg-[var(--primary)]/20 text-[var(--primary)] ring-1 ring-[var(--primary)]/40"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <span className="font-mono-meta text-[9px] opacity-60">
                    {i + 1}
                  </span>
                  <span className="max-w-[4.5rem] truncate">{ch.label}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>
        </div>
      </nav>
    </div>
  );
}
