export const MAX_JSON_LEN = 100_000;

export type JsonCheck =
  | { ok: true }
  | { ok: false; reason: "malformed" | "too-long" };

export function checkJsonField(raw: string): JsonCheck {
  if (!raw) return { ok: true };
  if (raw.length > MAX_JSON_LEN) {
    return { ok: false, reason: "too-long" };
  }
  try {
    JSON.parse(raw);
    return { ok: true };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
