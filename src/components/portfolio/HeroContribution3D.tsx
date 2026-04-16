"use client";

import { useMemo, useState, useRef } from "react";
import type { GitHubContributionDay, GitHubContributionSummary } from "@/types/portfolio";

function getLevelColors(level: number) {
  switch (level) {
    case 1:
      return { top: "color-mix(in srgb, var(--primary) 30%, transparent)", left: "color-mix(in srgb, var(--primary) 20%, transparent)", right: "color-mix(in srgb, var(--primary) 10%, transparent)", front: "color-mix(in srgb, var(--primary) 22%, transparent)", side: "color-mix(in srgb, var(--primary) 14%, transparent)" };
    case 2:
      return { top: "color-mix(in srgb, var(--primary) 55%, transparent)", left: "color-mix(in srgb, var(--primary) 45%, transparent)", right: "color-mix(in srgb, var(--primary) 35%, transparent)", front: "color-mix(in srgb, var(--primary) 40%, transparent)", side: "color-mix(in srgb, var(--primary) 30%, transparent)" };
    case 3:
      return { top: "color-mix(in srgb, var(--primary) 80%, transparent)", left: "color-mix(in srgb, var(--primary) 70%, transparent)", right: "color-mix(in srgb, var(--primary) 60%, transparent)", front: "color-mix(in srgb, var(--primary) 60%, transparent)", side: "color-mix(in srgb, var(--primary) 48%, transparent)" };
    case 4:
      return { top: "var(--primary)", left: "color-mix(in srgb, var(--primary) 85%, black)", right: "color-mix(in srgb, var(--primary) 70%, black)", front: "color-mix(in srgb, var(--primary) 80%, black)", side: "color-mix(in srgb, var(--primary) 62%, black)" };
    default:
      return { top: "color-mix(in srgb, var(--muted) 40%, transparent)", left: "transparent", right: "transparent", front: "transparent", side: "transparent" };
  }
}

function getLevelHeight(level: number) {
  if (level === 0) return 2; // Make empty cells tiny blocks so they stick firmly to the plate
  return 8 + level * 10; // L1:18, L2:28, L3:38, L4:48 (Taller blocks for emphasis)
}

/* ── Sizes ─────────────────────────────────────────────── */
const CELL = 14;      // px – each cell square
const GAP = 2;        // px – gap between cells
const STEP = CELL + GAP; // 16px per step

/* ── Component ─────────────────────────────────────────── */

export function HeroContribution3D({ summary }: { summary: GitHubContributionSummary | null }) {
  const [hovered, setHovered] = useState<GitHubContributionDay | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(
    () =>
      summary?.weeks.flatMap((week, wi) =>
        week.days.map((day, di) => ({ ...day, weekIndex: wi, dayIndex: di }))
      ) ?? [],
    [summary]
  );

  /* No GSAP intro: user wants it to be instantly 3D on load */

  /* ── Fallback ──────────────────────────────────────── */
  if (!summary) {
    return (
      <div
        className="flex h-full w-full items-center justify-center font-mono-meta text-xs opacity-40"
        style={{ color: "var(--muted-foreground)" }}
        aria-hidden
      >
        [GitHub data unavailable]
      </div>
    );
  }

  const cols = summary.weeks.length; // ~52
  const rows = 7;
  const boardW = cols * STEP;
  const boardH = rows * STEP;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex w-full items-end justify-between px-2">
        <div>
          <p
            className="font-mono-meta uppercase"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "var(--muted-foreground)",
            }}
          >
            GitHub Contributions
          </p>
          <p
            className="mt-1 font-bold"
            style={{ fontSize: "1.25rem", color: "var(--foreground)" }}
          >
            {summary.totalContributions.toLocaleString()}{" "}
            <span
              style={{
                fontWeight: 400,
                fontSize: "0.8rem",
                color: "color-mix(in srgb, var(--primary) 70%, transparent)",
              }}
            >
              / @{summary.username}
            </span>
          </p>
        </div>

        {/* Tooltip on hover */}
        <p
          className="font-mono-meta transition-opacity duration-200"
          style={{
            fontSize: "0.7rem",
            color: hovered ? "var(--primary)" : "var(--muted-foreground)",
            opacity: hovered ? 1 : 0.5,
          }}
        >
          {hovered
            ? `${hovered.date} · ${hovered.count} commit${hovered.count !== 1 ? "s" : ""}`
            : "Hover to inspect timeline"}
        </p>
      </div>

      {/* ── 3D Stage ────────────────────────────────────── */}
      <div
        className="relative w-full overflow-visible py-16"
        style={{ perspective: "2200px", perspectiveOrigin: "50% 35%" }}
      >
        <div
          ref={gridRef}
          className="mx-auto"
          style={{
            width: boardW,
            height: boardH,
            transformStyle: "preserve-3d",
            // Increased scale massively, added translateX to move it left
            transform: "translateX(-15%) rotateX(60deg) rotateZ(45deg) scale(1.55)",
          }}
        >
          {/* Base plate tightly coupled to Z=0 to prevent floating */}
          <div
            className="absolute rounded-sm"
            style={{
              inset: -14,
              backgroundColor: "color-mix(in srgb, var(--background) 75%, transparent)",
              border: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
              transform: "translateZ(0px)", // Perfectly flush with the floor of the cells
              boxShadow: "0 60px 100px -20px rgba(0,0,0,0.9)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)"
            }}
          />

          {/* Grid cells */}
          {cells.map((cell) => {
            const colors = getLevelColors(cell.level);
            const h = getLevelHeight(cell.level);
            const isHovered = hovered === cell;

            // Apply manual glow by lightning colors directly to avoid `filter` flattening 3D context
            const topColor = isHovered ? "var(--primary)" : colors.top;
            const frontColor = isHovered ? "color-mix(in srgb, var(--primary) 80%, white)" : colors.front;
            const sideColor = isHovered ? "color-mix(in srgb, var(--primary) 70%, white)" : colors.side;

            return (
              <div
                key={cell.date}
                className={cell.level > 0 ? "gh-bar" : ""}
                onMouseEnter={() => setHovered(cell)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  width: CELL,
                  height: CELL,
                  left: cell.weekIndex * STEP,
                  top: cell.dayIndex * STEP,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  transition: "transform 0.15s ease-out",
                  // Elevate whole bar slightly when hovered
                  transform: isHovered ? `translateZ(6px)` : "translateZ(0)",
                  zIndex: isHovered ? 50 : 1,
                }}
              >
                {/* Top face */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: topColor,
                    transform: `translateZ(${h}px)`,
                    border: cell.level > 0
                      ? "0.5px solid color-mix(in srgb, var(--background) 50%, transparent)"
                      : "0.5px solid color-mix(in srgb, var(--border) 40%, transparent)",
                    transition: "background-color 0.2s, transform 0.1s linear",
                  }}
                />

                {/* Always render side walls, even for level 0, so they connect fully to the pedestal */}
                {/* Front face (bottom edge folds down) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: CELL,
                    height: h,
                    backgroundColor: frontColor,
                    transformOrigin: "bottom",
                    transform: "rotateX(-90deg)",
                    transition: "background-color 0.2s",
                  }}
                />
                {/* Right face (right edge folds right) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: h,
                    height: CELL,
                    backgroundColor: sideColor,
                    transformOrigin: "right",
                    transform: "rotateY(90deg)",
                    transition: "background-color 0.2s",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 font-mono-meta pt-2"
        style={{ fontSize: "0.55rem", color: "var(--muted-foreground)" }}
        aria-hidden
      >
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: getLevelColors(lvl).top,
              border: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
