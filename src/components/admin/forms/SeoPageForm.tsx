"use client";

import { upsertSeoPage } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import {
  EditorForm,
  getFieldErrors,
  getFieldValue,
  useEditorFormState,
} from "@/components/admin/EditorForm";
import { FieldError } from "@/components/admin/FieldError";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type SeoPageData = {
  id: string;
  page_key: string;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  robots: string | null;
  metadata: unknown;
  status: "draft" | "published";
};

function formIdFor(page: SeoPageData) {
  return `seo-page-form-${page.id}`;
}

function SeoPageFields({ page }: { page: SeoPageData }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <>
      <input type="hidden" name="id" value={page.id} />
      <AdminField label="Page key" htmlFor={`page_key-${page.id}`}>
        <Input
          id={`page_key-${page.id}`}
          name="page_key"
          required
          defaultValue={getFieldValue(state, "page_key", page.page_key)}
        />
        <FieldError errors={getFieldErrors(state, "page_key")} />
      </AdminField>
      <AdminField label="Title" htmlFor={`title-${page.id}`}>
        <Input
          id={`title-${page.id}`}
          name="title"
          defaultValue={getFieldValue(state, "title", page.title ?? "")}
        />
      </AdminField>
      <AdminField label="Description" htmlFor={`description-${page.id}`} className="sm:col-span-2">
        <Textarea
          id={`description-${page.id}`}
          name="description"
          rows={3}
          defaultValue={getFieldValue(state, "description", page.description ?? "")}
        />
      </AdminField>
      <AdminField label="Canonical URL" htmlFor={`canonical_url-${page.id}`}>
        <Input
          id={`canonical_url-${page.id}`}
          name="canonical_url"
          defaultValue={getFieldValue(state, "canonical_url", page.canonical_url ?? "")}
        />
      </AdminField>
      <AdminField label="OG image URL" htmlFor={`og_image_url-${page.id}`}>
        <Input
          id={`og_image_url-${page.id}`}
          name="og_image_url"
          defaultValue={getFieldValue(state, "og_image_url", page.og_image_url ?? "")}
        />
      </AdminField>
      <AdminField label="Robots" htmlFor={`robots-${page.id}`}>
        <Input
          id={`robots-${page.id}`}
          name="robots"
          defaultValue={getFieldValue(state, "robots", page.robots ?? "index,follow")}
        />
      </AdminField>
      <AdminField label="Status" htmlFor={`status-${page.id}`}>
        <select
          id={`status-${page.id}`}
          name="status"
          defaultValue={getFieldValue(state, "status", page.status)}
          className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
      <AdminField label="Metadata JSON" htmlFor={`metadata-${page.id}`} className="sm:col-span-2">
        <Textarea
          id={`metadata-${page.id}`}
          name="metadata"
          rows={3}
          defaultValue={getFieldValue(
            state,
            "metadata",
            page.metadata ? JSON.stringify(page.metadata, null, 2) : "{}",
          )}
        />
        <FieldError errors={getFieldErrors(state, "metadata")} />
      </AdminField>
    </>
  );
}

export function SeoPageForm({ page }: { page: SeoPageData }) {
  const fid = formIdFor(page);

  return (
    <AdminFormCard title={page.page_key} description="Override metadata per halaman.">
      <EditorForm action={upsertSeoPage} formId={fid} className="grid gap-3 sm:grid-cols-2">
        <UnsavedChangesGuard formId={fid} />
        <SeoPageFields page={page} />
        <div className="sm:col-span-2">
          <SubmitButton pendingText="Menyimpan...">Update</SubmitButton>
        </div>
      </EditorForm>
    </AdminFormCard>
  );
}
