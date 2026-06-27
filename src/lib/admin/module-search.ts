import type { AdminNavGroup } from "./nav-config";

export type ModuleEntry = { href: string; label: string };

export function flattenModules(groups: AdminNavGroup[]): ModuleEntry[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({ href: item.href, label: item.label })),
  );
}

export function clampQuery(input: string, max: number): string {
  return input.slice(0, max);
}

export function searchModules(query: string, modules: ModuleEntry[]): ModuleEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();
  return modules.filter((module) => module.label.toLowerCase().includes(lower));
}
