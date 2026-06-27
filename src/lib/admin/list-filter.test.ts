import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { filterItems, type StatusFilter } from "./list-filter";
import { PROPERTY_TEST_RUNS } from "./test-config";

type Item = { id: string; title: string; status?: string | null };

const statusArb = fc.constantFrom<StatusFilter>("all", "draft", "published");
const itemArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 0, maxLength: 100 }),
  status: fc.option(fc.constantFrom("draft", "published"), { nil: null }),
}) as fc.Arbitrary<Item>;

// Feature: cms-management-usability, Property 3: In-list filter is the conjunction of title match and status, with empty/all as identity
describe("list-filter filterItems", () => {
  it("filters by title and status conjunction", () => {
    fc.assert(
      fc.property(fc.string(), statusArb, fc.array(itemArb), (query, status, items) => {
        const result = filterItems(items, query, status);
        const trimmed = query.trim();
        const lower = trimmed.toLowerCase();

        if (!trimmed && status === "all") {
          expect(result).toEqual(items);
          return;
        }

        for (const item of result) {
          if (trimmed) {
            expect(item.title.toLowerCase()).toContain(lower);
          }
          if (status !== "all") {
            expect(item.status).toBe(status);
          }
        }

        const expected = items.filter((item) => {
          const matchesQuery =
            !trimmed || item.title.toLowerCase().includes(lower);
          const matchesStatus = status === "all" || item.status === status;
          return matchesQuery && matchesStatus;
        });
        expect(result).toEqual(expected);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
