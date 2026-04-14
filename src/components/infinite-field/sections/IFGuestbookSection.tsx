"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { GuestMessage } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";
import { CommentModal } from "./CommentModal";

/** Max floating labels — keeps orbit readable; rest stay in data + modal list semantics */
const VISIBLE_CAP = 18;
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

/** Keep bubbles out of center band where heading + CTA sit (drift can still skim edge) */
function nudgeOutOfHeroBand(
  left: number,
  top: number,
  rnd: () => number
): { left: number; top: number } {
  const h0 = 12;
  const h1 = 88;
  const v0 = 28;
  const v1 = 76;
  if (left < h0 || left > h1 || top < v0 || top > v1) return { left, top };

  if (rnd() > 0.5) {
    left = rnd() > 0.5 ? 4 + rnd() * 10 : 86 + rnd() * 10;
  } else {
    top = rnd() > 0.5 ? 6 + rnd() * 14 : 80 + rnd() * 12;
  }
  return { left: clamp(left, 4, 96), top: clamp(top, 5, 94) };
}

/** Evenly sample across full list so newer/older both get a chance */
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
  /** Full round-trip seconds (right→left or left→right) */
  cycleDuration: number;
  /** Horizontal travel in px one way */
  commutePx: number;
  startGoingRight: boolean;
};

function layoutBubbles(messages: GuestMessage[]): BubbleLayout[] {
  const cols = 5;
  const rows = 4;
  const zones = cols * rows;

  return messages.map((m, index) => {
    const rnd = seededRand(hashId(m.id) + index * 997);
    const zone = (index * 11 + hashId(m.id)) % zones;
    const col = zone % cols;
    const row = Math.floor(zone / cols);
    const jx = (rnd() - 0.5) * (70 / cols);
    const jy = (rnd() - 0.5) * (75 / rows);
    let left = 6 + ((col + 0.5) / cols) * 88 + jx;
    let top = 5 + ((row + 0.5) / rows) * 90 + jy;
    const nudged = nudgeOutOfHeroBand(clamp(left, 4, 96), clamp(top, 4, 96), rnd);
    left = nudged.left;
    top = nudged.top;
    const depth = 0.5 + rnd() * 0.5;

    return {
      left,
      top,
      scale: 0.42 + depth * 0.22,
      opacity: 0.38 + depth * 0.18,
      cycleDuration: 22 + rnd() * 18,
      commutePx: 72 + rnd() * 100,
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
    gsap.getTweensOf(bubble).forEach((t) => {
      t.pause();
    });
  }, []);

  const resumeBubbleMotion = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const bubble = e.currentTarget;
    gsap.getTweensOf(bubble).forEach((t) => {
      t.resume();
    });
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

        const delay = index * 0.35;
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
          duration: 1.6,
          delay,
          ease: "sine.out",
        });

        /* Horizontal commute: one way → return (clear “pergi–pulang”, bukan melayang random) */
        gsap.to(item, {
          keyframes: [
            { x: out, duration: half, ease: "power1.inOut" },
            { x: back, duration: half, ease: "power1.inOut" },
          ],
          repeat: -1,
          delay,
        });
      });
    }, root);

    return () => ctx.revert();
  }, [visibleMessages, layouts]);

  /** Keep section transitions plain: no fold/snap reveal effect */
  useEffect(() => {
    return;
  }, []);

  const hiddenCount = Math.max(0, (messages?.length ?? 0) - visibleMessages.length);

  return (
    <section
      ref={rootRef}
      id="guestbook"
      className={`ifs-section ifs-guestbook-section relative isolate z-[2] min-h-[80vh] flex flex-col items-center justify-center ${
        hoveredBubbleId ? "ifs-guest-focus" : ""
      }`}
    >
      <div
        ref={driftContainerRef}
        className="absolute inset-0 z-[1] pointer-events-none select-none md:pointer-events-auto"
      >
        {visibleMessages.map((m) => (
          <div
            key={m.id}
            className={`ifs-guest-bubble group absolute ${
              hoveredBubbleId === m.id ? "is-active" : hoveredBubbleId ? "is-inactive" : ""
            }`}
            onMouseEnter={pauseBubbleMotion}
            onMouseLeave={resumeBubbleMotion}
            onPointerEnter={() => setHoveredBubbleId(m.id)}
            onPointerLeave={() => setHoveredBubbleId((curr) => (curr === m.id ? null : curr))}
          >
            <div className="ifs-guest-bubble-sway will-change-transform">
              <div className="ifs-guest-bubble-inner origin-center whitespace-nowrap rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_88%,var(--muted))] px-4 py-2 text-xs shadow-sm transition-[transform,box-shadow,opacity,border-color,padding,font-size,background,filter,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.3] group-hover:border-[color-mix(in_srgb,var(--primary)_74%,white)] group-hover:bg-[color-mix(in_srgb,var(--card)_58%,var(--primary)_42%)] group-hover:px-6 group-hover:py-3 group-hover:text-sm group-hover:opacity-100 group-hover:shadow-[0_22px_55px_-14px_rgb(0_0_0_/_0.62),0_0_0_1px_var(--primary-glow)]">
                <span className="font-bold text-[var(--primary)] mr-2">{m.name}:</span>
                <span className="text-[var(--foreground)]">{m.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero — above bubbles; matte so orbit never reads over CTA */}
      <div className="relative z-20 mx-auto max-w-xl text-center px-6 py-10 sm:px-10 sm:py-12 rounded-[2rem] border border-[color-mix(in_srgb,var(--border)_72%,transparent)] bg-[color-mix(in_srgb,var(--card)_90%,transparent)] shadow-[0_18px_44px_-24px_rgb(0_0_0_/_0.55),inset_0_1px_0_rgb(255_255_255_/_0.06)] backdrop-blur-md pointer-events-auto">
        <TextReveal
          as="h2"
          text="Guest Messages"
          className="ifs-heading text-center mb-4"
        />
        <div className="mb-12 max-w-lg mx-auto space-y-3">
          <p className="text-[color-mix(in_srgb,var(--foreground)_76%,var(--muted-foreground))]">
            Leave a mark on this infinite field. No login, just vibes.
          </p>
          {hiddenCount > 0 ? (
            <p className="text-[var(--muted-foreground)]/85 font-mono-meta text-xs tracking-wide">
              Menampilkan {visibleMessages.length} dari {messages.length} pesan di orbit agar tetap mudah dibaca.
            </p>
          ) : null}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full font-bold overflow-hidden border border-[color-mix(in_srgb,var(--primary)_70%,transparent)] shadow-[0_14px_34px_-18px_var(--primary-glow)] transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Leave a Message</span>
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--primary)_78%,black)] translate-y-full transition-transform group-hover:translate-y-0" />
        </button>
      </div>

      <CommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
