import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { isDirty } from "./dirty";
import { PROPERTY_TEST_RUNS } from "./test-config";

const fieldMapArb = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 10 }),
  fc.string({ maxLength: 50 }),
);

// Feature: cms-management-usability, Property 16: Dirty detection reflects any divergence from the baseline
describe("dirty isDirty", () => {
  it("detects divergence from baseline", () => {
    fc.assert(
      fc.property(fieldMapArb, fieldMapArb, (baseline, current) => {
        const dirty = isDirty(baseline, current);
        const same = JSON.stringify(baseline) === JSON.stringify(current);
        if (same) {
          expect(dirty).toBe(false);
        } else {
          const keys = new Set([
            ...Object.keys(baseline),
            ...Object.keys(current),
          ]);
          let differs = false;
          for (const key of keys) {
            if ((baseline[key] ?? "") !== (current[key] ?? "")) {
              differs = true;
              break;
            }
          }
          expect(dirty).toBe(differs);
        }
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
