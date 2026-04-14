"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const particleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = particleLayerRef.current;
    if (!layer) return;
    layer.innerHTML = "";

    const total = 20;
    for (let i = 0; i < total; i += 1) {
      const p = document.createElement("span");
      p.className = "z404-ghost-particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.animationDuration = `${8 + Math.random() * 7}s`;
      p.style.opacity = `${0.2 + Math.random() * 0.45}`;
      p.style.transform = `scale(${0.6 + Math.random() * 1.1})`;
      layer.appendChild(p);
    }
  }, []);

  return (
    <main className="z404-page">
      <style>{`
        .z404-page {
          --bg-1: #1b2520;
          --bg-2: #23212d;
          --ink: #f3eadf;
          --muted: #c4b8ab;
          --zombie: #88a891;
          --zombie-dark: #5f7a69;
          --amber: #e3a760;
          --purple: #7d6f9c;
          min-height: 100svh;
          background:
            radial-gradient(70% 45% at 50% 8%, rgb(227 167 96 / 0.09), transparent 72%),
            linear-gradient(165deg, var(--bg-1) 0%, var(--bg-2) 100%);
          color: var(--ink);
          overflow: hidden;
          position: relative;
          font-family: var(--font-syne), system-ui, sans-serif;
        }
        .z404-wrap {
          position: relative;
          z-index: 2;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .z404-card {
          width: min(92vw, 760px);
          border: 1px solid rgb(255 255 255 / 0.12);
          border-radius: 24px;
          background:
            linear-gradient(165deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02));
          backdrop-filter: blur(12px);
          box-shadow: 0 32px 80px -45px rgb(0 0 0 / 0.85);
          text-align: center;
          padding: 28px 24px 30px;
        }
        .z404-title {
          margin: 0;
          font-size: clamp(2.8rem, 9vw, 5.6rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-shadow: 0 0 18px rgb(125 111 156 / 0.2);
        }
        .z404-sub {
          margin: 14px auto 0;
          max-width: 38ch;
          color: var(--muted);
          font-size: 1rem;
        }
        .z404-zombie {
          width: min(280px, 70vw);
          margin: 18px auto 0;
          position: relative;
          animation: zombieFloat 4.8s ease-in-out infinite;
        }
        @keyframes zombieFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .z404-head {
          width: 132px;
          height: 122px;
          margin: 0 auto;
          border-radius: 46% 54% 50% 50%;
          background: linear-gradient(170deg, var(--zombie) 0%, var(--zombie-dark) 100%);
          position: relative;
          border: 2px solid rgb(24 34 29 / 0.35);
          box-shadow: inset 0 -12px 22px rgb(0 0 0 / 0.18);
        }
        .z404-eye {
          width: 22px;
          height: 26px;
          border-radius: 50%;
          background: #233328;
          position: absolute;
          top: 42px;
        }
        .z404-eye::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #dce7d7;
          position: absolute;
          top: 10px;
          left: 7px;
        }
        .z404-eye.left { left: 34px; transform: rotate(-7deg); }
        .z404-eye.right { right: 28px; transform: rotate(12deg); }
        .z404-mouth {
          width: 44px;
          height: 18px;
          border-bottom: 4px solid #2f473a;
          border-radius: 0 0 22px 22px;
          position: absolute;
          left: 44px;
          top: 82px;
          transform: rotate(-5deg);
        }
        .z404-body {
          width: 170px;
          height: 118px;
          margin: -8px auto 0;
          border-radius: 22px;
          background:
            linear-gradient(165deg, rgb(125 111 156 / 0.5), rgb(73 91 80 / 0.75));
          border: 2px solid rgb(32 42 37 / 0.42);
          position: relative;
        }
        .z404-sign {
          width: 134px;
          padding: 10px 0;
          border-radius: 14px;
          background: #efe2cf;
          color: #45372a;
          font-weight: 800;
          letter-spacing: 0.08em;
          position: absolute;
          left: 50%;
          bottom: -16px;
          transform: translateX(-50%) rotate(-6deg);
          border: 2px solid #b08b61;
          box-shadow: 0 10px 26px -16px rgb(0 0 0 / 0.7);
        }
        .z404-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 11px 24px;
          border-radius: 999px;
          background: linear-gradient(145deg, var(--amber), #d98f45);
          color: #1f1711;
          font-weight: 700;
          text-decoration: none;
          box-shadow:
            0 0 0 1px rgb(255 255 255 / 0.25) inset,
            0 0 28px rgb(227 167 96 / 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .z404-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px rgb(255 255 255 / 0.28) inset,
            0 0 34px rgb(227 167 96 / 0.6);
        }
        .z404-candle-glow {
          pointer-events: none;
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          left: -40px;
          top: 10%;
          background: radial-gradient(circle, rgb(227 167 96 / 0.3), transparent 68%);
          filter: blur(8px);
          animation: candleFlicker 2.1s ease-in-out infinite;
        }
        @keyframes candleFlicker {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          25% { opacity: 0.34; transform: scale(0.96); }
          50% { opacity: 0.72; transform: scale(1.05); }
          75% { opacity: 0.43; transform: scale(0.98); }
        }
        .z404-particle-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .z404-ghost-particle {
          position: absolute;
          bottom: -20px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 35% 35%, rgb(255 255 255 / 0.78), rgb(125 111 156 / 0.18));
          filter: blur(0.3px);
          animation: ghostRise linear infinite;
        }
        @keyframes ghostRise {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          14% { opacity: 1; }
          100% { transform: translate3d(0, -120vh, 0); opacity: 0; }
        }
        .z404-fog {
          position: absolute;
          left: -15%;
          right: -15%;
          bottom: -34px;
          height: 180px;
          background:
            radial-gradient(60% 100% at 20% 100%, rgb(255 255 255 / 0.09), transparent 70%),
            radial-gradient(50% 90% at 70% 100%, rgb(125 111 156 / 0.12), transparent 72%);
          filter: blur(14px);
          animation: fogDrift 13s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes fogDrift {
          0% { transform: translateX(-2%); opacity: 0.55; }
          100% { transform: translateX(2%); opacity: 0.75; }
        }
        @media (prefers-reduced-motion: reduce) {
          .z404-zombie, .z404-candle-glow, .z404-ghost-particle, .z404-fog { animation: none !important; }
        }
      `}</style>

      <div className="z404-candle-glow" aria-hidden />
      <div ref={particleLayerRef} className="z404-particle-layer" aria-hidden />
      <div className="z404-fog" aria-hidden />

      <section className="z404-wrap">
        <div className="z404-card">
          <h1 className="z404-title">404</h1>
          <div className="z404-zombie" aria-hidden>
            <div className="z404-head">
              <span className="z404-eye left" />
              <span className="z404-eye right" />
              <span className="z404-mouth" />
            </div>
            <div className="z404-body">
              <div className="z404-sign">404</div>
            </div>
          </div>
          <p className="z404-sub">Oops... even the zombies can&apos;t find this page.</p>
          <Link href="/" className="z404-btn">
            Take me home
          </Link>
        </div>
      </section>
    </main>
  );
}

