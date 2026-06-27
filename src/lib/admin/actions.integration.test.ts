import { describe, expect, it, vi, beforeEach } from "vitest";

import { successResult, validationResult } from "./action-result";
import { partitionBulkOutcome } from "./bulk";

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

function buildMockSupabase(opts?: {
  deleteFailsFor?: string[];
  insertFails?: boolean;
  updateFails?: boolean;
}) {
  const deleteFailsFor = new Set(opts?.deleteFailsFor ?? []);
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: "user-1" } } }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () =>
            table === "admin_users" ? { data: { user_id: "user-1" } } : { data: null },
        }),
      }),
      insert: async () => ({
        error: opts?.insertFails ? { message: "insert failed" } : null,
      }),
      update: () => ({
        eq: async () => ({
          error: opts?.updateFails ? { message: "update failed" } : null,
        }),
      }),
      delete: () => ({
        eq: async (_col: string, id: string) => ({
          error: deleteFailsFor.has(id) ? { message: "delete failed" } : null,
        }),
      }),
    }),
  };
}

function projectFormData(title = "New Project") {
  const formData = new FormData();
  formData.set("title", title);
  formData.set("status", "published");
  formData.set("sort_order", "0");
  return formData;
}

describe("ActionResult integration", () => {
  it("returns success result shape", () => {
    const result = successResult("Memperbarui Foo di Projects", "Projects", "Foo");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.module).toBe("Projects");
      expect(result.record).toBe("Foo");
    }
  });

  it("returns validation result on invalid input", () => {
    const formData = new FormData();
    formData.set("title", "");
    const result = validationResult({ title: ["Title wajib"] }, formData);
    expect(result.ok).toBe(false);
    if (!result.ok && result.kind === "validation") {
      expect(result.values.title).toBe("");
      expect(result.fieldErrors.title).toContain("Title wajib");
    }
  });

  it("partitions bulk outcome correctly", () => {
    const requested = ["a", "b", "c"];
    const succeeded = ["a", "c"];
    const failed = ["b"];
    expect(partitionBulkOutcome(requested, succeeded, failed)).toBe(true);
  });
});

describe("bulkAction with mocked Supabase", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns success with partial failure counts", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      buildMockSupabase({ deleteFailsFor: ["b"] }) as never,
    );

    const { bulkAction } = await import("@/app/admin/actions");
    const formData = new FormData();
    formData.set("module", "Projects");
    formData.set("table", "projects");
    formData.set("op", "delete");
    formData.set("ids", JSON.stringify(["a", "b", "c"]));

    const result = await bulkAction(null, formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.message).toContain("2");
      expect(result.message).toContain("1");
    }
  });

  it("returns error result when supabase is unavailable", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(null);

    const { bulkAction } = await import("@/app/admin/actions");
    const formData = new FormData();
    formData.set("module", "Projects");
    formData.set("table", "projects");
    formData.set("op", "delete");
    formData.set("ids", JSON.stringify(["a"]));

    const result = await bulkAction(null, formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("error");
    }
  });
});

describe("upsertProject with mocked Supabase", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns success on create", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(buildMockSupabase() as never);

    const { upsertProject } = await import("@/app/admin/actions");
    const result = await upsertProject(null, projectFormData("Alpha"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.module).toBe("Projects");
      expect(result.record).toBe("Alpha");
    }
  });

  it("returns error when insert fails", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      buildMockSupabase({ insertFails: true }) as never,
    );

    const { upsertProject } = await import("@/app/admin/actions");
    const result = await upsertProject(null, projectFormData());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("error");
    }
  });

  it("returns validation error for empty title", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(buildMockSupabase() as never);

    const { upsertProject } = await import("@/app/admin/actions");
    const formData = projectFormData("");
    const result = await upsertProject(null, formData);
    expect(result.ok).toBe(false);
    if (!result.ok && result.kind === "validation") {
      expect(result.fieldErrors.title).toBeDefined();
    }
  });
});
