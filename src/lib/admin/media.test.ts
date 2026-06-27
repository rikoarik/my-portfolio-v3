import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { isImageMime } from "./media";
import { PROPERTY_TEST_RUNS } from "./test-config";

// Feature: cms-management-usability, Property 17: Image MIME classification
describe("media isImageMime", () => {
  it("returns true iff mime starts with image/", () => {
    fc.assert(
      fc.property(fc.option(fc.string(), { nil: undefined }), (mime) => {
        const result = isImageMime(mime ?? null);
        if (typeof mime === "string" && mime.startsWith("image/")) {
          expect(result).toBe(true);
        } else {
          expect(result).toBe(false);
        }
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
