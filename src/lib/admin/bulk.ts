import type { PubStatus } from "./status";

export type BulkOutcome = { succeeded: string[]; failed: string[] };

export type BulkRequest = {
  module: string;
  ids: string[];
  op: "delete" | "publish" | "unpublish";
};

export type BulkResponse = BulkOutcome;

export type BulkStatusRecord = { id: string; status: PubStatus };

export function toggleSelection(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function applyBulkStatus(
  records: BulkStatusRecord[],
  selectedIds: string[],
  op: "publish" | "unpublish",
): BulkStatusRecord[] {
  const target: PubStatus = op === "publish" ? "published" : "draft";
  const selected = new Set(selectedIds);
  return records.map((record) =>
    selected.has(record.id) ? { ...record, status: target } : record,
  );
}

export function summarizeBulk(outcome: BulkOutcome): {
  succeeded: number;
  failed: number;
} {
  return {
    succeeded: outcome.succeeded.length,
    failed: outcome.failed.length,
  };
}

export function partitionBulkOutcome(
  requestedIds: string[],
  succeeded: string[],
  failed: string[],
): boolean {
  const succeededSet = new Set(succeeded);
  const failedSet = new Set(failed);
  const union = new Set([...succeeded, ...failed]);
  if (union.size !== requestedIds.length) return false;
  for (const id of requestedIds) {
    if (!union.has(id)) return false;
    if (succeededSet.has(id) && failedSet.has(id)) return false;
  }
  return true;
}
