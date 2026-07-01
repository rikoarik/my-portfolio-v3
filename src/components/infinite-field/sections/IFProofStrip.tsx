"use client";

import { useEffect, useMemo, useRef } from "react";
import { loadGsap, registerGsapPlugins } from "@/lib/gsap";
import type { SectionContent } from "@/types/portfolio";
import { useT } from "@/i18n/context";

const PROOF_MARQUEE_DURATION = 500;

export function IFProofStrip({ section }: { section?: SectionContent }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);

  const defaultStats = useMemo(
    () => [
      {
        value: t("proofStrip.stats.productionApps.value"),
        label: t("proofStrip.stats.productionApps.label"),
      },
      {
        value: t("proofStrip.stats.mobileExperience.value"),
        label: t("proofStrip.stats.mobileExperience.label"),
      },
      {
        value: t("proofStrip.stats.ship.value"),
        label: t("proofStrip.stats.ship.label"),
      },
      {
        value: t("proofStrip.stats.fintech.value"),
        label: t("proofStrip.stats.fintech.label"),
      },
    ],
    [t],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void (async () => {
      await registerGsapPlugins();
      if (!mounted) return;
      const { gsap } = await loadGsap();
      if (!mounted) return;

      ctx = gsap.context(() => {
        const marquees = root.querySelectorAll(".ifs-proof-marquee");

        // Infinite Marquee setup
        const marqueeTween = gsap.to(marquees, {
          xPercent: -1000,
          repeat: -1,
          duration: PROOF_MARQUEE_DURATION,
          ease: "linear",
          paused: true,
        });

        // Always outline-only (stroke text)
        root.querySelectorAll(".ifs-proof-value").forEach((el) => el.classList.add("ifs-stroke-text"));

        // Pause marquee offscreen / tab hidden (saves CPU + allocations)
        let inView = false;
        const setRunning = (next: boolean) => {
          if (document.visibilityState === "hidden") {
            marqueeTween.pause();
            return;
          }
          if (next) marqueeTween.play();
          else marqueeTween.pause();
        };

        const io = new IntersectionObserver(
          ([e]) => {
            inView = Boolean(e?.isIntersecting);
            setRunning(inView);
          },
          { threshold: 0.05 },
        );
        io.observe(root);

        const onVis = () => setRunning(inView);
        document.addEventListener("visibilitychange", onVis);

        return () => {
          document.removeEventListener("visibilitychange", onVis);
          io.disconnect();
          marqueeTween.kill();
        };
      }, root);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, []);

  const sourceStats = Array.isArray(section?.meta?.stats)
    ? (section.meta.stats as { value: string; label: string }[])
    : defaultStats;

  const infiniteStats = [...sourceStats, ...sourceStats, ...sourceStats, ...sourceStats];

  return (
    <section ref={rootRef} className="ifs-proof-strip" aria-label={t("proofStrip.ariaLabel")}>
      <div className="ifs-proof-marquee">
        {infiniteStats.map((stat, i) => (
          <div key={`m1-${i}`} className="ifs-proof-item">
            <span className="ifs-proof-value">{stat.value}</span>
            <span className="ifs-proof-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="ifs-proof-marquee" aria-hidden="true">
        {infiniteStats.map((stat, i) => (
          <div key={`m2-${i}`} className="ifs-proof-item">
            <span className="ifs-proof-value">{stat.value}</span>
            <span className="ifs-proof-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
