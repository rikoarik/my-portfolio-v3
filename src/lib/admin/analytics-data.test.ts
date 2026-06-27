import { describe, expect, it } from "vitest";

import { buildAnalyticsSnapshot } from "@/lib/admin/analytics-data";

const NOW = new Date("2026-06-27T15:00:00.000Z");

function row(
  path: string,
  referrer: string | null,
  sessionId: string,
  createdAt: string,
) {
  return { path, referrer, session_id: sessionId, created_at: createdAt };
}

describe("buildAnalyticsSnapshot", () => {
  it("returns empty snapshot for no rows", () => {
    const snap = buildAnalyticsSnapshot([], NOW);
    expect(snap.totalViews30d).toBe(0);
    expect(snap.topPages).toEqual([]);
    expect(snap.dailySeries).toHaveLength(30);
  });

  it("aggregates views, visitors, and referrers", () => {
    const rows = [
      row("/", null, "s1", "2026-06-27T10:00:00.000Z"),
      row("/", "https://google.com/search?q=test", "s2", "2026-06-27T11:00:00.000Z"),
      row("/projects", "https://twitter.com/x", "s1", "2026-06-26T09:00:00.000Z"),
      row("/about", "https://example.com", "s3", "2026-06-20T08:00:00.000Z"),
    ];

    const snap = buildAnalyticsSnapshot(rows, NOW);
    expect(snap.totalViews30d).toBe(4);
    expect(snap.totalViewsToday).toBe(2);
    expect(snap.uniqueVisitors7d).toBe(3);
    expect(snap.organicShare7d).toBe(25);
    expect(snap.topPages[0]).toEqual({ path: "/", views: 2, share: 50 });
    expect(snap.topReferrers.some((r) => r.referrer === "(direct)")).toBe(true);
    expect(snap.seoBreakdown.organic).toBe(1);
    expect(snap.seoBreakdown.direct).toBe(1);
    expect(snap.seoBreakdown.social).toBe(1);
    expect(snap.organicKeywords[0]).toEqual({ path: "/", landingViews: 1 });
  });

  it("excludes rows older than 30 days", () => {
    const rows = [
      row("/", null, "s1", "2026-05-01T10:00:00.000Z"),
      row("/", null, "s2", "2026-06-27T10:00:00.000Z"),
    ];
    const snap = buildAnalyticsSnapshot(rows, NOW);
    expect(snap.totalViews30d).toBe(1);
  });
});
