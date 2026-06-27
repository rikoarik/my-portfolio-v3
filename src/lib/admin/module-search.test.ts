import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { clampQuery } from "./module-search";
import { PROPERTY_TEST_RUNS } from "./test-config";

// Feature: cms-management-usability, Property 1: Module query is clamped to a 100-character prefix
describe("module-search clampQuery", () => {
  it("clamps to max length prefix", () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 0, max: 200 }), (input, max) => {
        const result = clampQuery(input, max);
        expect(result.length).toBeLessThanOrEqual(max);
        if (input.length > max) {
          expect(result).toBe(input.slice(0, max));
        } else {
          expect(result).toBe(input);
        }
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
