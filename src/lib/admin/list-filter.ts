export type StatusFilter = "all" | "draft" | "published";

export type Filterable = {
  title: string;
  status?: string | null;
  searchText?: string;
};

export function filterItems<T extends Filterable>(
  items: T[],
  query: string,
  status: StatusFilter,
): T[] {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  return items.filter((item) => {
    const haystack = (item.searchText ?? item.title).toLowerCase();
    const matchesQuery = !trimmed || haystack.includes(lower);
    const matchesStatus =
      status === "all" || item.status === status;
    return matchesQuery && matchesStatus;
  });
}
