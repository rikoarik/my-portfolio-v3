"use client";

import { useMemo, useState } from "react";
import type { GitHubContributionDay, GitHubContributionSummary } from "@/types/portfolio";

function levelClass(level: GitHubContributionDay["level"]) {
  switch (level) {
    case 0:
      return "is-level-0";
    case 1:
      return "is-level-1";
    case 2:
      return "is-level-2";
    case 3:
      return "is-level-3";
    default:
      return "is-level-4";
  }
}

export function HeroContribution3D({ summary }: { summary: GitHubContributionSummary | null }) {
  const [hovered, setHovered] = useState<GitHubContributionDay | null>(null);
  const cells = useMemo(
    () => summary?.weeks.flatMap((week, weekIndex) => week.days.map((day, dayIndex) => ({ ...day, weekIndex, dayIndex }))) ?? [],
    [summary],
  );

  if (!summary) {
    return (
      <div className="hero-contrib-wrap" aria-hidden>
        <div className="hero-contrib-empty">GitHub contribution not available</div>
      </div>
    );
  }

  return (
    <div className="hero-contrib-wrap">
      <div className="hero-contrib-head">
        <p className="hero-contrib-title">GitHub Contribution</p>
        <p className="hero-contrib-meta">
          @{summary.username} · {summary.totalContributions} commits · Last 12 months
        </p>
      </div>
      <div className="hero-contrib-stage" role="img" aria-label="3D GitHub contribution heatmap">
        <div className="hero-contrib-grid">
          {cells.map((cell) => (
            <button
              key={cell.date}
              type="button"
              className={`hero-contrib-cell ${levelClass(cell.level)}`}
              onMouseEnter={() => setHovered(cell)}
              onMouseLeave={() => setHovered(null)}
              style={{
                gridColumn: cell.weekIndex + 1,
                gridRow: cell.dayIndex + 1,
                ["--cell-height" as string]: `${8 + cell.level * 7}px`,
                ["--col" as string]: String(cell.weekIndex + 1),
                ["--row" as string]: String(cell.dayIndex + 1),
              }}
              aria-label={`${cell.date}: ${cell.count} contribution`}
            />
          ))}
        </div>
        <div className="hero-contrib-fade" />
      </div>
      <p className="hero-contrib-tooltip">
        {hovered ? `${hovered.date} · ${hovered.count} contribution` : "Hover blocks to inspect daily contribution"}
      </p>
      <div className="hero-contrib-legend" aria-hidden>
        <span>Low</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span key={lvl} className={`hero-contrib-legend-dot is-level-${lvl}`} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}

