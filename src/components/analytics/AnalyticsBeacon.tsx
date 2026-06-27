"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getOrCreateSessionId } from "@/lib/analytics/session";
import { isBotUserAgent } from "@/lib/analytics/ua";

function parseUtm(search: string) {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  };
}

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (isBotUserAgent(navigator.userAgent)) return;

    const search = searchParams.toString();
    const key = `${pathname}?${search}`;
    if (lastSent.current === key) return;
    lastSent.current = key;

    const utm = parseUtm(search ? `?${search}` : "");
    const payload = JSON.stringify({
      path: pathname,
      query: search || undefined,
      referrer: document.referrer || undefined,
      sessionId: getOrCreateSessionId(),
      ts: Date.now(),
      ...utm,
    });

    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/track", blob)) return;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname, searchParams]);

  return null;
}
