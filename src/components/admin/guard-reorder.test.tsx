import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EditorForm, useEditorFormState } from "@/components/admin/EditorForm";
import { FilterableList } from "@/components/admin/FilterableList";
import { ReorderControls } from "@/components/admin/ReorderControls";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { errorResult, successResult, validationResult } from "@/lib/admin/action-result";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh }),
  usePathname: () => "/admin/dashboard/projects",
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("UnsavedChangesGuard failed-save dirty retention", () => {
  function ValidationProbe() {
    const ctx = useEditorFormState();
    if (!ctx?.state || ctx.state.ok) return null;
    if (ctx.state.kind !== "validation") return null;
    return <span data-testid="validation-failed">validation failed</span>;
  }

  it("keeps validation state after failed submit without success reset", async () => {
    const action = vi.fn(async (_prev, formData: FormData) =>
      validationResult({ title: ["Title wajib"] }, formData),
    );

    render(
      <EditorForm action={action} formId="dirty-form">
        <UnsavedChangesGuard formId="dirty-form" />
        <ValidationProbe />
        <input name="title" defaultValue="start" />
        <button type="submit">Save</button>
      </EditorForm>,
    );

    fireEvent.input(screen.getByDisplayValue("start"), { target: { value: "changed" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(screen.getByTestId("validation-failed")).toBeInTheDocument());
    expect(action).toHaveBeenCalled();
  });
});

describe("StatusToggle rollback on error", () => {
  it("refreshes and shows error toast when toggle fails", async () => {
    refresh.mockClear();
    const toggleAction = vi.fn().mockResolvedValue(errorResult("Gagal mengubah status."));
    const { toast } = await import("sonner");

    render(
      <StatusToggle
        id="1"
        title="Item"
        table="projects"
        module="Projects"
        currentStatus="draft"
        toggleAction={toggleAction}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /toggle status/i }));
    await waitFor(() => expect(toggleAction).toHaveBeenCalled());
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("ReorderControls rollback", () => {
  it("restores order callback on failure", async () => {
    const reorderAction = vi.fn().mockResolvedValue(errorResult("Gagal memindahkan."));
    const onRollback = vi.fn();

    render(
      <ReorderControls
        id="b"
        index={1}
        total={3}
        orderedIds={["a", "b", "c"]}
        module="Projects"
        reorderAction={reorderAction}
        onOptimisticReorder={vi.fn()}
        onRollback={onRollback}
      />,
    );

    fireEvent.click(screen.getByLabelText("Move Projects item up"));
    await waitFor(() => expect(onRollback).toHaveBeenCalledWith(["a", "b", "c"]));
  });
});

describe("FilterableList bulk visibility", () => {
  it("shows BulkActionBar only when items are selected", () => {
    const bulkAction = vi.fn();
    render(
      <FilterableList
        items={[
          { id: "1", title: "Alpha", status: "draft" },
          { id: "2", title: "Beta", status: "published" },
        ]}
        module="Projects"
        table="projects"
        config={{ hasBulk: true, hasStatus: true }}
        bulkAction={bulkAction}
      />,
    );

    expect(screen.queryByText(/dipilih/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Pilih Alpha"));
    expect(screen.getByText("1 dipilih")).toBeInTheDocument();
  });
});

describe("beforeunload registration", () => {
  it("registers beforeunload listener on EditorForm mount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    render(
      <EditorForm action={vi.fn().mockResolvedValue(successResult("ok", "X", "Y"))} formId="unload-form">
        <UnsavedChangesGuard formId="unload-form" />
        <input name="title" defaultValue="start" />
      </EditorForm>,
    );
    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    addSpy.mockRestore();
  });
});
