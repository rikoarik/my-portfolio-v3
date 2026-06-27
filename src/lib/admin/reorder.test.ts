import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { canMove, move } from "./reorder";
import { PROPERTY_TEST_RUNS } from "./test-config";

type Item = { id: string };

const itemArb = fc.record({ id: fc.uuid() }) as fc.Arbitrary<Item>;

// Feature: cms-management-usability, Property 8: Reorder moves one step and preserves the rest
describe("reorder move", () => {
  it("moves one step preserving multiset", () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 2, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        fc.constantFrom<"up" | "down">("up", "down"),
        (items, rawIndex, dir) => {
          const index = rawIndex % items.length;
          const id = items[index].id;
          const result = move(items, id, dir);

          const inputIds = items.map((i) => i.id).sort();
          const resultIds = result.map((i) => i.id).sort();
          expect(resultIds).toEqual(inputIds);

          if (!canMove(index, items.length, dir)) {
            expect(result).toEqual(items);
            return;
          }

          const targetIndex = dir === "up" ? index - 1 : index + 1;
          expect(result[targetIndex].id).toBe(id);
          expect(result[index].id).toBe(items[targetIndex].id);
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});

// Feature: cms-management-usability, Property 9: Reorder boundaries are correctly detected
describe("reorder canMove", () => {
  it("detects boundaries", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 50 }), (length) => {
        if (length === 0) return;
        expect(canMove(0, length, "up")).toBe(false);
        expect(canMove(length - 1, length, "down")).toBe(false);
        for (let i = 1; i < length; i++) {
          expect(canMove(i, length, "up")).toBe(true);
        }
        for (let i = 0; i < length - 1; i++) {
          expect(canMove(i, length, "down")).toBe(true);
        }
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
