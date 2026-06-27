import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { checkJsonField, MAX_JSON_LEN } from "./json-field";
import { PROPERTY_TEST_RUNS } from "./test-config";

// Feature: cms-management-usability, Property 14: JSON field validation classifies content correctly
describe("json-field checkJsonField", () => {
  it("classifies JSON content", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const result = checkJsonField(raw);
        if (!raw) {
          expect(result.ok).toBe(true);
          return;
        }
        if (raw.length > MAX_JSON_LEN) {
          expect(result.ok).toBe(false);
          if (!result.ok) expect(result.reason).toBe("too-long");
          return;
        }
        try {
          JSON.parse(raw);
          expect(result.ok).toBe(true);
        } catch {
          expect(result.ok).toBe(false);
          if (!result.ok) expect(result.reason).toBe("malformed");
        }
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
