import { notFound } from "next/navigation";

import { upsertExperience } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("experiences").select("*").eq("id", id).maybeSingle()
    : { data: null };

  const fallback = PORTFOLIO_SEED.experiences.find((e) => e.id === id) ?? null;
  const e = data ?? fallback;
  if (!e) return notFound();

  const bullets = Array.isArray(e.bullets) ? e.bullets : e.bullets ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Edit experience</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          ID: <code className="font-mono-meta">{id}</code>
        </p>
      </div>

      <form action={upsertExperience} className="space-y-6">
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required defaultValue={e.company ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required defaultValue={e.role ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={e.location ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment_type">Employment type</Label>
            <Input
              id="employment_type"
              name="employment_type"
              defaultValue={e.employment_type ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" name="start_date" defaultValue={e.start_date ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" name="end_date" defaultValue={e.end_date ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={e.sort_order ?? 0}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bullets">Bullets</Label>
            <Textarea
              id="bullets"
              name="bullets"
              rows={7}
              defaultValue={JSON.stringify(bullets, null, 2)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status publish</Label>
            <select
              id="status"
              name="status"
              defaultValue={e.status ?? "published"}
              className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <SubmitButton pendingText="Saving...">Save</SubmitButton>
      </form>
    </div>
  );
}

