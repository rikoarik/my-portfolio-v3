"use client";

import { deleteMediaAsset } from "@/app/admin/actions";
import { FilterableList } from "@/components/admin/FilterableList";
import { MediaThumb } from "@/components/admin/MediaThumb";

type MediaRow = {
  id: string;
  path: string;
  public_url: string;
  alt: string | null;
  mime_type: string | null;
};

export function MediaList({ rows }: { rows: MediaRow[] }) {
  return (
    <FilterableList
      items={rows.map((row) => ({
        id: row.id,
        title: row.path,
        subtitle: row.public_url,
        meta: (
          <div className="flex items-center gap-3">
            <MediaThumb url={row.public_url} mimeType={row.mime_type} alt={row.alt ?? undefined} />
            <a
              href={row.public_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--primary)] hover:underline"
            >
              Open
            </a>
          </div>
        ),
      }))}
      module="Media"
      table="media_assets"
      config={{}}
      deleteAction={deleteMediaAsset}
    />
  );
}
