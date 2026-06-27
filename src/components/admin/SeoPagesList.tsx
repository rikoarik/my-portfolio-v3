"use client";

import {
  bulkAction,
  deleteSeoPage,
  toggleRecordStatus,
} from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { SeoPageForm, type SeoPageData } from "@/components/admin/forms/SeoPageForm";

export function SeoPagesList({ rows }: { rows: SeoPageData[] }) {
  return (
    <div className="space-y-6">
      <FilterableList
        items={rows.map((row) => ({
          id: row.id,
          title: row.title || row.page_key,
          status: row.status,
          subtitle: row.page_key,
        }))}
        module="SEO"
        table="seo_pages"
        config={{ hasStatus: true, editHref: (id) => `#seo-page-${id}` }}
        deleteAction={deleteSeoPage}
        bulkAction={bulkAction}
        toggleStatusAction={toggleRecordStatus}
      />

      <div className="grid gap-6">
        {rows.map((row) => (
          <div key={row.id} id={`seo-page-${row.id}`}>
            <SeoPageForm page={row} />
          </div>
        ))}
      </div>
    </div>
  );
}
