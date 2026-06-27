export type ReferrerCategory = "organic" | "direct" | "social" | "referral";

const ORGANIC_HOSTS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "yahoo.",
  "yandex.",
  "baidu.com",
  "ecosia.org",
];

const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "t.co",
  "linkedin.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
  "pinterest.com",
  "threads.net",
];

export function categorizeReferrer(referrer: string | null | undefined): ReferrerCategory {
  const raw = (referrer ?? "").trim();
  if (!raw) return "direct";

  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (ORGANIC_HOSTS.some((needle) => host.includes(needle))) return "organic";
    if (SOCIAL_HOSTS.some((needle) => host.includes(needle))) return "social";
    return "referral";
  } catch {
    return "referral";
  }
}

export function organicSharePercent(
  rows: { referrer: string | null }[],
): number {
  if (rows.length === 0) return 0;
  const organic = rows.filter((r) => categorizeReferrer(r.referrer) === "organic").length;
  return Math.round((organic / rows.length) * 100);
}
