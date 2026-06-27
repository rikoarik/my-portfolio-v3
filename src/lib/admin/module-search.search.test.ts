import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { searchModules, type ModuleEntry } from "./module-search";
import { PROPERTY_TEST_RUNS } from "./test-config";

const moduleArb = fc.record({
  href: fc.webPath(),
  label: fc.string({ minLength: 1, maxLength: 50 }),
}) as fc.Arbitrary<ModuleEntry>;

// Feature: cms-management-usability, Property 2: Module search returns exactly the case-insensitive substring matches
describe("module-search searchModules", () => {
  it("returns case-insensitive substring matches", () => {
    fc.assert(
      fc.property(fc.string(), fc.array(moduleArb), (query, modules) => {
        const result = searchModules(query, modules);
        const trimmed = query.trim();
        if (!trimmed) {
          expect(result).toEqual([]);
          return;
        }
        const lower = trimmed.toLowerCase();
        const expected = modules.filter((m) =>
          m.label.toLowerCase().includes(lower),
        );
        expect(result).toEqual(expected);
      }),
      { numRuns: PROPERTY_TEST_RUNS },
    );
  });
});
