export type Orderable = { id: string };

export function canMove(
  index: number,
  length: number,
  dir: "up" | "down",
): boolean {
  if (length <= 0 || index < 0 || index >= length) return false;
  if (dir === "up") return index > 0;
  return index < length - 1;
}

export function move<T extends Orderable>(
  items: T[],
  id: string,
  dir: "up" | "down",
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1 || !canMove(index, items.length, dir)) {
    return items;
  }

  const targetIndex = dir === "up" ? index - 1 : index + 1;
  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}
