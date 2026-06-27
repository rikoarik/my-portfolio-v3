export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  return /bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(ua);
}

export function parseDevice(ua: string | null | undefined): string {
  if (!ua) return "desktop";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Other";
}
