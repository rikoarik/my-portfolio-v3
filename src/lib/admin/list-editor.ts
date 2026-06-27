export const MAX_ENTRIES = 100;
export const MAX_ENTRY_LEN = 200;

export type AddResult =
  | { ok: true; entries: string[] }
  | { ok: false; reason: "empty" | "too-long" | "duplicate" | "max-entries" };

export function addEntry(entries: string[], raw: string): AddResult {
  if (entries.length >= MAX_ENTRIES) {
    return { ok: false, reason: "max-entries" };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }
  if (trimmed.length > MAX_ENTRY_LEN) {
    return { ok: false, reason: "too-long" };
  }
  if (entries.includes(trimmed)) {
    return { ok: false, reason: "duplicate" };
  }

  return { ok: true, entries: [...entries, trimmed] };
}

export function removeEntry(entries: string[], index: number): string[] {
  if (index < 0 || index >= entries.length) return entries;
  return entries.filter((_, i) => i !== index);
}

export function moveEntry(
  entries: string[],
  index: number,
  dir: "up" | "down",
): string[] {
  if (index < 0 || index >= entries.length) return entries;
  const target = dir === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= entries.length) return entries;
  const next = [...entries];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function serializeEntries(entries: string[]): string {
  const cleaned = entries.map((entry) => entry.trim()).filter(Boolean);
  return JSON.stringify(cleaned);
}
