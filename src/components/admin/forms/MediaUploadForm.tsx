"use client";

import { useState } from "react";

import { upsertMediaAsset } from "@/app/admin/actions";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { EditorForm } from "@/components/admin/EditorForm";
import { MediaUrlPreview } from "@/components/admin/MediaUrlPreview";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";

const MEDIA_FORM_ID = "media-upload-form";

export function MediaUploadForm() {
  const [url, setUrl] = useState("");

  return (
    <AdminFormCard title="Tambah media" description="Simpan URL publik dan metadata asset.">
      <EditorForm action={upsertMediaAsset} formId={MEDIA_FORM_ID} className="space-y-4">
        <UnsavedChangesGuard formId={MEDIA_FORM_ID} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="bucket"
            defaultValue="portfolio-media"
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          />
          <input
            name="path"
            placeholder="covers/project-1.jpg"
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
            required
          />
          <input
            name="public_url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
            required
          />
          <input
            name="mime_type"
            placeholder="image/jpeg"
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          />
          <input
            name="alt"
            placeholder="Alt text"
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          />
          <input
            name="caption"
            placeholder="Caption"
            className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
          />
        </div>
        <MediaUrlPreview url={url} />
        <SubmitButton pendingText="Menyimpan...">Simpan</SubmitButton>
      </EditorForm>
    </AdminFormCard>
  );
}
