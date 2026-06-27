"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";

import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={250} skipDelayDuration={100}>
      <Suspense fallback={null}>
        <AnalyticsBeacon />
      </Suspense>
      {children}
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          className:
            "font-[family-name:var(--font-syne)] border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]",
        }}
      />
    </TooltipProvider>
  );
}
