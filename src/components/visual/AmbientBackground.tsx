"use client";

/**
 * Fixed decorative layer — blobs + vignette. Respects reduced motion via CSS.
 */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--ambient-a),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_50%,var(--ambient-b),transparent_50%)]" />
      <div
        className="animate-blob-a absolute -left-[20%] top-[15%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-[radial-gradient(circle,var(--ambient-a),transparent_68%)] blur-3xl"
      />
      <div
        className="animate-blob-b absolute -right-[15%] bottom-[10%] h-[min(85vw,480px)] w-[min(85vw,480px)] rounded-full bg-[radial-gradient(circle,var(--ambient-b),transparent_65%)] blur-3xl"
      />
      <div className="bg-grid-fine absolute inset-0 opacity-[0.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_75%)]" />
    </div>
  );
}
