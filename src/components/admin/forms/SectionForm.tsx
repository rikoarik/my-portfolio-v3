"use client";

import { upsertSectionContent } from "@/app/admin/actions";
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
import {
  formatAboutStats,
  formatMarqueeItems,
  formatNavItems,
  formatProofStats,
} from "@/lib/admin/validation";

export type SectionData = {
  id?: string;
  section_key: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  meta?: unknown;
  status?: "draft" | "published";
};

function parseMeta(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  return meta as Record<string, unknown>;
}

function marqueeEntries(meta: Record<string, unknown>): string[] {
  const raw = formatMarqueeItems(meta.marquee_items);
  return raw ? raw.split("\n").filter(Boolean) : [];
}

function lineEntries(formatted: string): string[] {
  return formatted ? formatted.split("\n").filter(Boolean) : [];
}

function formIdFor(section: SectionData, isNew?: boolean) {
  return isNew ? "section-editor-new" : `section-editor-${section.id}`;
}

const basePreviewFields = [
  { name: "title", label: "Title" },
  { name: "subtitle", label: "Subtitle" },
  { name: "body", label: "Body" },
];

export function SectionForm({
  section,
  isNew,
  compact,
}: {
  section: SectionData;
  isNew?: boolean;
  compact?: boolean;
}) {
  const meta = parseMeta(section.meta);
  const sectionKey = section.section_key || "";
  const fid = formIdFor(section, isNew);
  const previewFields = [
    ...basePreviewFields,
    ...(sectionKey === "contact"
      ? [{ name: "marquee_items", label: "Marquee", type: "array" as const }]
      : []),
    ...(sectionKey === "proof"
      ? [{ name: "proof_stats", label: "Stats", type: "array" as const }]
      : []),
    ...(sectionKey === "nav"
      ? [{ name: "nav_items", label: "Nav items", type: "array" as const }]
      : []),
    ...(sectionKey === "about"
      ? [{ name: "about_stats", label: "About stats", type: "array" as const }]
      : []),
  ];

  const formContent = (
    <AdminFormCard
      title={isNew ? "Tambah section" : sectionKey || "Section"}
      description={isNew ? "Buat row section baru untuk homepage." : undefined}
    >
      <EditorForm action={upsertSectionContent} formId={fid} className="grid gap-3 sm:grid-cols-2">
        {section.id ? <input type="hidden" name="id" value={section.id} /> : null}
        <UnsavedChangesGuard formId={fid} />
        <SectionFormFields section={section} meta={meta} sectionKey={sectionKey} />
        <div className="sm:col-span-2">
          <SubmitButton pendingText="Menyimpan...">
            {isNew ? "Simpan" : "Update"}
          </SubmitButton>
        </div>
      </EditorForm>
    </AdminFormCard>
  );

  if (compact) {
    return formContent;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {formContent}
      <LivePreviewPane formId={fid} title="Section preview" fields={previewFields} />
    </div>
  );
}

function SectionFormFields({
  section,
  meta,
  sectionKey,
}: {
  section: SectionData;
  meta: Record<string, unknown>;
  sectionKey: string;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <>
      <AdminField label="Section key" htmlFor="section_key" className="sm:col-span-2">
        <Input
          id="section_key"
          name="section_key"
          required
          defaultValue={getFieldValue(state, "section_key", section.section_key ?? "")}
          placeholder="hero/about/contact/proof/nav"
        />
        <FieldError errors={getFieldErrors(state, "section_key")} />
      </AdminField>
      <AdminField label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          defaultValue={getFieldValue(state, "title", section.title ?? "")}
        />
      </AdminField>
      <AdminField label="Subtitle" htmlFor="subtitle">
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={getFieldValue(state, "subtitle", section.subtitle ?? "")}
        />
      </AdminField>
      <AdminField label="Body" htmlFor="body" className="sm:col-span-2">
        <Textarea
          id="body"
          name="body"
          rows={3}
          defaultValue={getFieldValue(state, "body", section.body ?? "")}
        />
      </AdminField>

      {(sectionKey === "about" || !sectionKey) && (
        <>
          <AdminField label="About headline" htmlFor="about_headline" className="sm:col-span-2">
            <Input
              id="about_headline"
              name="about_headline"
              defaultValue={getFieldValue(
                state,
                "about_headline",
                typeof meta.about_headline === "string" ? meta.about_headline : "",
              )}
            />
          </AdminField>
          <AdminField label="About intro" htmlFor="about_intro" className="sm:col-span-2">
            <Textarea
              id="about_intro"
              name="about_intro"
              rows={3}
              defaultValue={getFieldValue(
                state,
                "about_intro",
                typeof meta.about_intro === "string" ? meta.about_intro : "",
              )}
            />
          </AdminField>
          <AdminField label="Focus title" htmlFor="focus_title" className="sm:col-span-2">
            <Input
              id="focus_title"
              name="focus_title"
              defaultValue={getFieldValue(
                state,
                "focus_title",
                typeof meta.focus_title === "string" ? meta.focus_title : "",
              )}
            />
          </AdminField>
          <AdminField label="Focus body" htmlFor="focus_body" className="sm:col-span-2">
            <Textarea
              id="focus_body"
              name="focus_body"
              rows={3}
              defaultValue={getFieldValue(
                state,
                "focus_body",
                typeof meta.focus_body === "string" ? meta.focus_body : "",
              )}
            />
          </AdminField>
          <AdminField label="About stats" className="sm:col-span-2">
            <ListEditor
              name="about_stats"
              label="value | suffix | label per entry"
              initialEntries={lineEntries(formatAboutStats(meta.stats))}
            />
          </AdminField>
          <AdminField label="Craft title" htmlFor="craft_title" className="sm:col-span-2">
            <Input
              id="craft_title"
              name="craft_title"
              defaultValue={getFieldValue(
                state,
                "craft_title",
                typeof meta.craft_title === "string" ? meta.craft_title : "",
              )}
            />
          </AdminField>
          <AdminField label="Craft body" htmlFor="craft_body" className="sm:col-span-2">
            <Textarea
              id="craft_body"
              name="craft_body"
              rows={3}
              defaultValue={getFieldValue(
                state,
                "craft_body",
                typeof meta.craft_body === "string" ? meta.craft_body : "",
              )}
            />
          </AdminField>
        </>
      )}

      {(sectionKey === "contact" || !sectionKey) && (
        <>
          <AdminField label="Kicker" htmlFor="kicker" className="sm:col-span-2">
            <Input
              id="kicker"
              name="kicker"
              defaultValue={getFieldValue(
                state,
                "kicker",
                typeof meta.kicker === "string" ? meta.kicker : "",
              )}
            />
          </AdminField>
          <AdminField label="Talk label" htmlFor="talk_label">
            <Input
              id="talk_label"
              name="talk_label"
              defaultValue={getFieldValue(
                state,
                "talk_label",
                typeof meta.talk_label === "string" ? meta.talk_label : "",
              )}
            />
          </AdminField>
          <AdminField label="CV label" htmlFor="cv_label">
            <Input
              id="cv_label"
              name="cv_label"
              defaultValue={getFieldValue(
                state,
                "cv_label",
                typeof meta.cv_label === "string" ? meta.cv_label : "",
              )}
            />
          </AdminField>
          <AdminField label="Marquee items" className="sm:col-span-2">
            <ListEditor name="marquee_items" initialEntries={marqueeEntries(meta)} />
          </AdminField>
        </>
      )}

      {(sectionKey === "proof" || !sectionKey) && (
        <AdminField label="Proof stats" className="sm:col-span-2">
          <ListEditor
            name="proof_stats"
            label="value | label per entry"
            initialEntries={lineEntries(formatProofStats(meta.stats))}
          />
        </AdminField>
      )}

      {(sectionKey === "nav" || !sectionKey) && (
        <AdminField label="Nav items" className="sm:col-span-2">
          <ListEditor
            name="nav_items"
            label="label | href per entry"
            initialEntries={lineEntries(formatNavItems(meta.items))}
          />
        </AdminField>
      )}

      <details className="sm:col-span-2">
        <summary className="cursor-pointer text-sm font-medium text-[var(--muted-foreground)]">
          Advanced meta JSON
        </summary>
        <AdminField label="Meta JSON" htmlFor="meta" className="mt-2">
          <Textarea
            id="meta"
            name="meta"
            rows={3}
            defaultValue={getFieldValue(
              state,
              "meta",
              section.meta ? JSON.stringify(section.meta, null, 2) : "",
            )}
          />
          <FieldError errors={getFieldErrors(state, "meta")} />
        </AdminField>
      </details>

      <AdminField label="Status" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={getFieldValue(state, "status", section.status ?? "published")}
          className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
    </>
  );
}
