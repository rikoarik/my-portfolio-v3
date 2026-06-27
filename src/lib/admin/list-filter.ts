export type StatusFilter = "all" | "draft" | "published";

export type Filterable = { title: string; status?: string | null };

export function filterItems<T extends Filterable>(
  items: T[],
  query: string,
  status: StatusFilter,
): T[] {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  return items.filter((item) => {
    const matchesQuery =
      !trimmed || item.title.toLowerCase().includes(lower);
    const matchesStatus =
      status === "all" || item.status === status;
    return matchesQuery && matchesStatus;
  });
}
