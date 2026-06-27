"use client";

import { upsertProject } from "@/app/admin/actions";
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
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/types/portfolio";

const FORM_ID = "project-editor-form";

const PREVIEW_FIELDS = [
  { name: "title", label: "Title" },
  { name: "subtitle", label: "Subtitle", type: "text" as const },
  { name: "stack", label: "Stack", type: "array" as const },
  { name: "bullets", label: "Bullets", type: "array" as const },
  { name: "tags", label: "Tags", type: "array" as const },
];

export function ProjectForm({
  project,
  isNew,
}: {
  project: Partial<Project> & { id?: string };
  isNew?: boolean;
}) {
  const stack = Array.isArray(project.stack) ? project.stack : [];
  const bullets = Array.isArray(project.bullets) ? project.bullets : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminFormCard title={isNew ? "Project baru" : "Project details"}>
        <EditorForm
          action={upsertProject}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/projects" : undefined}
          className="space-y-6"
        >
          {project.id ? <input type="hidden" name="id" value={project.id} /> : null}
          <UnsavedChangesGuard formId={FORM_ID} />
          <ProjectFormFields
            project={project}
            stack={stack}
            bullets={bullets}
            tags={tags}
          />
          <SubmitButton pendingText="Saving...">Save</SubmitButton>
        </EditorForm>
      </AdminFormCard>
      <LivePreviewPane formId={FORM_ID} title="Project preview" fields={PREVIEW_FIELDS} />
    </div>
  );
}

function ProjectFormFields({
  project,
  stack,
  bullets,
  tags,
}: {
  project: Partial<Project> & { id?: string };
  stack: string[];
  bullets: string[];
  tags: string[];
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Title" htmlFor="title" className="sm:col-span-2">
        <Input
          id="title"
          name="title"
          required
          defaultValue={getFieldValue(state, "title", project.title ?? "")}
        />
        <FieldError errors={getFieldErrors(state, "title")} />
      </AdminField>
      <AdminField label="Subtitle" htmlFor="subtitle" className="sm:col-span-2">
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={getFieldValue(state, "subtitle", project.subtitle ?? "")}
        />
      </AdminField>
      <AdminField label="Period label" htmlFor="period_label">
        <Input
          id="period_label"
          name="period_label"
          defaultValue={getFieldValue(state, "period_label", project.period_label ?? "")}
        />
      </AdminField>
      <AdminField label="Sort order" htmlFor="sort_order">
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={getFieldValue(state, "sort_order", String(project.sort_order ?? 0))}
        />
      </AdminField>
      <AdminField label="Stack" className="sm:col-span-2">
        <ListEditor name="stack" initialEntries={stack} />
      </AdminField>
      <AdminField label="Bullets" className="sm:col-span-2">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
      <AdminField label="Tags" className="sm:col-span-2">
        <ListEditor name="tags" initialEntries={tags} />
      </AdminField>
      <AdminField label="Case study (JSON)" htmlFor="case_study" className="sm:col-span-2">
        <Textarea
          id="case_study"
          name="case_study"
          rows={8}
          defaultValue={getFieldValue(
            state,
            "case_study",
            project.case_study ? JSON.stringify(project.case_study, null, 2) : "",
          )}
        />
        <FieldError errors={getFieldErrors(state, "case_study")} />
      </AdminField>
      <AdminField label="Repo URL" htmlFor="repo_url">
        <Input
          id="repo_url"
          name="repo_url"
          defaultValue={getFieldValue(state, "repo_url", project.repo_url ?? "")}
        />
      </AdminField>
      <AdminField label="Demo URL" htmlFor="demo_url">
        <Input
          id="demo_url"
          name="demo_url"
          defaultValue={getFieldValue(state, "demo_url", project.demo_url ?? "")}
        />
      </AdminField>
      <AdminField label="Cover image URL" htmlFor="cover_url" className="sm:col-span-2">
        <Input
          id="cover_url"
          name="cover_url"
          type="url"
          defaultValue={getFieldValue(
            state,
            "cover_url",
            (project as { cover_url?: string }).cover_url ?? "",
          )}
        />
      </AdminField>
      <AdminField label="Featured" className="sm:col-span-2">
        <label className="flex items-center gap-3 text-sm">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={Boolean(project.featured)}
            className="h-4 w-4"
          />
          Tampilkan sebagai featured
        </label>
      </AdminField>
      <AdminField label="Status publish" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={getFieldValue(state, "status", project.status ?? "published")}
          className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
    </div>
  );
}
