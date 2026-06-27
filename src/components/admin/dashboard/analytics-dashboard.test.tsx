import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopPagesTable } from "@/components/admin/dashboard/TopPagesTable";
import { TopReferrersTable } from "@/components/admin/dashboard/TopReferrersTable";

describe("TopPagesTable", () => {
  it("renders empty state", () => {
    render(<TopPagesTable rows={[]} />);
    expect(screen.getByText(/No page views recorded yet/i)).toBeInTheDocument();
  });

  it("renders rows", () => {
    render(
      <TopPagesTable
        rows={[
          { path: "/", views: 120, share: 60 },
          { path: "/projects", views: 80, share: 40 },
        ]}
      />,
    );
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });
});

describe("TopReferrersTable", () => {
  it("renders empty state", () => {
    render(<TopReferrersTable rows={[]} />);
    expect(screen.getByText(/No referrer data yet/i)).toBeInTheDocument();
  });

  it("renders referrer hostnames", () => {
    render(
      <TopReferrersTable
        rows={[
          { referrer: "(direct)", views: 50 },
          { referrer: "https://www.google.com/search?q=a", views: 30 },
        ]}
      />,
    );
    expect(screen.getByText("Direct / none")).toBeInTheDocument();
    expect(screen.getByText("www.google.com")).toBeInTheDocument();
  });
});
