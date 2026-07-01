"use client";

import { useState } from "react";

import { upsertSectionContent } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
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

const FORM_ID = "section-editor-form";

const SECTION_KEY_OPTIONS = ["hero", "about", "proof", "contact", "nav"] as const;

const SECTION_KEY_LABELS: Record<string, string> = {
  hero: "Hero — landing atas",
  about: "About — tentang saya",
  proof: "Proof — strip statistik",
  contact: "Contact — footer",
  nav: "Nav — item navigasi",
};

const basePreviewFields = [
  { name: "title", label: "Title" },
  { name: "subtitle", label: "Subtitle" },
  { name: "body", label: "Body" },
];

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

function previewFieldsFor(sectionKey: string) {
  return [
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
}

export function SectionForm({
  section,
  isNew,
  title,
  headerActions,
  backHref = "/admin/dashboard/sections",
}: {
  section: SectionData;
  isNew?: boolean;
  title?: string;
  headerActions?: React.ReactNode;
  backHref?: string;
}) {
  const meta = parseMeta(section.meta);
  const [sectionKey, setSectionKey] = useState(section.section_key || "");
  const displayTitle = title ?? (sectionKey || "Section baru");

  return (
    <ModuleEditorShell
      form={
        <EditorForm
          action={upsertSectionContent}
          formId={FORM_ID}
          navigateOnCreate={isNew ? backHref : undefined}
          className="space-y-2"
        >
          {section.id ? <input type="hidden" name="id" value={section.id} /> : null}
          <UnsavedChangesGuard formId={FORM_ID} />
          <FormToolbar
            formId={FORM_ID}
            backHref={backHref}
            saveLabel={isNew ? "Simpan" : "Update"}
            title={displayTitle}
            headerActions={headerActions}
            showStatus
            statusDefault={(section.status ?? "published") as "draft" | "published"}
          />
          <FormTabs
            tabs={[
              {
                id: "utama",
                label: "Utama",
                content: (
                  <UtamaTab
                    section={section}
                    sectionKey={sectionKey}
                    onSectionKeyChange={setSectionKey}
                  />
                ),
              },
              {
                id: "meta",
                label: "Meta",
                content: <MetaTab meta={meta} sectionKey={sectionKey} />,
              },
              {
                id: "lanjutan",
                label: "Lanjutan",
                content: <LanjutanTab section={section} />,
              },
            ]}
          />
          <StickyFormActions
            formId={FORM_ID}
            backHref={backHref}
            saveLabel={isNew ? "Simpan" : "Update"}
          />
        </EditorForm>
      }
      preview={
        <LivePreviewPane
          formId={FORM_ID}
          title="Section preview"
          fields={previewFieldsFor(sectionKey)}
        />
      }
    />
  );
}

function UtamaTab({
  section,
  sectionKey,
  onSectionKeyChange,
}: {
  section: SectionData;
  sectionKey: string;
  onSectionKeyChange: (key: string) => void;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;
  const datalistId = `${FORM_ID}-section-key-options`;

  return (
    <div className="space-y-3">
      <AdminField
        label="Section key"
        hint="Pilih tipe section. Menentukan field di tab Meta."
        htmlFor="section_key"
      >
        <Input
          id="section_key"
          name="section_key"
          required
          list={datalistId}
          defaultValue={getFieldValue(state, "section_key", section.section_key ?? "")}
          placeholder="hero / about / proof / contact / nav"
          onChange={(e) => onSectionKeyChange(e.target.value.trim())}
        />
        <datalist id={datalistId}>
          {SECTION_KEY_OPTIONS.map((key) => (
            <option key={key} value={key}>
              {SECTION_KEY_LABELS[key]}
            </option>
          ))}
        </datalist>
        <FieldError errors={getFieldErrors(state, "section_key")} />
      </AdminField>

      {sectionKey && SECTION_KEY_LABELS[sectionKey] ? (
        <p className="text-xs text-[var(--muted-foreground)]">{SECTION_KEY_LABELS[sectionKey]}</p>
      ) : null}

      <AdminField label="Title" hint="Heading utama." htmlFor="title">
        <Input
          id="title"
          name="title"
          defaultValue={getFieldValue(state, "title", section.title ?? "")}
        />
      </AdminField>
      <AdminField label="Subtitle" hint="Sub-heading." htmlFor="subtitle">
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={getFieldValue(state, "subtitle", section.subtitle ?? "")}
        />
      </AdminField>
      <AdminField label="Body" hint="Konten utama. Multiline OK." htmlFor="body">
        <Textarea
          id="body"
          name="body"
          rows={4}
          defaultValue={getFieldValue(state, "body", section.body ?? "")}
        />
      </AdminField>
    </div>
  );
}

function MetaTab({
  meta,
  sectionKey,
}: {
  meta: Record<string, unknown>;
  sectionKey: string;
}) {
  if (!sectionKey) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted-foreground)]">
        Pilih section_key di tab Utama dulu.
      </div>
    );
  }

  if (sectionKey === "hero") {
    return <HeroMetaFields meta={meta} />;
  }

  if (sectionKey === "about") {
    return <AboutMetaFields meta={meta} />;
  }
  if (sectionKey === "contact") {
    return <ContactMetaFields meta={meta} />;
  }
  if (sectionKey === "proof") {
    return <ProofMetaFields meta={meta} />;
  }
  if (sectionKey === "nav") {
    return <NavMetaFields meta={meta} />;
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted-foreground)]">
      Tidak ada field meta khusus untuk section_key &quot;{sectionKey}&quot;. Pakai tab Lanjutan
      untuk JSON.
    </div>
  );
}

function HeroMetaFields({ meta }: { meta: Record<string, unknown> }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="space-y-3">
      <AdminField
        label="Brand nav"
        hint="Teks brand di pill nav. Kosongkan untuk default i18n."
        htmlFor="hero_brand"
      >
        <Input
          id="hero_brand"
          name="hero_brand"
          defaultValue={getFieldValue(
            state,
            "hero_brand",
            typeof meta.brand === "string" ? meta.brand : "",
          )}
        />
      </AdminField>
      <AdminField label="CTA label" hint="Teks tombol hero." htmlFor="hero_cta_label">
        <Input
          id="hero_cta_label"
          name="hero_cta_label"
          defaultValue={getFieldValue(
            state,
            "hero_cta_label",
            typeof meta.cta_label === "string" ? meta.cta_label : "",
          )}
        />
      </AdminField>
      <AdminField label="CTA href" hint="Link tombol, mis. #projects." htmlFor="hero_cta_href">
        <Input
          id="hero_cta_href"
          name="hero_cta_href"
          defaultValue={getFieldValue(
            state,
            "hero_cta_href",
            typeof meta.cta_href === "string" ? meta.cta_href : "",
          )}
        />
      </AdminField>

      <div className="rounded-lg border border-[var(--border)] p-3 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Ukuran teks
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          Pakai rem atau px. Angka saja dianggap rem (contoh: 2 → 2rem).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            label="Title min (mobile)"
            hint="Default: 2rem"
            htmlFor="hero_title_size_mobile"
          >
            <Input
              id="hero_title_size_mobile"
              name="hero_title_size_mobile"
              placeholder="2rem"
              defaultValue={getFieldValue(
                state,
                "hero_title_size_mobile",
                typeof meta.hero_title_size_mobile === "string" ? meta.hero_title_size_mobile : "",
              )}
            />
          </AdminField>
          <AdminField
            label="Title max (desktop)"
            hint="Default: 5.5rem"
            htmlFor="hero_title_size_desktop"
          >
            <Input
              id="hero_title_size_desktop"
              name="hero_title_size_desktop"
              placeholder="5.5rem"
              defaultValue={getFieldValue(
                state,
                "hero_title_size_desktop",
                typeof meta.hero_title_size_desktop === "string" ? meta.hero_title_size_desktop : "",
              )}
            />
          </AdminField>
          <AdminField label="Role / subtitle" hint="Default: 0.65rem" htmlFor="hero_role_size">
            <Input
              id="hero_role_size"
              name="hero_role_size"
              placeholder="0.65rem"
              defaultValue={getFieldValue(
                state,
                "hero_role_size",
                typeof meta.hero_role_size === "string" ? meta.hero_role_size : "",
              )}
            />
          </AdminField>
          <AdminField label="Tagline" hint="Default: 0.9rem" htmlFor="hero_tagline_size">
            <Input
              id="hero_tagline_size"
              name="hero_tagline_size"
              placeholder="0.9rem"
              defaultValue={getFieldValue(
                state,
                "hero_tagline_size",
                typeof meta.hero_tagline_size === "string" ? meta.hero_tagline_size : "",
              )}
            />
          </AdminField>
          <AdminField label="CTA button" hint="Default: 0.68rem" htmlFor="hero_cta_size">
            <Input
              id="hero_cta_size"
              name="hero_cta_size"
              placeholder="0.68rem"
              defaultValue={getFieldValue(
                state,
                "hero_cta_size",
                typeof meta.hero_cta_size === "string" ? meta.hero_cta_size : "",
              )}
            />
          </AdminField>
        </div>
      </div>
    </div>
  );
}

function AboutMetaFields({ meta }: { meta: Record<string, unknown> }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="space-y-3">
      <AdminField
        label="About headline"
        hint="Judul besar section About. Kosongkan untuk default."
        htmlFor="about_headline"
      >
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
      <AdminField label="About intro" hint="Paragraf intro." htmlFor="about_intro">
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
      <AdminField label="Focus title" hint="Judul blok 'Domain Focus'." htmlFor="focus_title">
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
      <AdminField label="Focus body" hint="Deskripsi domain focus." htmlFor="focus_body">
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
      <AdminField
        label="About stats"
        hint="Format: nilai | suffix | label per baris. Contoh: '2 | + | Years Mobile'."
      >
        <ListEditor
          name="about_stats"
          label="value | suffix | label per entry"
          initialEntries={lineEntries(formatAboutStats(meta.stats))}
        />
      </AdminField>
      <AdminField label="Craft title" hint="Judul blok 'Delivery'." htmlFor="craft_title">
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
      <AdminField label="Craft body" hint="Deskripsi delivery." htmlFor="craft_body">
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
    </div>
  );
}

function ContactMetaFields({ meta }: { meta: Record<string, unknown> }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="space-y-3">
      <AdminField
        label="Kicker"
        hint="Label kecil di atas heading footer. Contoh: 'Contact'."
        htmlFor="kicker"
      >
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
      <AdminField label="Talk label" hint="Teks tombol email utama." htmlFor="talk_label">
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
      <AdminField label="CV label" hint="Teks tombol unduh CV." htmlFor="cv_label">
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
      <AdminField
        label="Marquee items"
        hint="Tek per baris. Teks berjalan di footer."
      >
        <ListEditor name="marquee_items" initialEntries={marqueeEntries(meta)} />
      </AdminField>
    </div>
  );
}

function ProofMetaFields({ meta }: { meta: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <AdminField
        label="Proof stats"
        hint="Format: nilai | label per baris. Contoh: '15+ | Production Apps'."
      >
        <ListEditor
          name="proof_stats"
          label="value | label per entry"
          initialEntries={lineEntries(formatProofStats(meta.stats))}
        />
      </AdminField>
    </div>
  );
}

function NavMetaFields({ meta }: { meta: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <AdminField
        label="Nav items"
        hint="Format: label | href per baris. Contoh: 'Work | #projects'."
      >
        <ListEditor
          name="nav_items"
          label="label | href per entry"
          initialEntries={lineEntries(formatNavItems(meta.items))}
        />
      </AdminField>
    </div>
  );
}

function LanjutanTab({ section }: { section: SectionData }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
      <p className="text-sm font-medium text-amber-700">⚠ Advanced meta JSON</p>
      <p className="text-xs text-[var(--muted-foreground)]">
        Edit JSON mentah hanya untuk field yang tidak punya input di tab Meta. Perubahan di sini
        bisa menghapus nilai field structured — pakai dengan hati-hati.
      </p>
      <AdminField label="Meta JSON" htmlFor="meta">
        <Textarea
          id="meta"
          name="meta"
          rows={6}
          defaultValue={getFieldValue(
            state,
            "meta",
            section.meta ? JSON.stringify(section.meta, null, 2) : "",
          )}
        />
        <FieldError errors={getFieldErrors(state, "meta")} />
      </AdminField>
    </div>
  );
}
