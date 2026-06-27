const SID_COOKIE = "sid";
const SID_MAX_AGE_SEC = 30 * 60;

export function getOrCreateSessionId(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(new RegExp(`(?:^|; )${SID_COOKIE}=([^;]*)`));
  if (match?.[1]) return decodeURIComponent(match[1]);

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  document.cookie = `${SID_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${SID_MAX_AGE_SEC}; SameSite=Lax`;
  return id;
}
