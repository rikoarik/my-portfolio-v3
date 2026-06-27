import { describe, expect, it } from "vitest";

import { serializeCaseStudyJson } from "./case-study";

describe("serializeCaseStudyJson", () => {
  it("returns empty string when all fields blank", () => {
    expect(
      serializeCaseStudyJson({ problem: "", solution: "", constraints: [], results: [] }),
    ).toBe("");
  });

  it("serializes trimmed case study", () => {
    const json = serializeCaseStudyJson({
      problem: " Slow site ",
      solution: "Optimized assets",
      constraints: [" budget "],
      results: ["2x faster"],
    });
    expect(JSON.parse(json)).toEqual({
      problem: "Slow site",
      solution: "Optimized assets",
      constraints: ["budget"],
      results: ["2x faster"],
    });
  });
});
