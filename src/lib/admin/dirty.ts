export type FieldMap = Record<string, string>;

export function isDirty(baseline: FieldMap, current: FieldMap): boolean {
  const keys = new Set([...Object.keys(baseline), ...Object.keys(current)]);
  for (const key of keys) {
    if ((baseline[key] ?? "") !== (current[key] ?? "")) {
      return true;
    }
  }
  return false;
}
