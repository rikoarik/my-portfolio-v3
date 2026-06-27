"use client";

import { upsertEducation } from "@/app/admin/actions";
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

const FORM_ID = "education-editor-form";

const PREVIEW_FIELDS = [
  { name: "degree", label: "Degree" },
  { name: "institution", label: "Institution" },
  { name: "bullets", label: "Bullets", type: "array" as const },
];

type EducationData = {
  id?: string;
  institution?: string;
  degree?: string;
  field?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
  sort_order?: number;
  bullets?: string[];
};

export function EducationForm({
  education,
  isNew,
}: {
  education: EducationData;
  isNew?: boolean;
}) {
  const bullets = Array.isArray(education.bullets) ? education.bullets : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminFormCard title={isNew ? "Education baru" : "Education details"}>
        <EditorForm
          action={upsertEducation}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/education" : undefined}
          className="space-y-6"
        >
          {education.id ? <input type="hidden" name="id" value={education.id} /> : null}
          <UnsavedChangesGuard formId={FORM_ID} />
          <EducationFormFields education={education} bullets={bullets} />
          <SubmitButton pendingText="Saving...">Save</SubmitButton>
        </EditorForm>
      </AdminFormCard>
      <LivePreviewPane formId={FORM_ID} title="Education preview" fields={PREVIEW_FIELDS} />
    </div>
  );
}

function EducationFormFields({
  education,
  bullets,
}: {
  education: EducationData;
  bullets: string[];
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Institution" htmlFor="institution" className="sm:col-span-2">
        <Input
          id="institution"
          name="institution"
          required
          defaultValue={getFieldValue(state, "institution", education.institution ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "institution")} />
      </AdminField>
      <AdminField label="Degree" htmlFor="degree" className="sm:col-span-2">
        <Input
          id="degree"
          name="degree"
          required
          defaultValue={getFieldValue(state, "degree", education.degree ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "degree")} />
      </AdminField>
      <AdminField label="Field" htmlFor="field">
        <Input
          id="field"
          name="field"
          defaultValue={getFieldValue(state, "field", education.field ?? "")}
        />
      </AdminField>
      <AdminField label="GPA" htmlFor="gpa">
        <Input id="gpa" name="gpa" defaultValue={getFieldValue(state, "gpa", education.gpa ?? "")} />
      </AdminField>
      <AdminField label="Start date" htmlFor="start_date">
        <Input
          id="start_date"
          name="start_date"
          defaultValue={getFieldValue(state, "start_date", education.start_date ?? "")}
        />
      </AdminField>
      <AdminField label="End date" htmlFor="end_date">
        <Input
          id="end_date"
          name="end_date"
          defaultValue={getFieldValue(state, "end_date", education.end_date ?? "")}
        />
      </AdminField>
      <AdminField label="Sort order" htmlFor="sort_order">
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={getFieldValue(state, "sort_order", String(education.sort_order ?? 0))}
        />
      </AdminField>
      <AdminField label="Bullets" className="sm:col-span-2">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
    </div>
  );
}
