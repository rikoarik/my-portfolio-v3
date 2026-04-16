"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive grid background that reveals itself around the cursor.
 * Uses global CSS variables set by MouseSpotlight.
 */
export function InteractiveGridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "interactive-grid-container pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Base very faint grid (ubiquitous) */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* Reactive "Glow" Grid */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--primary) 25%, transparent) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, color-mix(in srgb, var(--primary) 25%, transparent) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "60px 60px",
          maskImage: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
        }}
      />
      
      {/* Edge smoothing - fades out at section boundaries */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,var(--background)_100%)] opacity-40" />
    </div>
  );
}
