import { describe, expect, it } from "vitest";

import { categorizeReferrer, organicSharePercent } from "@/lib/analytics/referrer";

describe("categorizeReferrer", () => {
  it("marks empty referrer as direct", () => {
    expect(categorizeReferrer(null)).toBe("direct");
    expect(categorizeReferrer("")).toBe("direct");
  });

  it("detects organic search hosts", () => {
    expect(categorizeReferrer("https://www.google.com/search?q=foo")).toBe("organic");
    expect(categorizeReferrer("https://duckduckgo.com/?q=bar")).toBe("organic");
  });

  it("detects social hosts", () => {
    expect(categorizeReferrer("https://twitter.com/user/status/1")).toBe("social");
    expect(categorizeReferrer("https://linkedin.com/in/me")).toBe("social");
  });

  it("falls back to referral", () => {
    expect(categorizeReferrer("https://news.ycombinator.com/item?id=1")).toBe("referral");
  });
});

describe("organicSharePercent", () => {
  it("computes percentage rounded", () => {
    const rows = [
      { referrer: "https://google.com" },
      { referrer: null },
      { referrer: "https://google.com" },
      { referrer: "https://example.com" },
    ];
    expect(organicSharePercent(rows)).toBe(50);
  });
});
