"use client";

import { upsertExperience } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { FormToolbar, StickyFormActions } from "@/components/admin/forms/FormHelpers";
import { ModuleEditorShell } from "@/components/admin/forms/ModuleEditorShell";
import {
  EditorForm,
  getFieldErrors,
  getFieldValue,
  useEditorFormState,
} from "@/components/admin/EditorForm";
import { FieldError } from "@/components/admin/FieldError";
import { ListEditor } from "@/components/admin/ListEditor";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
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
  backHref = "/admin/dashboard/experiences",
  title,
  headerActions,
}: {
  experience: Partial<Experience> & { id?: string };
  isNew?: boolean;
  backHref?: string;
  title?: string;
  headerActions?: React.ReactNode;
}) {
  const bullets = Array.isArray(experience.bullets) ? experience.bullets : [];

  return (
    <ModuleEditorShell
      form={
        <EditorForm
          action={upsertExperience}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/experiences" : undefined}
        >
          {experience.id ? <input type="hidden" name="id" value={experience.id} /> : null}
          <input type="hidden" name="sort_order" value={String(experience.sort_order ?? 0)} />
          <UnsavedChangesGuard formId={FORM_ID} />
          <FormToolbar
            formId={FORM_ID}
            backHref={backHref}
            title={title}
            headerActions={headerActions}
            saveLabel="Simpan"
            showStatus
            statusDefault={(experience.status ?? "draft") as "draft" | "published"}
          />
          <ExperienceFormFields experience={experience} bullets={bullets} isNew={isNew} />
          <StickyFormActions formId={FORM_ID} backHref={backHref} saveLabel="Simpan" />
        </EditorForm>
      }
      preview={
        <LivePreviewPane formId={FORM_ID} title="Preview" fields={PREVIEW_FIELDS} />
      }
    />
  );
}

function ExperienceFormFields({
  experience,
  bullets,
  isNew,
}: {
  experience: Partial<Experience> & { id?: string };
  bullets: string[];
  isNew?: boolean;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-1.5 sm:grid-cols-4">
      <AdminField label="Company" htmlFor="company" className="sm:col-span-2">
        <Input
          id="company"
          name="company"
          required
          autoFocus={isNew}
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
      <AdminField label="Type" htmlFor="employment_type">
        <Input
          id="employment_type"
          name="employment_type"
          placeholder="Full-time"
          defaultValue={getFieldValue(state, "employment_type", experience.employment_type ?? "")}
        />
      </AdminField>
      <AdminField label="Start" htmlFor="start_date">
        <Input
          id="start_date"
          name="start_date"
          defaultValue={getFieldValue(state, "start_date", experience.start_date ?? "")}
        />
      </AdminField>
      <AdminField label="End" htmlFor="end_date">
        <Input
          id="end_date"
          name="end_date"
          defaultValue={getFieldValue(state, "end_date", experience.end_date ?? "")}
        />
      </AdminField>
      <AdminField label="Bullets" className="sm:col-span-4">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
    </div>
  );
}
