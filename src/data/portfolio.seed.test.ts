import { describe, expect, it } from "vitest";
import { PORTFOLIO_SEED } from "./portfolio.seed";

function section(key: string) {
  return PORTFOLIO_SEED.sections.find((item) => item.section_key === key);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

describe("portfolio seed content", () => {
  it("positions the hero around mobile fintech and payment apps", () => {
    const hero = section("hero");

    expect(hero?.subtitle).toBe("Mobile Developer");
    expect(hero?.body).toContain(
      "Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.",
    );
    expect(hero?.body).toContain(
      "I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.",
    );
    expect(PORTFOLIO_SEED.profile.tagline).toContain(
      "production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations",
    );
  });

  it("keeps about copy professional and avoids aesthetic-only positioning", () => {
    const about = section("about");
    const text = collectStrings(about).join("\n").toLowerCase();

    expect(text).toContain("production mobile apps");
    expect(text).toContain("clean architecture");
    expect(text).toContain("api");
    expect(text).not.toMatch(/magical|physics-based|editorial design|emotional|passion driven/);
  });

  it("does not ship fake or random guestbook testimonials in seed data", () => {
    expect(PORTFOLIO_SEED.guestbook).toEqual([]);
  });

  it("uses professional proof stats without zero or passion fallbacks", () => {
    const about = section("about");
    const proof = section("proof");
    const text = [about, proof].flatMap(collectStrings).join("\n").toLowerCase();

    expect(text).toContain("production apps");
    expect(text).toContain("fintech");
    expect(text).not.toMatch(/0\+|0%|passion driven/);
  });

  it("uses Present for active project period labels", () => {
    const member = PORTFOLIO_SEED.projects.find((project) => project.title === "Member App Ecosystem");
    const puas = PORTFOLIO_SEED.projects.find((project) => project.title === "Puas HUB");

    expect(member?.period_label).toBe("Aug 2025 – Present");
    expect(puas?.period_label).toBe("Feb 2026 – Present");

    const labels = PORTFOLIO_SEED.projects.map((project) => project.period_label ?? "").join("\n");
    expect(labels).not.toContain("Nov 2026");
    expect(labels).not.toContain("May 2026");
  });

  it("highlights the requested mobile project domains", () => {
    const text = collectStrings(PORTFOLIO_SEED.projects).join("\n").toLowerCase();

    expect(text).toContain("multi-tenant");
    expect(text).toContain("member");
    expect(text).toContain("merchant");
    expect(text).toContain("ppob");
    expect(text).toContain("qris");
    expect(text).toContain("nfc");
    expect(text).toContain("edc");
    expect(text).toContain("gps");
    expect(text).toContain("selfie");
  });
});