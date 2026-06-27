export type PubStatus = "draft" | "published";

export function toggleStatus(current: PubStatus): PubStatus {
  return current === "published" ? "draft" : "published";
}
