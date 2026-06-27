"use client";

import { upsertLoaderSettings } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { EditorForm } from "@/components/admin/EditorForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FORM_ID = "loader-editor-form";

export function LoaderForm({
  initial,
}: {
  initial: {
    label: string;
    messages: string;
    text_animation: string;
    background_color: string;
    text_color: string;
  };
}) {
  return (
    <AdminFormCard title="Loader style" description="Label, animasi, pesan, dan warna.">
      <EditorForm action={upsertLoaderSettings} formId={FORM_ID} className="grid gap-4 sm:grid-cols-2">
        <UnsavedChangesGuard formId={FORM_ID} />
        <AdminField label="Loader label" htmlFor="label">
          <Input id="label" name="label" defaultValue={initial.label} required />
        </AdminField>
        <AdminField label="Text animation" htmlFor="text_animation">
          <select
            id="text_animation"
            name="text_animation"
            defaultValue={initial.text_animation}
            className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
          >
            <option value="fade">fade</option>
            <option value="slide-up">slide-up</option>
            <option value="pulse">pulse</option>
            <option value="typewriter">typewriter</option>
            <option value="flip">flip</option>
            <option value="glitch">glitch</option>
          </select>
        </AdminField>
        <AdminField label="Background color" htmlFor="background_color">
          <Input id="background_color" name="background_color" defaultValue={initial.background_color} required />
        </AdminField>
        <AdminField label="Text color" htmlFor="text_color">
          <Input id="text_color" name="text_color" defaultValue={initial.text_color} required />
        </AdminField>
        <AdminField label="Messages (1 per line)" htmlFor="messages" className="sm:col-span-2">
          <Textarea id="messages" name="messages" rows={5} defaultValue={initial.messages} required />
        </AdminField>
        <div className="sm:col-span-2">
          <SubmitButton pendingText="Menyimpan...">Simpan</SubmitButton>
        </div>
      </EditorForm>
    </AdminFormCard>
  );
}
