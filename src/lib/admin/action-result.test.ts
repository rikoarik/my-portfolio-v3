import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { formDataToValues, validationResult } from "./action-result";
import { PROPERTY_TEST_RUNS } from "./test-config";

// Feature: cms-management-usability, Property 15: Validation failure preserves submitted values exactly
describe("action-result validation preservation", () => {
  it("echoes submitted values exactly", () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string({ minLength: 1, maxLength: 20 }), fc.string()),
        fc.dictionary(fc.string({ minLength: 1, maxLength: 20 }), fc.array(fc.string())),
        (values, fieldErrors) => {
          const formData = new FormData();
          for (const [key, value] of Object.entries(values)) {
            formData.set(key, value);
          }
          const result = validationResult(fieldErrors, formData);
          expect(result.ok).toBe(false);
          if (!result.ok && result.kind === "validation") {
            for (const [key, value] of Object.entries(values)) {
              expect(result.values[key]).toBe(value);
            }
            expect(result.values).toEqual(formDataToValues(formData));
          }
        },
      ),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
