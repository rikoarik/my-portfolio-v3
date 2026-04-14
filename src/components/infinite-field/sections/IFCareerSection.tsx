"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { Education, Experience, SkillGroup } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";

function fmtPeriod(e: { start_date: string | null; end_date: string | null }) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}

export function IFCareerSection({
  experiences,
  skillGroups,
  education,
}: {
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: Education[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  const expShown = experiences.slice(0, 4);
  const skillStep = expShown.length + 1;
  const eduShown = education.slice(0, 1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {

      // ─── 4. Directional Slide: left cards from x:-60, right from x:+60 ───
      root.querySelectorAll<HTMLElement>(".ifs-card-animated").forEach((el) => {
        const row = el.closest(".ifs-career-row");
        const isLeft = row?.classList.contains("ifs-row-left");
        gsap.fromTo(
          el,
          { opacity: 0, x: isLeft ? -60 : 60, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ─── 1. Number Counter Animation on Step Numbers ───
      root.querySelectorAll<HTMLElement>(".ifs-career-step[data-target]").forEach((el) => {
        const target = parseInt(el.dataset.target || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate() {
            el.textContent = String(Math.round(obj.val)).padStart(2, "0");
          },
        });
      });

      // ─── 2. Staggered Chip Animation in Expertise Card ───
      root.querySelectorAll<HTMLElement>(".ifs-career-expertise-card").forEach((card) => {
        const chips = card.querySelectorAll<HTMLElement>(".ifs-career-chip");
        gsap.fromTo(
          chips,
          { opacity: 0, scale: 0.7, y: 12 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.4)",
            stagger: 0.06,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ─── 3. Border-left Grow on Blockquotes ───
      root.querySelectorAll<HTMLElement>(".ifs-career-quote").forEach((bq) => {
        bq.style.setProperty("--bq-scale", "0");
        const proxy = { value: 0 };
        gsap.to(proxy, {
          value: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bq,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            bq.style.setProperty("--bq-scale", String(proxy.value));
          },
        });
      });

      // ─── 5. Parallax Subtle on Nodes + Pop-in ───
      root.querySelectorAll<HTMLElement>(".ifs-journey-node").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        // Subtle parallax drift
        gsap.to(node, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // ─── 6. Active Node Pulse — node in center viewport gets pulse ring ───
      root.querySelectorAll<HTMLElement>(".ifs-journey-node").forEach((node) => {
        gsap.to(node, {
          scrollTrigger: {
            trigger: node,
            start: "top 55%",
            end: "bottom 45%",
            toggleClass: { targets: node, className: "ifs-node-active" },
          },
        });
      });

      // ─── SVG path draw on scroll ───
      gsap.utils.toArray<SVGPathElement>(".ifs-winding-path").forEach((path) => {
        const drawnLength = path.getTotalLength() || 2000;
        gsap.fromTo(
          path,
          {
            strokeDasharray: drawnLength + 10,
            strokeDashoffset: drawnLength + 10,
          },
          {
            strokeDashoffset: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: path.closest(".ifs-career-row"),
              start: "top 65%",
              end: "bottom 35%",
              scrub: 1.5,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Combine all cards into one array for sequential timeline rendering
  const allCards = [
    ...expShown.map((e, i) => ({ type: "exp" as const, data: e, index: i + 1 })),
    { type: "stack" as const, data: skillGroups, index: skillStep },
    ...eduShown.map((edu, j) => ({
      type: "edu" as const,
      data: edu,
      index: skillStep + 1 + j,
    })),
  ];

  return (
    <section
      ref={rootRef}
      id="career"
      aria-labelledby="career-title"
      className="ifs-section ifs-career-route pb-24"
    >
      <div className="mx-auto mb-16 max-w-6xl px-3 sm:px-5 lg:px-6 relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <TextReveal
              as="h2"
              id="career-title"
              text="Time Journey"
              className="ifs-heading !mb-0"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-3 sm:px-5 lg:px-6 relative">
        <div className="ifs-vertical-journey">
          {allCards.map((item, i) => {
            const isLeft = i % 2 === 0;
            const isLast = i === allCards.length - 1;

            return (
              <div
                key={`${item.type}-${i}`}
                className={`ifs-career-row ${isLeft ? "ifs-row-left" : "ifs-row-right"}`}
              >
                {/* Winding Curve to next node */}
                {!isLast && (
                  <svg
                    className="ifs-winding-svg hidden lg:block"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={
                        isLeft
                          ? "M0,0 C0,60 100,40 100,100"
                          : "M100,0 C100,60 0,40 0,100"
                      }
                      className="ifs-winding-path"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                <span className="ifs-journey-node hidden lg:block" aria-hidden />

                {item.type === "exp" && (
                  <article className="ifs-horizontal-card ifs-card-animated">
                    <div className="ifs-career-card-head">
                      <span
                        className="ifs-career-step text-3xl font-bold font-if-display text-[var(--primary)] opacity-80"
                        data-target={item.index}
                      >
                        00
                      </span>
                      <span className="ifs-career-pill">
                        {fmtPeriod(item.data as Experience)}
                      </span>
                    </div>
                    <h3 className="ifs-career-role text-2xl lg:text-3xl mt-4 mb-2">
                      {(item.data as Experience).role}
                    </h3>
                    <p className="ifs-career-company text-[var(--primary)] uppercase tracking-wider text-sm font-bold">
                      {(item.data as Experience).company}
                      {(item.data as Experience).location ? (
                        <>
                          <span className="text-[var(--muted-foreground)] px-2">·</span>
                          {(item.data as Experience).location}
                        </>
                      ) : null}
                    </p>
                    {(item.data as Experience).bullets[0] ? (
                      <blockquote className="ifs-career-quote mt-6 pl-4 text-base opacity-80">
                        {(item.data as Experience).bullets[0]}
                      </blockquote>
                    ) : null}
                  </article>
                )}

                {item.type === "stack" && (
                  <article className="ifs-horizontal-card ifs-card-animated ifs-career-expertise-card">
                    <div className="ifs-career-card-head">
                      <span
                        className="ifs-career-step text-3xl font-bold font-if-display text-[var(--accent)] opacity-80"
                        data-target={item.index}
                      >
                        00
                      </span>
                      <span className="ifs-career-pill ifs-career-pill--accent text-[var(--background)] !bg-[var(--foreground)]">
                        Stack
                      </span>
                    </div>
                    <h3 className="ifs-career-role text-2xl lg:text-3xl mt-4 mb-2">
                      Expertise
                    </h3>
                    <p className="ifs-career-lead mt-1 text-[var(--muted-foreground)]">
                      Tools and domains grouped how you ship.
                    </p>
                    <div className="ifs-career-skills mt-6 space-y-5">
                      {(item.data as SkillGroup[]).slice(0, 3).map((g) => (
                        <div key={g.id}>
                          <div className="ifs-skill-name mb-3 text-xs tracking-widest">
                            {g.name}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {g.skills.slice(0, 10).map((s) => (
                              <span
                                key={s.id}
                                className="ifs-career-chip border-none bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full text-sm"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                )}

                {item.type === "edu" && (
                  <article className="ifs-horizontal-card ifs-card-animated">
                    <div className="ifs-career-card-head">
                      <span
                        className="ifs-career-step text-3xl font-bold font-if-display text-[var(--primary)] opacity-80"
                        data-target={item.index}
                      >
                        00
                      </span>
                      <span className="ifs-career-pill">Foundation</span>
                    </div>
                    <h3 className="ifs-career-role text-2xl lg:text-3xl mt-4 mb-2">
                      Education
                    </h3>
                    <div className="ifs-career-edu mt-4 space-y-2">
                      <div className="ifs-edu-institution text-lg font-medium">
                        {(item.data as Education).institution}
                      </div>
                      <div className="ifs-edu-degree text-base opacity-75">
                        {(item.data as Education).degree}
                        {(item.data as Education).field
                          ? ` · ${(item.data as Education).field}`
                          : ""}
                        {(item.data as Education).gpa
                          ? ` · GPA ${(item.data as Education).gpa}`
                          : ""}
                      </div>
                    </div>
                  </article>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
