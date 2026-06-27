import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { toggleStatus, type PubStatus } from "./status";
import { PROPERTY_TEST_RUNS } from "./test-config";

const statusArb = fc.constantFrom<PubStatus>("draft", "published");

// Feature: cms-management-usability, Property 4: Status toggle inverts and is its own inverse
describe("status toggleStatus", () => {
  it("inverts and is self-inverse", () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        const toggled = toggleStatus(status);
        expect(toggled).not.toBe(status);
        expect(toggleStatus(toggled)).toBe(status);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
