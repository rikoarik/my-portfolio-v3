"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import type { SectionContent } from "@/types/portfolio";

const stats = [
  { value: "99+", label: "Projects Completed" },
  { value: "40K+", label: "Satisfied Clients" },
  { value: "12+", label: "Years Experience" },
  { value: "Ship", label: "Play Store · App Store" },
];

/** Seconds for one full pass — higher = easier to read */
const PROOF_MARQUEE_DURATION = 500;

export function IFProofStrip({ section }: { section?: SectionContent }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const marquees = root.querySelectorAll(".ifs-proof-marquee");

      // Infinite Marquee setup
      gsap.to(marquees, {
        xPercent: -1000,
        repeat: -1,
        duration: PROOF_MARQUEE_DURATION,
        ease: "linear",
      });

      // Outline morphing trigger
      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        onEnter: () => {
          root.querySelectorAll('.ifs-proof-value').forEach(el => el.classList.remove('ifs-stroke-text'));
        },
        onLeaveBack: () => {
          root.querySelectorAll('.ifs-proof-value').forEach(el => el.classList.add('ifs-stroke-text'));
        }
      });
      
      // Initialize outline
      root.querySelectorAll('.ifs-proof-value').forEach(el => el.classList.add('ifs-stroke-text'));
    }, root);

    return () => ctx.revert();
  }, []);

  const sourceStats = Array.isArray(section?.meta?.stats)
    ? (section?.meta.stats as { value: string; label: string }[])
    : stats;

  // We duplicate the stats array 4 times to create enough length for a seamless marquee
  const infiniteStats = [...sourceStats, ...sourceStats, ...sourceStats, ...sourceStats];

  return (
    <section ref={rootRef} className="ifs-proof-strip" aria-label="Key statistics">
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
