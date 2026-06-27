"use client";

import { upsertSeoPage, upsertSeoSettings } from "@/app/admin/actions";
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

const SETTINGS_FORM_ID = "seo-settings-form";
const CREATE_FORM_ID = "seo-page-create-form";

function SeoSettingsFields({
  setting,
  currentLandingThemePreset,
}: {
  setting: {
    id?: string;
    site_title?: string;
    title_template?: string;
    default_description?: string | null;
    default_og_image_url?: string | null;
    default_robots?: string | null;
    metadata?: unknown;
    status?: string;
  } | null;
  currentLandingThemePreset: string;
}) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <>
      <input type="hidden" name="id" value={setting?.id ?? ""} />
      <AdminField label="Landing color preset" htmlFor="landing_theme_preset" className="sm:col-span-2">
        <select
          id="landing_theme_preset"
          name="landing_theme_preset"
          defaultValue={getFieldValue(state, "landing_theme_preset", currentLandingThemePreset)}
          className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="ember-night">Ember Night</option>
          <option value="forest-hearth">Forest Hearth</option>
          <option value="cocoa-slate">Cocoa Slate</option>
          <option value="dusk-mocha">Dusk Mocha</option>
          <option value="sage-mist">Sage Mist</option>
          <option value="linen-dawn">Linen Dawn</option>
          <option value="rose-clay">Rose Clay</option>
          <option value="ocean-paper">Ocean Paper</option>
          <option value="amber-fog">Amber Fog</option>
          <option value="pine-smoke">Pine Smoke</option>
          <option value="tyrian-banana">Tyrian + Banana Cream</option>
          <option value="moss-cloud">Moss Velvet + Cloud Milk</option>
          <option value="golden-parchment">Goldenrod + Parchment</option>
          <option value="amber-mirage">Amber Smoke + Blue Mirage</option>
          <option value="pistachio-espresso">Pistachio Frost + Midnight espresso</option>
          <option value="matcha-coal">Matcha Mist + Dusty Coal</option>
        </select>
      </AdminField>
      <AdminField label="Site title" htmlFor="site_title">
        <input
          id="site_title"
          name="site_title"
          defaultValue={getFieldValue(state, "site_title", setting?.site_title ?? "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          required
        />
        <FieldError errors={getFieldErrors(state, "site_title")} />
      </AdminField>
      <AdminField label="Title template" htmlFor="title_template">
        <input
          id="title_template"
          name="title_template"
          defaultValue={getFieldValue(state, "title_template", setting?.title_template ?? "%s — Portfolio")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          required
        />
      </AdminField>
      <AdminField label="Default description" htmlFor="default_description" className="sm:col-span-2">
        <textarea
          id="default_description"
          name="default_description"
          defaultValue={getFieldValue(state, "default_description", setting?.default_description ?? "")}
          rows={3}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Default OG image URL" htmlFor="default_og_image_url" className="sm:col-span-2">
        <input
          id="default_og_image_url"
          name="default_og_image_url"
          defaultValue={getFieldValue(state, "default_og_image_url", setting?.default_og_image_url ?? "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Default robots" htmlFor="default_robots">
        <input
          id="default_robots"
          name="default_robots"
          defaultValue={getFieldValue(state, "default_robots", setting?.default_robots ?? "index,follow")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Status" htmlFor="seo-settings-status">
        <select
          id="seo-settings-status"
          name="status"
          defaultValue={getFieldValue(state, "status", setting?.status ?? "published")}
          className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
      <AdminField label="Metadata JSON" htmlFor="seo-settings-metadata" className="sm:col-span-2">
        <textarea
          id="seo-settings-metadata"
          name="metadata"
          defaultValue={getFieldValue(
            state,
            "metadata",
            setting?.metadata ? JSON.stringify(setting.metadata, null, 2) : "{}",
          )}
          rows={3}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
        <FieldError errors={getFieldErrors(state, "metadata")} />
      </AdminField>
    </>
  );
}

export function SeoSettingsForm({
  setting,
  currentLandingThemePreset,
}: {
  setting: {
    id?: string;
    site_title?: string;
    title_template?: string;
    default_description?: string | null;
    default_og_image_url?: string | null;
    default_robots?: string | null;
    metadata?: unknown;
    status?: string;
  } | null;
  currentLandingThemePreset: string;
}) {
  return (
    <AdminFormCard title="SEO global">
      <EditorForm action={upsertSeoSettings} formId={SETTINGS_FORM_ID} className="grid gap-3 sm:grid-cols-2">
        <UnsavedChangesGuard formId={SETTINGS_FORM_ID} />
        <SeoSettingsFields setting={setting} currentLandingThemePreset={currentLandingThemePreset} />
        <SubmitButton pendingText="Menyimpan SEO...">Simpan global SEO</SubmitButton>
      </EditorForm>
    </AdminFormCard>
  );
}

function SeoPageCreateFields() {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <>
      <AdminField label="Page key" htmlFor="seo-create-page_key">
        <input
          id="seo-create-page_key"
          name="page_key"
          placeholder="home, projects, about"
          defaultValue={getFieldValue(state, "page_key", "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
          required
        />
        <FieldError errors={getFieldErrors(state, "page_key")} />
      </AdminField>
      <AdminField label="Title" htmlFor="seo-create-title">
        <input
          id="seo-create-title"
          name="title"
          placeholder="Title override"
          defaultValue={getFieldValue(state, "title", "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Description" htmlFor="seo-create-description" className="sm:col-span-2">
        <textarea
          id="seo-create-description"
          name="description"
          rows={3}
          defaultValue={getFieldValue(state, "description", "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Canonical URL" htmlFor="seo-create-canonical_url">
        <input
          id="seo-create-canonical_url"
          name="canonical_url"
          placeholder="https://..."
          defaultValue={getFieldValue(state, "canonical_url", "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="OG image URL" htmlFor="seo-create-og_image_url">
        <input
          id="seo-create-og_image_url"
          name="og_image_url"
          placeholder="https://..."
          defaultValue={getFieldValue(state, "og_image_url", "")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Robots" htmlFor="seo-create-robots">
        <input
          id="seo-create-robots"
          name="robots"
          placeholder="index,follow"
          defaultValue={getFieldValue(state, "robots", "index,follow")}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
      </AdminField>
      <AdminField label="Status" htmlFor="seo-create-status">
        <select
          id="seo-create-status"
          name="status"
          defaultValue={getFieldValue(state, "status", "published")}
          className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </AdminField>
      <AdminField label="Metadata JSON" htmlFor="seo-create-metadata" className="sm:col-span-2">
        <textarea
          id="seo-create-metadata"
          name="metadata"
          defaultValue={getFieldValue(state, "metadata", "{}")}
          rows={3}
          className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
        />
        <FieldError errors={getFieldErrors(state, "metadata")} />
      </AdminField>
    </>
  );
}

export function SeoPageCreateForm() {
  return (
    <AdminFormCard title="Tambah SEO page">
      <EditorForm action={upsertSeoPage} formId={CREATE_FORM_ID} className="grid gap-3 sm:grid-cols-2">
        <UnsavedChangesGuard formId={CREATE_FORM_ID} />
        <SeoPageCreateFields />
        <SubmitButton pendingText="Menambah...">Tambah</SubmitButton>
      </EditorForm>
    </AdminFormCard>
  );
}
