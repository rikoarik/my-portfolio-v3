import { cn } from "@/lib/utils";

type Status = "draft" | "published" | "pending" | "approved" | "hidden";

export function StatusBadge({ status }: { status?: Status | string | null }) {
  const value = (status ?? "published") as Status;
  return (
    <span
      className={cn(
        "admin-status-badge",
        value === "published" || value === "approved"
          ? "admin-status-badge--published"
          : value === "hidden"
            ? "admin-status-badge--hidden"
            : "admin-status-badge--draft",
      )}
    >
      {value}
    </span>
  );
}
