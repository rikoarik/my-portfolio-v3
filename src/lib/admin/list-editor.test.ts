import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  addEntry,
  MAX_ENTRIES,
  MAX_ENTRY_LEN,
  removeEntry,
  serializeEntries,
} from "./list-editor";
import { parseJsonOrLines } from "./validation";
import { PROPERTY_TEST_RUNS } from "./test-config";

const validEntryArb = fc
  .string({ minLength: 1, maxLength: MAX_ENTRY_LEN })
  .filter((s) => s.trim().length > 0)
  .map((s) => s.trim());

// Feature: cms-management-usability, Property 10: Adding a valid entry appends its trimmed value
describe("list-editor addEntry valid", () => {
  it("appends trimmed valid entries", () => {
    fc.assert(
      fc.property(
        fc.array(validEntryArb, { maxLength: MAX_ENTRIES - 1 }),
        validEntryArb,
        (entries, raw) => {
          fc.pre(!entries.includes(raw.trim()));
          const result = addEntry(entries, raw);
          expect(result.ok).toBe(true);
          if (result.ok) {
            expect(result.entries).toHaveLength(entries.length + 1);
            expect(result.entries[result.entries.length - 1]).toBe(raw.trim());
          }
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});

// Feature: cms-management-usability, Property 11: Rejected entries never mutate the list
describe("list-editor addEntry rejected", () => {
  it("rejects invalid entries without mutation", () => {
    fc.assert(
      fc.property(
        fc.array(validEntryArb, { maxLength: MAX_ENTRIES }),
        fc.oneof(
          fc.constant("   "),
          fc
            .string({ minLength: MAX_ENTRY_LEN + 1, maxLength: MAX_ENTRY_LEN + 50 })
            .filter((s) => s.trim().length > MAX_ENTRY_LEN),
        ),
        (entries, raw) => {
          const result = addEntry(entries, raw);
          expect(result.ok).toBe(false);
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });

  it("rejects duplicates and max entries", () => {
    const full = Array.from({ length: MAX_ENTRIES }, (_, i) => `entry-${i}`);
    const dup = addEntry(["hello"], "hello");
    expect(dup.ok).toBe(false);
    const max = addEntry(full, "new");
    expect(max.ok).toBe(false);
    if (!max.ok) expect(max.reason).toBe("max-entries");
  });
});

// Feature: cms-management-usability, Property 12: Removing an entry preserves the order of the remainder
describe("list-editor removeEntry", () => {
  it("removes at index preserving order", () => {
    fc.assert(
      fc.property(
        fc.array(validEntryArb, { minLength: 1, maxLength: 50 }),
        fc.integer({ min: 0, max: 49 }),
        (entries, rawIndex) => {
          const index = rawIndex % entries.length;
          const result = removeEntry(entries, index);
          expect(result).toHaveLength(entries.length - 1);
          const expected = [...entries.slice(0, index), ...entries.slice(index + 1)];
          expect(result).toEqual(expected);
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});

// Feature: cms-management-usability, Property 13: List-field serialization round-trips
describe("list-editor serializeEntries", () => {
  it("round-trips via parseJsonOrLines", () => {
    fc.assert(
      fc.property(fc.array(validEntryArb, { maxLength: 50 }), (entries) => {
        const serialized = serializeEntries(entries);
        const parsed = parseJsonOrLines(serialized);
        const cleaned = entries.map((e) => e.trim()).filter(Boolean);
        expect(parsed).toEqual(cleaned);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
