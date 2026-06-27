import { describe, expect, it } from "vitest";

import { addEntry, removeEntry } from "./list-editor";

describe("ListEditor logic", () => {
  it("rejects empty entries", () => {
    const result = addEntry([], "   ");
    expect(result.ok).toBe(false);
  });

  it("removes entry preserving order", () => {
    const next = removeEntry(["a", "b", "c"], 1);
    expect(next).toEqual(["a", "c"]);
  });
});
