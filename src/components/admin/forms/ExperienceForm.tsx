"use client";

import { upsertExperience } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import {
  EditorForm,
  getFieldErrors,
  getFieldValue,
  useEditorFormState,
} from "@/components/admin/EditorForm";
import { FieldError } from "@/components/admin/FieldError";
import { ListEditor } from "@/components/admin/ListEditor";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { Input } from "@/components/ui/input";
import type { Experience } from "@/types/portfolio";

const FORM_ID = "experience-editor-form";

const PREVIEW_FIELDS = [
  { name: "role", label: "Role" },
  { name: "company", label: "Company" },
  { name: "bullets", label: "Bullets", type: "array" as const },
];

export function ExperienceForm({
  experience,
  isNew,
}: {
  experience: Partial<Experience> & { id?: string };
  isNew?: boolean;
}) {
  const bullets = Array.isArray(experience.bullets) ? experience.bullets : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminFormCard title={isNew ? "Experience baru" : "Experience details"}>
        <EditorForm
          action={upsertExperience}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/experiences" : undefined}
          className="space-y-6"
        >
          {experience.id ? <input type="hidden" name="id" value={experience.id} /> : null}
          <UnsavedChangesGuard formId={FORM_ID} />
          <ExperienceFormFields experience={experience} bullets={bullets} />
          <SubmitButton pendingText="Saving...">Save</SubmitButton>
        </EditorForm>
      </AdminFormCard>
      <LivePreviewPane formId={FORM_ID} title="Experience preview" fields={PREVIEW_FIELDS} />
    </div>
  );
}

function ExperienceFormFields({
  experience,
  bullets,
}: {
  experience: Partial<Experience> & { id?: string };
  bullets: string[];
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Company" htmlFor="company" className="sm:col-span-2">
        <Input
          id="company"
          name="company"
          required
          defaultValue={getFieldValue(state, "company", experience.company ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "company")} />
      </AdminField>
      <AdminField label="Role" htmlFor="role" className="sm:col-span-2">
        <Input
          id="role"
          name="role"
          required
          defaultValue={getFieldValue(state, "role", experience.role ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "role")} />
      </AdminField>
      <AdminField label="Location" htmlFor="location">
        <Input
          id="location"
          name="location"
          defaultValue={getFieldValue(state, "location", experience.location ?? "")}
        />
      </AdminField>
      <AdminField label="Employment type" htmlFor="employment_type">
        <Input
          id="employment_type"
          name="employment_type"
          defaultValue={getFieldValue(state, "employment_type", experience.employment_type ?? "")}
        />
      </AdminField>
      <AdminField label="Start date" htmlFor="start_date">
        <Input
          id="start_date"
          name="start_date"
          defaultValue={getFieldValue(state, "start_date", experience.start_date ?? "")}
        />
      </AdminField>
      <AdminField label="End date" htmlFor="end_date">
        <Input
          id="end_date"
          name="end_date"
          defaultValue={getFieldValue(state, "end_date", experience.end_date ?? "")}
        />
      </AdminField>
      <AdminField label="Sort order" htmlFor="sort_order">
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={getFieldValue(state, "sort_order", String(experience.sort_order ?? 0))}
        />
      </AdminField>
      <AdminField label="Status" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={getFieldValue(state, "status", experience.status ?? "published")}
          className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
      <AdminField label="Bullets" className="sm:col-span-2">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
    </div>
  );
}
