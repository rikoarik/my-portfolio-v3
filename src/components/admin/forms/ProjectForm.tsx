"use client";

import { upsertProject } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { CaseStudyEditor } from "@/components/admin/forms/CaseStudyEditor";
import { CoverUrlField } from "@/components/admin/forms/CoverUrlField";
import {
  FormTabs,
  FormToolbar,
  StickyFormActions,
} from "@/components/admin/forms/FormHelpers";
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
import type { MediaOption } from "@/lib/admin/media-options";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/portfolio";

const FORM_ID = "project-editor-form";

const PREVIEW_FIELDS = [
  { name: "title", label: "Title" },
  { name: "subtitle", label: "Subtitle", type: "text" as const },
  { name: "stack", label: "Stack", type: "array" as const },
  { name: "cover_url", label: "Cover" },
  { name: "status", label: "Status" },
];

export function ProjectForm({
  project,
  isNew,
  mediaOptions = [],
  backHref = "/admin/dashboard/projects",
  title,
  headerActions,
}: {
  project: Partial<Project> & { id?: string };
  isNew?: boolean;
  mediaOptions?: MediaOption[];
  backHref?: string;
  title?: string;
  headerActions?: React.ReactNode;
}) {
  const stack = Array.isArray(project.stack) ? project.stack : [];
  const bullets = Array.isArray(project.bullets) ? project.bullets : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const coverUrl = (project as { cover_url?: string }).cover_url ?? "";

  return (
    <ModuleEditorShell
      form={
        <EditorForm
          action={upsertProject}
          formId={FORM_ID}
          navigateOnCreate={isNew ? "/admin/dashboard/projects" : undefined}
        >
          {project.id ? <input type="hidden" name="id" value={project.id} /> : null}
          <input type="hidden" name="sort_order" value={String(project.sort_order ?? 0)} />
          <UnsavedChangesGuard formId={FORM_ID} />
          <FormToolbar
            formId={FORM_ID}
            backHref={backHref}
            title={title}
            headerActions={headerActions}
            saveLabel="Simpan"
            showStatus
            showFeatured
            statusDefault={(project.status ?? "draft") as "draft" | "published"}
            featuredDefault={Boolean(project.featured)}
          />
          <ProjectFormFields
            project={project}
            stack={stack}
            bullets={bullets}
            tags={tags}
            coverUrl={coverUrl}
            mediaOptions={mediaOptions}
            isNew={isNew}
          />
          <StickyFormActions formId={FORM_ID} backHref={backHref} saveLabel="Simpan" />
        </EditorForm>
      }
      preview={
        <LivePreviewPane formId={FORM_ID} title="Preview" fields={PREVIEW_FIELDS} />
      }
    />
  );
}

function ProjectFormFields({
  project,
  stack,
  bullets,
  tags,
  coverUrl,
  mediaOptions,
  isNew,
}: {
  project: Partial<Project> & { id?: string };
  stack: string[];
  bullets: string[];
  tags: string[];
  coverUrl: string;
  mediaOptions: MediaOption[];
  isNew?: boolean;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;
  const cover = getFieldValue(state, "cover_url", coverUrl);

  const utama = (
    <div className="grid gap-1.5 sm:grid-cols-2">
      <AdminField label="Judul" htmlFor="title" className="sm:col-span-2">
        <Input
          id="title"
          name="title"
          required
          autoFocus={isNew}
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
      <div className="sm:col-span-2">
        <CoverUrlField key={cover} defaultValue={cover} mediaOptions={mediaOptions} compact />
      </div>
    </div>
  );

  const konten = (
    <div className="grid gap-1.5 md:grid-cols-2">
      <AdminField label="Stack">
        <ListEditor name="stack" initialEntries={stack} />
      </AdminField>
      <AdminField label="Bullets">
        <ListEditor name="bullets" initialEntries={bullets} />
      </AdminField>
    </div>
  );

  const lanjutan = (
    <div className="space-y-1.5">
      <div className="grid gap-1.5 sm:grid-cols-2">
        <AdminField label="Period" htmlFor="period_label">
          <Input
            id="period_label"
            name="period_label"
            defaultValue={getFieldValue(state, "period_label", project.period_label ?? "")}
          />
        </AdminField>
        <AdminField label="Tags">
          <ListEditor name="tags" initialEntries={tags} />
        </AdminField>
        <AdminField label="Repo" htmlFor="repo_url">
          <Input
            id="repo_url"
            name="repo_url"
            type="url"
            defaultValue={getFieldValue(state, "repo_url", project.repo_url ?? "")}
          />
        </AdminField>
        <AdminField label="Demo" htmlFor="demo_url">
          <Input
            id="demo_url"
            name="demo_url"
            type="url"
            defaultValue={getFieldValue(state, "demo_url", project.demo_url ?? "")}
          />
        </AdminField>
      </div>
      <CaseStudyEditor
        initial={project.case_study ?? null}
        errors={getFieldErrors(state, "case_study")}
        compact
      />
    </div>
  );

  return (
    <FormTabs
      defaultTab="utama"
      tabs={[
        { id: "utama", label: "Utama", content: utama },
        { id: "konten", label: "Stack", content: konten },
        { id: "lanjutan", label: "Lanjutan", content: lanjutan },
      ]}
    />
  );
}
