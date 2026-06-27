"use client";

import { updateSiteProfile } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import {
  EditorForm,
  getFieldErrors,
  getFieldValue,
  useEditorFormState,
} from "@/components/admin/EditorForm";
import { FieldError } from "@/components/admin/FieldError";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FORM_ID = "profile-editor-form";

const PREVIEW_FIELDS = [
  { name: "full_name", label: "Nama" },
  { name: "title", label: "Title" },
  { name: "tagline", label: "Tagline" },
  { name: "location", label: "Lokasi" },
];

type ProfileData = {
  full_name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  cv_url?: string | null;
  og_description?: string | null;
};

export function ProfileForm({ initial }: { initial: ProfileData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminFormCard title="Profil">
        <EditorForm action={updateSiteProfile} formId={FORM_ID} className="space-y-6">
          <UnsavedChangesGuard formId={FORM_ID} />
          <ProfileFields initial={initial} />
          <SubmitButton pendingText="Menyimpan...">Simpan</SubmitButton>
        </EditorForm>
      </AdminFormCard>
      <LivePreviewPane formId={FORM_ID} title="Profile preview" fields={PREVIEW_FIELDS} />
    </div>
  );
}

function ProfileFields({ initial }: { initial: ProfileData }) {
  const ctx = useEditorFormState();
  const state = ctx?.state ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Nama lengkap" htmlFor="full_name" className="sm:col-span-2">
        <Input
          id="full_name"
          name="full_name"
          required
          defaultValue={getFieldValue(state, "full_name", initial.full_name)}
        />
        <FieldError errors={getFieldErrors(state, "full_name")} />
      </AdminField>
      <AdminField label="Title" htmlFor="title" className="sm:col-span-2">
        <Input
          id="title"
          name="title"
          required
          defaultValue={getFieldValue(state, "title", initial.title)}
        />
      </AdminField>
      <AdminField label="Tagline" htmlFor="tagline" className="sm:col-span-2">
        <Input
          id="tagline"
          name="tagline"
          defaultValue={getFieldValue(state, "tagline", initial.tagline)}
        />
      </AdminField>
      <AdminField label="Lokasi" htmlFor="location">
        <Input
          id="location"
          name="location"
          defaultValue={getFieldValue(state, "location", initial.location)}
        />
      </AdminField>
      <AdminField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={getFieldValue(state, "email", initial.email)}
        />
      </AdminField>
      <AdminField label="Phone" htmlFor="phone">
        <Input
          id="phone"
          name="phone"
          defaultValue={getFieldValue(state, "phone", initial.phone ?? "")}
        />
      </AdminField>
      <AdminField label="GitHub URL" htmlFor="github_url">
        <Input
          id="github_url"
          name="github_url"
          defaultValue={getFieldValue(state, "github_url", initial.github_url ?? "")}
        />
      </AdminField>
      <AdminField label="LinkedIn URL" htmlFor="linkedin_url">
        <Input
          id="linkedin_url"
          name="linkedin_url"
          defaultValue={getFieldValue(state, "linkedin_url", initial.linkedin_url ?? "")}
        />
      </AdminField>
      <AdminField label="Website URL" htmlFor="website_url">
        <Input
          id="website_url"
          name="website_url"
          defaultValue={getFieldValue(state, "website_url", initial.website_url ?? "")}
        />
      </AdminField>
      <AdminField label="CV URL" htmlFor="cv_url">
        <Input
          id="cv_url"
          name="cv_url"
          defaultValue={getFieldValue(state, "cv_url", initial.cv_url ?? "")}
        />
      </AdminField>
      <AdminField label="OG description" htmlFor="og_description" className="sm:col-span-2">
        <Textarea
          id="og_description"
          name="og_description"
          rows={3}
          defaultValue={getFieldValue(state, "og_description", initial.og_description ?? "")}
        />
      </AdminField>
    </div>
  );
}
