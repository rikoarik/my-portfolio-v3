"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { GuestMessage } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";
import { CommentModal } from "./CommentModal";

/** Keep visible cap reasonable so screen isn't cluttered, but readable */
const VISIBLE_CAP = 15;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = Math.imul(31, h) + id.charCodeAt(i) || 0;
  return Math.abs(h);
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Keep bubbles out of center band where heading + CTA sit */
function nudgeOutOfHeroBand(
  left: number,
  top: number,
  rnd: () => number
): { left: number; top: number } {
  const h0 = 15;
  const h1 = 85;
  const v0 = 25;
  const v1 = 75;
  // If outside the danger zone, leave it
  if (left < h0 || left > h1 || top < v0 || top > v1) return { left, top };

  // Nudge it to the edges
  if (rnd() > 0.5) {
    left = rnd() > 0.5 ? 2 + rnd() * 10 : 88 + rnd() * 10;
  } else {
    top = rnd() > 0.5 ? 4 + rnd() * 12 : 84 + rnd() * 12;
  }
  return { left: clamp(left, 2, 98), top: clamp(top, 5, 95) };
}

function pickVisibleMessages(all: GuestMessage[], cap: number): GuestMessage[] {
  if (all.length <= cap) return all;
  const out: GuestMessage[] = [];
  const step = (all.length - 1) / Math.max(1, cap - 1);
  for (let i = 0; i < cap; i++) {
    out.push(all[Math.round(i * step)]);
  }
  return out;
}

type BubbleLayout = {
  left: number;
  top: number;
  scale: number;
  opacity: number;
  cycleDuration: number;
  commutePx: number;
  startGoingRight: boolean;
};

function layoutBubbles(messages: GuestMessage[]): BubbleLayout[] {
  const cols = 5;
  const rows = 3;
  const zones = cols * rows;

  return messages.map((m, index) => {
    const rnd = seededRand(hashId(m.id) + index * 997);
    const zone = (index * 11 + hashId(m.id)) % zones;
    const col = zone % cols;
    const row = Math.floor(zone / cols);
    const jx = (rnd() - 0.5) * (80 / cols);
    const jy = (rnd() - 0.5) * (80 / rows);
    let left = 6 + ((col + 0.5) / cols) * 88 + jx;
    let top = 5 + ((row + 0.5) / rows) * 90 + jy;
    
    const nudged = nudgeOutOfHeroBand(clamp(left, 4, 96), clamp(top, 4, 96), rnd);
    left = nudged.left;
    top = nudged.top;
    
    // Create depth, but keep OPACITY HIGH so it is readable.
    const depth = rnd(); 

    return {
      left,
      top,
      scale: 0.85 + depth * 0.35, // range: 0.85 to 1.2
      opacity: 0.65 + depth * 0.35, // range: 0.65 to 1.0 (highly readable)
      cycleDuration: 40 + rnd() * 30, // Slow, elegant movement
      commutePx: 60 + rnd() * 60, // Shorter drift footprint so UI stays balanced
      startGoingRight: rnd() > 0.5,
    };
  });
}

export function IFGuestbookSection({
  messages,
}: {
  messages: GuestMessage[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const driftContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null);

  const visibleMessages = useMemo(
    () => pickVisibleMessages(messages ?? [], VISIBLE_CAP),
    [messages]
  );
  const layouts = useMemo(() => layoutBubbles(visibleMessages), [visibleMessages]);

  const pauseBubbleMotion = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const bubble = e.currentTarget;
    gsap.getTweensOf(bubble).forEach((t) => t.pause());
  }, []);

  const resumeBubbleMotion = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const bubble = e.currentTarget;
    gsap.getTweensOf(bubble).forEach((t) => t.resume());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const container = driftContainerRef.current;
    if (!root || !container || visibleMessages.length === 0) return;
    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll<HTMLElement>(".ifs-guest-bubble");

      items.forEach((item, index) => {
        const layout = layouts[index];
        if (!layout) return;

        const delay = index * 0.2;
        const half = layout.cycleDuration / 2;
        const { commutePx } = layout;
        const out = layout.startGoingRight ? `+=${commutePx}` : `-=${commutePx}`;
        const back = layout.startGoingRight ? `-=${commutePx}` : `+=${commutePx}`;

        gsap.set(item, {
          left: `${layout.left}%`,
          top: `${layout.top}%`,
          xPercent: -50,
          yPercent: -50,
          scale: layout.scale,
          opacity: 0,
          force3D: true,
        });

        gsap.to(item, {
          opacity: layout.opacity,
          duration: 2,
          delay,
          ease: "sine.out",
        });

        // Slow horizontal commute
        gsap.to(item, {
          keyframes: [
            { x: out, duration: half, ease: "sine.inOut" },
            { x: back, duration: half, ease: "sine.inOut" },
          ],
          repeat: -1,
          delay,
        });

        // Add a gentle floating Y effect (bobbing up and down)
        gsap.to(item, {
          y: `${Math.random() > 0.5 ? '+' : '-'}=${15 + Math.random() * 15}px`,
          duration: 3 + Math.random() * 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2
        });
      });
    }, root);

    return () => ctx.revert();
  }, [visibleMessages, layouts]);

  const hiddenCount = Math.max(0, (messages?.length ?? 0) - visibleMessages.length);

  return (
    <section
      ref={rootRef}
      id="guestbook"
      className="relative w-full min-h-screen bg-[var(--background)] overflow-hidden flex items-center justify-center py-24"
    >
      <div
        ref={driftContainerRef}
        className="absolute inset-0 z-[1] pointer-events-none md:pointer-events-auto"
      >
        {visibleMessages.map((m) => {
          const isHovered = hoveredBubbleId === m.id;
          const isFaded = hoveredBubbleId && hoveredBubbleId !== m.id;
          
          return (
            <div
              key={m.id}
              className={`ifs-guest-bubble group absolute transition-opacity duration-300 ${
                isFaded ? "opacity-20 saturate-0" : ""
              }`}
              style={{ zIndex: isHovered ? 50 : 10 }}
              onMouseEnter={pauseBubbleMotion}
              onMouseLeave={resumeBubbleMotion}
              onPointerEnter={() => setHoveredBubbleId(m.id)}
              onPointerLeave={() => setHoveredBubbleId(null)}
            >
              <div className="ifs-guest-bubble-sway will-change-transform cursor-pointer">
                <div className="ifs-guest-bubble-inner origin-center whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium shadow-[0_8px_32px_color-mix(in_srgb,var(--foreground)_15%,transparent)] transition-all duration-500 ease-out group-hover:scale-[1.15] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] group-hover:border-[var(--foreground)] group-hover:shadow-[0_15px_40px_color-mix(in_srgb,var(--primary)_40%,transparent)]">
                  <span className="font-bold text-[var(--primary)] group-hover:text-[var(--primary)] mr-3 transition-colors">
                    {m.name}
                  </span>
                  <span className="text-[var(--muted-foreground)] group-hover:text-[var(--background)] transition-colors">
                    {m.message}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Foreground Hero */}
      <div className="relative z-20 w-full max-w-xl mx-auto p-10 sm:p-14 rounded-[3rem] bg-[var(--background)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl flex flex-col items-center justify-center text-center mx-4 pointer-events-auto">
        <TextReveal
          as="h2"
          text="Guest Messages"
          className="text-4xl sm:text-6xl font-sans font-black tracking-tighter uppercase mb-6"
        />
        <div className="mb-10 max-w-sm mx-auto space-y-4">
          <p className="text-[var(--muted-foreground)] text-base font-medium leading-relaxed">
            Leave a mark on this infinite field. No login, just raw vibes.
          </p>
          {hiddenCount > 0 && (
            <p className="text-[var(--muted-foreground)]/60 font-mono-meta text-xs tracking-wide">
              {visibleMessages.length} of {messages.length} messages orbiting
            </p>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative px-10 py-5 bg-transparent text-[var(--foreground)] border border-[var(--border)] rounded-full font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-[var(--foreground)] hover:scale-[1.03] active:scale-[0.97]"
        >
          <span className="relative z-10 flex items-center gap-3 transition-colors group-hover:text-[var(--background)]">
            Write Message
            <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
              ↗
            </span>
          </span>
          <div className="absolute inset-0 bg-[var(--foreground)] translate-y-[110%] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
        </button>
      </div>

      <CommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
