import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { MediaThumb } from "@/components/admin/MediaThumb";
import { MediaUrlPreview } from "@/components/admin/MediaUrlPreview";
import { PreviewPane } from "@/components/admin/PreviewPane";

describe("PreviewPane", () => {
  it("renders empty placeholder for blank fields", () => {
    render(
      <PreviewPane
        title="Test preview"
        fields={[{ label: "Title", value: "" }]}
      />,
    );
    expect(screen.getByText("Test preview")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("formats array fields", () => {
    render(
      <PreviewPane
        fields={[{ label: "Tags", value: "react\nnextjs", type: "array" }]}
      />,
    );
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });
});

describe("LivePreviewPane", () => {
  it("updates preview when form input changes", async () => {
    render(
      <>
        <form id="live-preview-form">
          <input name="title" defaultValue="Alpha" />
        </form>
        <LivePreviewPane
          formId="live-preview-form"
          title="Live"
          fields={[{ name: "title", label: "Title" }]}
        />
      </>,
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue("Alpha"), { target: { value: "Beta" } });
    await waitFor(() => expect(screen.getByText("Beta")).toBeInTheDocument());
  });
});

describe("MediaThumb", () => {
  it("shows file placeholder for non-image MIME", () => {
    render(<MediaThumb url="https://example.com/doc.pdf" mimeType="application/pdf" />);
    expect(screen.getByLabelText("Non-image file")).toBeInTheDocument();
  });
});

describe("MediaUrlPreview", () => {
  it("renders nothing when url is empty", () => {
    const { container } = render(<MediaUrlPreview url="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows loading state for non-empty url", () => {
    vi.stubGlobal(
      "Image",
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_value: string) {
          // keep loading
        }
      },
    );

    render(<MediaUrlPreview url="https://example.com/photo.jpg" />);
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
  });
});
