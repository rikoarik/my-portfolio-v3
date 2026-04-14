"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type LoaderTextAnimation =
  | "fade"
  | "slide-up"
  | "pulse"
  | "typewriter"
  | "flip"
  | "glitch";

type LoaderConfig = {
  label: string;
  messages: string[];
  textAnimation: LoaderTextAnimation;
  colors?: {
    overlayBg: string;
    text: string;
  };
};

const DEFAULT_LOADER_CONFIG: LoaderConfig = {
  label: "Loading",
  messages: ["Preparing scene", "Loading portfolio"],
  textAnimation: "slide-up",
  colors: {
    overlayBg: "#12100E",
    text: "#F3EDE6",
  },
};

export function PageLoader({
  isLoading,
  config,
}: {
  isLoading: boolean;
  config?: LoaderConfig;
}) {
  const resolvedConfig = config ?? DEFAULT_LOADER_CONFIG;
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const exitPlayedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isLoading) return;

    const counterEl = counterRef.current;
    const progressEl = progressRef.current;
    if (!counterEl || !progressEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const playExit = () => {
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;
      if (!overlayEl || !contentEl) return;
      if (exitPlayedRef.current) return;
      exitPlayedRef.current = true;

      const tlExit = gsap.timeline({
        onComplete: () => {
          overlayEl.style.display = "none";
        },
      });
      tlExit.to(contentEl, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.inOut",
      });
      tlExit.to(
        overlayEl,
        {
          yPercent: -100,
          borderBottomLeftRadius: "50% 10%",
          borderBottomRightRadius: "50% 10%",
          duration: 1,
          ease: "power4.inOut",
        },
        "-=0.1"
      );
    };

    if (reduced) {
      counterEl.textContent = "100";
      gsap.set(progressEl, { width: "100%" });
      playExit();
      return;
    }

    const proxy = { value: 0 };
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: playExit,
    });

    tl.to(proxy, {
      value: 100,
      duration: 2,
      onUpdate: () => {
        counterEl.textContent = String(Math.round(proxy.value));
      },
    }).to(
      progressEl,
      {
        width: "100%",
        duration: 2,
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [isLoading, mounted]);

  useEffect(() => {
    if (!mounted || !isLoading) return;
    if (resolvedConfig.messages.length <= 1) return;
    const timer = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % resolvedConfig.messages.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, [isLoading, mounted, resolvedConfig.messages.length]);

  useEffect(() => {
    if (!mounted) return;
    if (isLoading) return;

    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    if (!overlayEl || !contentEl) return;
    if (exitPlayedRef.current) return;
    exitPlayedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        overlayEl.style.display = "none";
      },
    });

    tl.to(contentEl, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.inOut",
    });

    tl.to(
      overlayEl,
      {
        yPercent: -100,
        borderBottomLeftRadius: "50% 10%",
        borderBottomRightRadius: "50% 10%",
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, [isLoading, mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="pastel-loader-overlay fixed inset-0 z-[99999] overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <style>{`
        .pastel-loader-overlay {
          background: ${resolvedConfig.colors?.overlayBg ?? DEFAULT_LOADER_CONFIG.colors?.overlayBg};
        }
        .pastel-loader-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(58px);
          opacity: 0.6;
          will-change: transform;
        }
        .pastel-loader-blob--a {
          width: min(52vw, 720px);
          height: min(52vw, 720px);
          top: -18%;
          left: -12%;
          background: radial-gradient(circle at 45% 45%, color-mix(in srgb, var(--primary) 55%, transparent), transparent 72%);
          animation: pl-float-a 22s ease-in-out infinite alternate;
        }
        .pastel-loader-blob--b {
          width: min(48vw, 680px);
          height: min(48vw, 680px);
          top: -12%;
          right: -16%;
          background: radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 72%);
          animation: pl-float-b 35s ease-in-out infinite alternate;
        }
        .pastel-loader-blob--c {
          width: min(46vw, 620px);
          height: min(46vw, 620px);
          bottom: -18%;
          left: 14%;
          background: radial-gradient(circle at 50% 55%, color-mix(in srgb, var(--primary) 36%, var(--background)), transparent 72%);
          animation: pl-float-c 28s ease-in-out infinite alternate;
        }
        .pastel-loader-blob--d {
          width: min(44vw, 600px);
          height: min(44vw, 600px);
          bottom: -14%;
          right: -8%;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--foreground) 25%, transparent), transparent 72%);
          animation: pl-float-d 30s ease-in-out infinite alternate;
        }
        .pastel-loader-noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E");
          background-size: 240px 240px;
        }
        @keyframes pl-float-a {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(24px, 18px, 0) scale(1.08); }
        }
        @keyframes pl-float-b {
          0% { transform: translate3d(0, 0, 0) scale(1.02); }
          100% { transform: translate3d(-28px, 26px, 0) scale(1.1); }
        }
        @keyframes pl-float-c {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(22px, -24px, 0) scale(1.09); }
        }
        @keyframes pl-float-d {
          0% { transform: translate3d(0, 0, 0) scale(1.01); }
          100% { transform: translate3d(-20px, -16px, 0) scale(1.07); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pastel-loader-blob { animation: none !important; }
        }
        .pastel-loader-message {
          min-height: 1.2rem;
        }
        .pastel-loader-message--fade {
          animation: pl-text-fade 0.8s ease both;
        }
        .pastel-loader-message--slide-up {
          animation: pl-text-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pastel-loader-message--pulse {
          animation: pl-text-pulse 0.9s ease both;
        }
        .pastel-loader-message--typewriter {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid currentColor;
          animation:
            pl-text-typing 0.95s steps(22, end) both,
            pl-text-caret 0.75s step-end 2;
        }
        .pastel-loader-message--flip {
          transform-origin: 50% 85%;
          animation: pl-text-flip 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pastel-loader-message--glitch {
          animation: pl-text-glitch 0.7s steps(2, end) both;
        }
        @keyframes pl-text-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pl-text-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pl-text-pulse {
          0% { opacity: 0; transform: scale(0.98); }
          55% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pl-text-typing {
          from { width: 0; opacity: 0.75; }
          to { width: 100%; opacity: 1; }
        }
        @keyframes pl-text-caret {
          0%, 100% { border-color: transparent; }
          50% { border-color: currentColor; }
        }
        @keyframes pl-text-flip {
          from { opacity: 0; transform: rotateX(-85deg) translateY(8px); }
          to { opacity: 1; transform: rotateX(0deg) translateY(0); }
        }
        @keyframes pl-text-glitch {
          0% { opacity: 0; transform: translate(0, 0); filter: blur(1px); }
          30% { transform: translate(-1px, 1px); }
          60% { transform: translate(1px, -1px); }
          100% { opacity: 1; transform: translate(0, 0); filter: blur(0); }
        }
      `}</style>

      <div className="pastel-loader-blob pastel-loader-blob--a" aria-hidden />
      <div className="pastel-loader-blob pastel-loader-blob--b" aria-hidden />
      <div className="pastel-loader-blob pastel-loader-blob--c" aria-hidden />
      <div className="pastel-loader-blob pastel-loader-blob--d" aria-hidden />
      <div className="pastel-loader-noise" aria-hidden />

      <div
        ref={contentRef}
        className="pastel-loader-content absolute bottom-8 left-6 z-[2] sm:bottom-10 sm:left-10"
        style={{ color: resolvedConfig.colors?.text ?? DEFAULT_LOADER_CONFIG.colors?.text }}
      >
        <p
          className="mb-3 font-mono-meta text-[0.62rem] uppercase tracking-[0.28em]"
          style={{ color: "color-mix(in srgb, currentColor 72%, transparent)" }}
        >
          {resolvedConfig.label}
        </p>
        <p
          key={`${messageIndex}-${resolvedConfig.textAnimation}`}
          className={`pastel-loader-message mb-2 text-xs tracking-[0.08em] pastel-loader-message--${resolvedConfig.textAnimation}`}
          style={{ color: "color-mix(in srgb, currentColor 72%, transparent)" }}
        >
          {resolvedConfig.messages[messageIndex] ?? ""}
        </p>
        <div className="leading-none">
          <span
            ref={counterRef}
            className="font-if-display text-[clamp(8rem,16vw,10rem)] font-bold"
            style={{ color: resolvedConfig.colors?.text ?? DEFAULT_LOADER_CONFIG.colors?.text }}
          >
            0
          </span>
        </div>
        <div className="mt-4 h-px w-[min(52vw,420px)] bg-white/20">
          <div
            ref={progressRef}
            className="h-full w-0 bg-[color-mix(in_srgb,var(--foreground)_88%,var(--primary))]"
          />
        </div>
      </div>
    </div>
  );
}
