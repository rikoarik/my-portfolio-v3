"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { GuestMessage } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";
import { InteractiveGridBackground } from "@/components/visual/InteractiveGridBackground";
import { CommentModal } from "./CommentModal";

const VISIBLE_CAP = 12;
const GRAVITY = 0.55;
const RESTITUTION = 0.18;
const FRICTION = 0.78;
const AIR = 0.992;
const ANG_AIR = 0.97;
const ANG_FRICTION = 0.88;
const SUBSTEPS = 3;

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
function hashStr(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }
function pickVisible(all: GuestMessage[], cap: number): GuestMessage[] {
  if (all.length <= cap) return all;
  const out: GuestMessage[] = [];
  const step = (all.length - 1) / Math.max(1, cap - 1);
  for (let i = 0; i < cap; i++) out.push(all[Math.round(i * step)]);
  return out;
}

type Body = {
  id: string;
  el: HTMLDivElement | null;
  x: number; y: number;
  vx: number; vy: number;
  angle: number; av: number;
  w: number; h: number;
  layer: number;   // 0=back 1=front
  scale: number;
  throwVx: number; throwVy: number;
};

function applyTransform(b: Body) {
  if (!b.el || !b.w) return;
  const tx = Math.round(b.x - (b.w * b.scale) / 2);
  const ty = Math.round(b.y - (b.h * b.scale) / 2);
  // keep text crisp: no rotate/scale (those blur glyph rasterization)
  b.el.style.transform = `translate3d(${tx}px,${ty}px,0)`;
}

function resolveCollision(a: Body, b: Body) {
  if (!a.w || !b.w) return;
  const aw = a.w * a.scale, ah = a.h * a.scale;
  const bw = b.w * b.scale, bh = b.h * b.scale;
  const overlapX = (aw + bw) / 2 - Math.abs(a.x - b.x);
  const overlapY = (ah + bh) / 2 - Math.abs(a.y - b.y);
  if (overlapX <= 0 || overlapY <= 0) return;

  const massA = aw * ah, massB = bw * bh, total = massA + massB;
  const rA = massB / total, rB = massA / total;
  const e = 0.12;

  if (overlapX < overlapY) {
    const sign = a.x < b.x ? -1 : 1;
    const push = overlapX * 0.5;
    a.x += sign * push * rA; a.vx = sign * Math.abs(a.vx) * e + sign * 0.3;
    b.x -= sign * push * rB; b.vx = -sign * Math.abs(b.vx) * e - sign * 0.3;
  } else {
    const sign = a.y < b.y ? -1 : 1;
    const push = overlapY * 0.5;
    a.y += sign * push * rA; a.vy = sign * Math.abs(a.vy) * e; a.vx *= 0.92;
    b.y -= sign * push * rB; b.vy = -sign * Math.abs(b.vy) * e; b.vx *= 0.92;
  }
}

export function IFGuestbookSection({ messages }: { messages: GuestMessage[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const elMapRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const bodiesRef = useRef<Body[]>([]);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef<Body | null>(null);
  const dragOffRef = useRef({ ox: 0, oy: 0 });
  const prevPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const isVisibleRef = useRef(false);

  const visible = useMemo(() => pickVisible(messages ?? [], VISIBLE_CAP), [messages]);
  const isSafari = useMemo(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    return /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
  }, []);

  // Build body configs from messages (no DOM yet)
  const bodyConfigs = useMemo(() =>
    visible.map((m, i) => {
      const rng = seededRng(hashStr(m.id) + i * 31337);
      const layer = rng();
      return {
        id: m.id,
        layer,
        scale: 1,
        startVx: (rng() - 0.5) * 3,
        startVy: rng() * 1.5,
        startAngle: (rng() - 0.5) * 15,
        startAv: (rng() - 0.5) * 0.8,
        startXRatio: 0.08 + rng() * 0.84,
        startYDrop: 80 + rng() * 400, // px above top
      };
    }), [visible]
  );

  // Init bodies after DOM paint
  useEffect(() => {
    const container = containerRef.current;
    if (!container || visible.length === 0) return;

    const timer = setTimeout(() => {
      const W = container.clientWidth;

      const newBodies: Body[] = bodyConfigs.map((cfg) => {
        const el = elMapRef.current.get(cfg.id) ?? null;
        const bb = el?.getBoundingClientRect();
        const intrinsicW = bb ? bb.width / cfg.scale : 180;
        const intrinsicH = bb ? bb.height / cfg.scale : 44;

        return {
          id: cfg.id,
          el,
          x: cfg.startXRatio * W,
          y: -(cfg.startYDrop),
          vx: cfg.startVx,
          vy: cfg.startVy,
          angle: cfg.startAngle,
          av: cfg.startAv,
          w: intrinsicW,
          h: intrinsicH,
          layer: cfg.layer,
          scale: cfg.scale,
          throwVx: 0,
          throwVy: 0,
        };
      });

      // Sort + assign z-index by layer
      newBodies.sort((a, b) => a.layer - b.layer);
      newBodies.forEach((b, i) => { if (b.el) b.el.style.zIndex = String(i); });

      bodiesRef.current = newBodies;
    }, 80);

    return () => clearTimeout(timer);
  }, [visible, bodyConfigs]);

  // Physics loop
  useEffect(() => {
    const container = containerRef.current;
    const root = rootRef.current;
    if (!container || !root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let running = false;

    const stop = () => {
      if (!running) return;
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const step = (dt: number) => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const bs = bodiesRef.current;

      for (const b of bs) {
        if (b === draggingRef.current || !b.w) continue;
        const hw = (b.w * b.scale) / 2;
        const hh = (b.h * b.scale) / 2;

        b.vy += GRAVITY * dt;
        b.vx *= AIR;
        b.vy *= AIR;
        b.av *= ANG_AIR;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += b.av * dt;
        b.angle = clamp(b.angle, -18, 18);

        // Floor
        if (b.y + hh >= H) {
          b.y = H - hh;
          const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          b.vy = spd > 0.8 ? -Math.abs(b.vy) * RESTITUTION : 0;
          b.vx *= FRICTION;
          b.av *= ANG_FRICTION;
          b.angle *= 0.94;
        }
        if (b.y - hh <= 0) { b.y = hh; b.vy = Math.abs(b.vy) * 0.3; }
        if (b.x - hw <= 0) { b.x = hw; b.vx = Math.abs(b.vx) * 0.4; b.av -= b.vy * 0.01; }
        if (b.x + hw >= W) { b.x = W - hw; b.vx = -Math.abs(b.vx) * 0.4; b.av += b.vy * 0.01; }
      }

      // Collisions
      for (let i = 0; i < bs.length; i++)
        for (let j = i + 1; j < bs.length; j++)
          resolveCollision(bs[i], bs[j]);
    };

    const tick = (now: number) => {
      if (!running) return;
      if (!isVisibleRef.current || reduced) {
        last = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(40, now - last) / 16.67;
      last = now;

      const substeps = isSafari ? 1 : SUBSTEPS;
      for (let s = 0; s < substeps; s++) step(dt / substeps);
      for (const b of bodiesRef.current) applyTransform(b);

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([e]) => {
        isVisibleRef.current = e.isIntersecting;
        if (e.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    observer.observe(root);

    return () => {
      stop();
      observer.disconnect();
    };
  }, [isSafari]);

  // Scroll impulse
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (Math.abs(dy) < 2) return;
      for (const b of bodiesRef.current) {
        b.vy += clamp(dy * 0.06, -8, 8);
        b.vx += (Math.random() - 0.5) * 1.5;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const b = bodiesRef.current.find((b) => b.id === id);
    if (!b || !b.w) return;
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = b;
    dragOffRef.current = { ox: e.clientX - b.x, oy: e.clientY - b.y };
    prevPointerRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    b.vx = 0; b.vy = 0; b.av = 0;
    if (b.el) b.el.style.zIndex = "9999";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent, id: string) => {
    const b = draggingRef.current;
    if (!b || b.id !== id) return;
    const prev = prevPointerRef.current;
    const dt = Math.max(1, e.timeStamp - prev.t);
    b.x = e.clientX - dragOffRef.current.ox;
    b.y = e.clientY - dragOffRef.current.oy;
    b.throwVx = (e.clientX - prev.x) / dt * 16;
    b.throwVy = (e.clientY - prev.y) / dt * 16;
    prevPointerRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    applyTransform(b);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent, id: string) => {
    const b = draggingRef.current;
    if (!b || b.id !== id) return;
    b.vx = clamp(b.throwVx, -22, 22);
    b.vy = clamp(b.throwVy, -22, 22);
    b.av = b.vx * 0.08;
    if (b.el) b.el.style.zIndex = String(Math.round(b.layer * bodiesRef.current.length));
    draggingRef.current = null;
  }, []);

  const hiddenCount = Math.max(0, (messages?.length ?? 0) - visible.length);

  return (
    <section
      ref={rootRef}
      id="guestbook"
      className="ifs-guestbook-section relative z-[2] flex min-h-screen w-full items-center justify-center overflow-visible bg-[var(--background)] py-24 pb-28 sm:pb-32"
    >
      <InteractiveGridBackground />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--foreground)_22%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--foreground)_22%,transparent)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      {/* Physics container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-[40] overflow-hidden pointer-events-none"
      >
        {visible.map((m, i) => {
          const cfg = bodyConfigs[i];
          // Depth via opacity only (filter blur makes text unreadable)
          const opacityVal = 0.45 + cfg.layer * 0.55;

          return (
            <div
              key={m.id}
              ref={(node) => {
                if (!node) { elMapRef.current.delete(m.id); return; }
                elMapRef.current.set(m.id, node);
              }}
              className="absolute left-0 top-0 will-change-transform pointer-events-auto cursor-grab active:cursor-grabbing select-none"
              onPointerDown={(e) => onPointerDown(e, m.id)}
              onPointerMove={(e) => onPointerMove(e, m.id)}
              onPointerUp={(e) => onPointerUp(e, m.id)}
              onPointerCancel={(e) => onPointerUp(e, m.id)}
            >
              <div
                className="ifs-guest-glass max-w-[min(80vw,20rem)] px-4 py-3 text-sm sm:px-5 sm:py-3.5 backdrop-blur-md"
                style={{
                  opacity: opacityVal,
                }}
              >
                <span className="block text-xs font-extrabold tracking-wide text-[var(--foreground)]">
                  {m.name}
                </span>
                <span className="block text-xs font-semibold text-[var(--muted-foreground)]">
                  {m.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center heading */}
      <div className="relative z-[30] mx-auto flex w-[min(100%,32rem)] max-w-xl flex-col items-center justify-center text-center pointer-events-auto px-6 sm:px-0">
        <TextReveal
          as="h2"
          text="Guest Messages"
          className="text-[clamp(1.75rem,8vw,2.25rem)] font-sans font-black uppercase tracking-tighter sm:text-6xl mb-6"
        />
        <div className="mb-10 max-w-sm mx-auto space-y-4">
          <p className="text-[var(--muted-foreground)] text-base font-medium leading-relaxed">
            Leave a mark on this infinite field. No login, just raw vibes.
          </p>
          {hiddenCount > 0 && (
            <p className="text-[var(--muted-foreground)]/60 font-mono text-xs tracking-wide">
              {visible.length} of {messages.length} messages orbiting
            </p>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative w-full max-w-xs px-6 py-4 text-[var(--foreground)] sm:w-auto sm:max-w-none sm:px-10 sm:py-5 bg-transparent border border-[var(--border)] rounded-full font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-[var(--foreground)] hover:scale-[1.03] active:scale-[0.97]"
        >
          <span className="relative z-10 flex items-center gap-3 transition-colors group-hover:text-[var(--background)]">
            Write Message
            <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
          </span>
          <div className="absolute inset-0 bg-[var(--foreground)] translate-y-[110%] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
        </button>
      </div>

      <CommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}