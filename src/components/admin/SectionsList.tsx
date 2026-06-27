"use client";

import {
  deleteSectionContent,
  toggleRecordStatus,
} from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { SectionForm, type SectionData } from "@/components/admin/forms/SectionForm";

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
    <div className="space-y-6">
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
          editHref: (id) => `#section-${id}`,
        }}
        deleteAction={deleteSectionContent}
        toggleStatusAction={toggleRecordStatus}
        emptyTitle="Tidak ada section"
        emptyDescription="Tidak ada section untuk tab ini."
      />

      <div className="grid gap-8">
        {tabFiltered.map((row) => (
          <div key={row.id} id={`section-${row.id}`}>
            <SectionForm section={row} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionCreateForm() {
  return (
    <SectionForm section={{ section_key: "", status: "published" }} isNew />
  );
}
