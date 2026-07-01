"use client";

import {
  deleteSectionContent,
  toggleRecordStatus,
} from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import type { SectionData } from "@/components/admin/forms/SectionForm";

export function SectionsList({
  rows,
  activeTab,
}: {
  rows: SectionData[];
  activeTab: string;
}) {
  const tabFiltered =
    activeTab === "all" ? rows : rows.filter((r) => r.section_key === activeTab);

  return (
    <FilterableList
      items={tabFiltered.map((r) => ({
        id: r.id!,
        title: r.title || r.section_key,
        status: r.status,
        subtitle: r.section_key,
      }))}
      module="Sections"
      table="section_content"
      config={{
        hasStatus: true,
        editHrefPrefix: "/admin/dashboard/sections/",
      }}
      deleteAction={deleteSectionContent}
      toggleStatusAction={toggleRecordStatus}
      emptyTitle="Tidak ada section"
      emptyDescription="Tidak ada section untuk tab ini."
    />
  );
}
