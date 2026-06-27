"use client";

import { upsertEducation } from "@/app/admin/actions";
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
  backHref = "/admin/dashboard/education",
  title,
  headerActions,
}: {
  education: EducationData;
  isNew?: boolean;
  backHref?: string;
  title?: string;
  headerActions?: React.ReactNode;
}) {
  const bullets = Array.isArray(education.bullets) ? education.bullets : [];

  return (
    <ModuleEditorShell
      form={
        <EditorForm
          action={upsertEducation}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/education" : undefined}
        >
          {education.id ? <input type="hidden" name="id" value={education.id} /> : null}
          <input type="hidden" name="sort_order" value={String(education.sort_order ?? 0)} />
          <UnsavedChangesGuard formId={FORM_ID} />
          <FormToolbar
            formId={FORM_ID}
            backHref={backHref}
            title={title}
            headerActions={headerActions}
            saveLabel="Simpan"
          />
          <EducationFormFields education={education} bullets={bullets} isNew={isNew} />
          <StickyFormActions formId={FORM_ID} backHref={backHref} saveLabel="Simpan" />
        </EditorForm>
      }
      preview={
        <LivePreviewPane formId={FORM_ID} title="Preview" fields={PREVIEW_FIELDS} />
      }
    />
  );
}

function EducationFormFields({
  education,
  bullets,
  isNew,
}: {
  education: EducationData;
  bullets: string[];
  isNew?: boolean;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-1.5 sm:grid-cols-4">
      <AdminField label="Institution" htmlFor="institution" className="sm:col-span-4">
        <Input
          id="institution"
          name="institution"
          required
          autoFocus={isNew}
          defaultValue={getFieldValue(state, "institution", education.institution ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "institution")} />
      </AdminField>
      <AdminField label="Degree" htmlFor="degree" className="sm:col-span-4">
        <Input
          id="degree"
          name="degree"
          required
          defaultValue={getFieldValue(state, "degree", education.degree ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "degree")} />
      </AdminField>
      <AdminField label="Field" htmlFor="field" className="sm:col-span-2">
        <Input
          id="field"
          name="field"
          defaultValue={getFieldValue(state, "field", education.field ?? "")}
        />
      </AdminField>
      <AdminField label="GPA" htmlFor="gpa">
        <Input id="gpa" name="gpa" defaultValue={getFieldValue(state, "gpa", education.gpa ?? "")} />
      </AdminField>
      <AdminField label="Start" htmlFor="start_date">
        <Input
          id="start_date"
          name="start_date"
          placeholder="2018"
          defaultValue={getFieldValue(state, "start_date", education.start_date ?? "")}
        />
      </AdminField>
      <AdminField label="End" htmlFor="end_date">
        <Input
          id="end_date"
          name="end_date"
          placeholder="2022"
          defaultValue={getFieldValue(state, "end_date", education.end_date ?? "")}
        />
      </AdminField>
      <AdminField label="Bullets" className="sm:col-span-4">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
    </div>
  );
}
