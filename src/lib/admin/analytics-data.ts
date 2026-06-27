import { categorizeReferrer, organicSharePercent, type ReferrerCategory } from "@/lib/analytics/referrer";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export type AnalyticsSnapshot = {
  totalViews30d: number;
  totalViews7d: number;
  totalViewsToday: number;
  uniqueVisitors7d: number;
  uniqueVisitors30d: number;
  organicShare7d: number;
  dailySeries: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; share: number }[];
  topReferrers: { referrer: string; views: number }[];
  organicKeywords: { path: string; landingViews: number }[];
  seoBreakdown: Record<ReferrerCategory, number>;
};

type PageViewRow = {
  path: string;
  referrer: string | null;
  session_id: string;
  created_at: string;
};

const EMPTY_SNAPSHOT: AnalyticsSnapshot = {
  totalViews30d: 0,
  totalViews7d: 0,
  totalViewsToday: 0,
  uniqueVisitors7d: 0,
  uniqueVisitors30d: 0,
  organicShare7d: 0,
  dailySeries: [],
  topPages: [],
  topReferrers: [],
  organicKeywords: [],
  seoBreakdown: { organic: 0, direct: 0, social: 0, referral: 0 },
};

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return startOfDayUtc(d);
}

export function buildAnalyticsSnapshot(rows: PageViewRow[], now = new Date()): AnalyticsSnapshot {
  const todayStart = startOfDayUtc(now);
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);

  const inRange = (r: PageViewRow, from: Date) => new Date(r.created_at) >= from;

  const rows30 = rows.filter((r) => inRange(r, d30));
  const rows7 = rows.filter((r) => inRange(r, d7));
  const rowsToday = rows.filter((r) => new Date(r.created_at) >= todayStart);

  const uniqueSessions = (subset: PageViewRow[]) => new Set(subset.map((r) => r.session_id)).size;

  const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = daysAgo(i);
    dailyMap.set(isoDate(day), { views: 0, sessions: new Set() });
  }
  for (const row of rows30) {
    const key = isoDate(new Date(row.created_at));
    const bucket = dailyMap.get(key);
    if (!bucket) continue;
    bucket.views += 1;
    bucket.sessions.add(row.session_id);
  }
  const dailySeries = [...dailyMap.entries()].map(([date, { views, sessions }]) => ({
    date,
    views,
    visitors: sessions.size,
  }));

  if (rows30.length === 0) {
    return { ...EMPTY_SNAPSHOT, dailySeries };
  }

  const pageCounts = new Map<string, number>();
  for (const row of rows30) {
    pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + 1);
  }
  const total30 = rows30.length || 1;
  const topPages = [...pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views, share: Math.round((views / total30) * 100) }));

  const referrerCounts = new Map<string, number>();
  for (const row of rows30) {
    const ref = row.referrer?.trim() || "(direct)";
    referrerCounts.set(ref, (referrerCounts.get(ref) ?? 0) + 1);
  }
  const topReferrers = [...referrerCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referrer, views]) => ({ referrer, views }));

  const organicLanding = new Map<string, number>();
  for (const row of rows30) {
    if (categorizeReferrer(row.referrer) !== "organic") continue;
    organicLanding.set(row.path, (organicLanding.get(row.path) ?? 0) + 1);
  }
  const organicKeywords = [...organicLanding.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, landingViews]) => ({ path, landingViews }));

  const seoBreakdown: Record<ReferrerCategory, number> = {
    organic: 0,
    direct: 0,
    social: 0,
    referral: 0,
  };
  for (const row of rows7) {
    seoBreakdown[categorizeReferrer(row.referrer)] += 1;
  }

  return {
    totalViews30d: rows30.length,
    totalViews7d: rows7.length,
    totalViewsToday: rowsToday.length,
    uniqueVisitors7d: uniqueSessions(rows7),
    uniqueVisitors30d: uniqueSessions(rows30),
    organicShare7d: organicSharePercent(rows7),
    dailySeries,
    topPages,
    topReferrers,
    organicKeywords,
    seoBreakdown,
  };
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ...EMPTY_SNAPSHOT };

  const since = daysAgo(30).toISOString();
  const { data, error } = await supabase
    .from("page_views")
    .select("path, referrer, session_id, created_at")
    .gte("created_at", since)
    .eq("is_bot", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[analytics] fetch failed", error.message);
    return { ...EMPTY_SNAPSHOT };
  }

  return buildAnalyticsSnapshot((data ?? []) as PageViewRow[]);
}
