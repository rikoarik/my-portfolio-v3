import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  applyBulkStatus,
  partitionBulkOutcome,
  summarizeBulk,
  toggleSelection,
  type BulkStatusRecord,
} from "./bulk";
import { PROPERTY_TEST_RUNS } from "./test-config";

const idArb = fc.uuid();

// Feature: cms-management-usability, Property 5: Bulk selection toggle is a reversible membership flip
describe("bulk toggleSelection", () => {
  it("flips membership reversibly", () => {
    fc.assert(
      fc.property(fc.array(idArb), idArb, (ids, targetId) => {
        const initial = new Set(ids);
        const once = toggleSelection(initial, targetId);
        const twice = toggleSelection(once, targetId);
        expect(twice).toEqual(initial);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});

// Feature: cms-management-usability, Property 6: Bulk status application targets exactly the selected records
describe("bulk applyBulkStatus", () => {
  it("updates only selected records", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: idArb,
            status: fc.constantFrom<"draft" | "published">("draft", "published"),
          }),
          { minLength: 1, maxLength: 20 },
        ),
        fc.array(idArb, { minLength: 1, maxLength: 10 }),
        fc.constantFrom<"publish" | "unpublish">("publish", "unpublish"),
        (records, selectedIds, op) => {
          const selected = new Set(selectedIds);
          const target = op === "publish" ? "published" : "draft";
          const result = applyBulkStatus(records as BulkStatusRecord[], selectedIds, op);

          result.forEach((record, i) => {
            if (selected.has(record.id)) {
              expect(record.status).toBe(target);
            } else {
              expect(record.status).toBe(records[i].status);
            }
          });
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});

// Feature: cms-management-usability, Property 7: Bulk outcome partitions the requested ids
describe("bulk partition", () => {
  it("partitions requested ids", () => {
    fc.assert(
      fc.property(fc.array(idArb, { minLength: 1, maxLength: 20 }), (ids) => {
        const unique = [...new Set(ids)];
        const mid = Math.floor(unique.length / 2);
        const succeeded = unique.slice(0, mid);
        const failed = unique.slice(mid);
        expect(partitionBulkOutcome(unique, succeeded, failed)).toBe(true);
        const summary = summarizeBulk({ succeeded, failed });
        expect(summary.succeeded + summary.failed).toBe(unique.length);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
