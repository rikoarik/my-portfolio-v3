import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EditorForm, getFieldErrors, getFieldValue, useEditorFormState } from "@/components/admin/EditorForm";
import { FieldError } from "@/components/admin/FieldError";
import { ListFilterBar } from "@/components/admin/ListFilterBar";
import { NavigationGuard } from "@/components/admin/NavigationGuard";
import { ReorderControls } from "@/components/admin/ReorderControls";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { errorResult, successResult, validationResult } from "@/lib/admin/action-result";
import { registerDirtyCheck } from "@/lib/admin/dirty-guard";
import { filterItems } from "@/lib/admin/list-filter";
import { notify } from "@/lib/admin/notify";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
  usePathname: () => "/admin/dashboard/projects",
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ConfirmDialog", () => {
  it("renders confirm and cancel actions", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Konfirmasi hapus"
        description='Hapus "Test"?'
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText("Hapus"));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Batal"));
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("DeleteButton", () => {
  it("confirms before delete and cancels without action", async () => {
    const deleteAction = vi.fn().mockResolvedValue(successResult("Deleted", "Projects", "Foo"));
    render(
      <DeleteButton id="1" title="Foo" deleteAction={deleteAction} />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Konfirmasi hapus")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Batal"));
    expect(deleteAction).not.toHaveBeenCalled();
  });

  it("calls delete action on confirm", async () => {
    const deleteAction = vi.fn().mockResolvedValue(successResult("Deleted", "Projects", "Foo"));
    render(
      <DeleteButton id="1" title="Foo" deleteAction={deleteAction} />,
    );
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Hapus"));
    await waitFor(() => expect(deleteAction).toHaveBeenCalled());
  });
});

describe("StatusToggle", () => {
  it("disables while pending", async () => {
    let resolveAction: (value: ReturnType<typeof successResult>) => void = () => {};
    const toggleAction = vi.fn(
      () =>
        new Promise<ReturnType<typeof successResult>>((resolve) => {
          resolveAction = resolve;
        }),
    );

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

    const button = screen.getByRole("button", { name: /toggle status/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();

    resolveAction(successResult("Updated", "Projects", "Item"));
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});

describe("BulkActionBar", () => {
  it("shows selected count", () => {
    const bulkAction = vi.fn();
    render(
      <BulkActionBar
        module="Projects"
        table="projects"
        selectedIds={["a", "b", "c"]}
        hasStatus
        bulkAction={bulkAction}
        onClear={vi.fn()}
        onDone={vi.fn()}
      />,
    );
    expect(screen.getByText("3 dipilih")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
    expect(screen.getByText("Hapus")).toBeInTheDocument();
  });
});

describe("EditorForm validation", () => {
  function TitleField({ fallback }: { fallback: string }) {
    const ctx = useEditorFormState();
    const state = ctx?.state ?? null;
    return (
      <>
        <input
          name="title"
          defaultValue={getFieldValue(state, "title", fallback)}
          aria-label="title"
        />
        <FieldError errors={getFieldErrors(state, "title")} />
      </>
    );
  }

  it("preserves field values on validation error", async () => {
    const action = vi.fn(async (_prev, formData: FormData) =>
      validationResult({ title: ["Title wajib"] }, formData),
    );

    render(
      <EditorForm action={action} formId="test-form">
        <TitleField fallback="hello" />
        <button type="submit">Save</button>
      </EditorForm>,
    );

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(action).toHaveBeenCalled());
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Title wajib")).toBeInTheDocument());
  });
});

describe("ReorderControls", () => {
  it("rolls back optimistic order on failure", async () => {
    const reorderAction = vi.fn().mockResolvedValue(errorResult("Gagal memindahkan."));
    const onOptimisticReorder = vi.fn();
    const onRollback = vi.fn();

    render(
      <ReorderControls
        id="b"
        index={1}
        total={3}
        orderedIds={["a", "b", "c"]}
        module="Projects"
        reorderAction={reorderAction}
        onOptimisticReorder={onOptimisticReorder}
        onRollback={onRollback}
      />,
    );

    fireEvent.click(screen.getByLabelText("Move Projects item up"));
    await waitFor(() => expect(reorderAction).toHaveBeenCalled());
    expect(onOptimisticReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    await waitFor(() => expect(onRollback).toHaveBeenCalledWith(["a", "b", "c"]));
  });
});

describe("beforeunload guard", () => {
  it("registers beforeunload when form is dirty", () => {
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

describe("NavigationGuard", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("prompts on dirty in-app navigation and cancel keeps user", () => {
    const unregister = registerDirtyCheck(() => true);
    render(
      <>
        <NavigationGuard pathname="/admin/dashboard/projects" />
        <a href="/admin/dashboard/seo">Go SEO</a>
      </>,
    );

    fireEvent.click(screen.getByText("Go SEO"));
    expect(screen.getByText("Perubahan belum disimpan")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Tetap di halaman"));
    expect(push).not.toHaveBeenCalled();
    unregister();
  });

  it("discards changes and navigates on confirm", () => {
    const unregister = registerDirtyCheck(() => true);
    render(
      <>
        <NavigationGuard pathname="/admin/dashboard/projects" />
        <a href="/admin/dashboard/seo">Go SEO</a>
      </>,
    );

    fireEvent.click(screen.getByText("Go SEO"));
    fireEvent.click(screen.getByText("Buang perubahan"));
    expect(push).toHaveBeenCalledWith("/admin/dashboard/seo");
    unregister();
  });
});

describe("UnsavedChangesGuard integration", () => {
  it("registers dirty state from form edits", async () => {
    render(
      <EditorForm action={vi.fn().mockResolvedValue(successResult("ok", "X", "Y"))} formId="guard-form">
        <UnsavedChangesGuard formId="guard-form" />
        <input name="title" defaultValue="start" />
      </EditorForm>,
    );

    const input = screen.getByDisplayValue("start");
    fireEvent.change(input, { target: { value: "changed" } });

    const unregister = registerDirtyCheck(() => false);
    unregister();

    render(
      <>
        <NavigationGuard pathname="/admin/dashboard/projects" />
        <a href="/admin/dashboard/media">Media</a>
      </>,
    );
    fireEvent.click(screen.getByText("Media"));
    expect(screen.getByText("Perubahan belum disimpan")).toBeInTheDocument();
  });
});

describe("notify", () => {
  it("uses configured toast durations", async () => {
    const { toast } = await import("sonner");
    notify.success("Saved");
    expect(toast.success).toHaveBeenCalledWith("Saved", {
      duration: 5000,
      closeButton: true,
    });
    notify.error("Failed");
    expect(toast.error).toHaveBeenCalledWith("Failed", {
      duration: Infinity,
      closeButton: true,
    });
  });
});

describe("ListFilterBar", () => {
  it("retains query input and defaults to all status", () => {
    const onQuery = vi.fn();
    const onStatus = vi.fn();
    render(
      <ListFilterBar
        query="hello"
        status="all"
        hasStatusFilter
        onQueryChange={onQuery}
        onStatusChange={onStatus}
      />,
    );
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter status")).toHaveValue("all");
  });
});

describe("filterItems no-match", () => {
  it("returns empty when no records match", () => {
    const items = [{ id: "1", title: "Alpha", status: "draft" }];
    const result = filterItems(items, "zzz", "all");
    expect(result).toEqual([]);
  });
});
