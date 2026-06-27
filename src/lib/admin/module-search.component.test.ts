import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { clampQuery, searchModules } from "./module-search";
import { ADMIN_NAV_GROUPS } from "./nav-config";
import { flattenModules } from "./module-search";

// Feature: cms-management-usability - ModuleSearch component tests
describe("ModuleSearch logic", () => {
  it("shows empty-result message when no modules match", () => {
    const modules = flattenModules(ADMIN_NAV_GROUPS);
    const results = searchModules("zzzznotfound", modules);
    expect(results).toEqual([]);
  });

  it("finds Projects module case-insensitively", () => {
    const modules = flattenModules(ADMIN_NAV_GROUPS);
    const results = searchModules("proj", modules);
    expect(results.some((m) => m.label === "Projects")).toBe(true);
  });

  it("clamps query to 100 chars", () => {
    const long = "a".repeat(150);
    expect(clampQuery(long, 100).length).toBe(100);
  });
});
