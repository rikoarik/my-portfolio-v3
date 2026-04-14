import { notFound } from "next/navigation";

import { upsertProject } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("projects").select("*").eq("id", id).maybeSingle()
    : { data: null };

  const fallback = PORTFOLIO_SEED.projects.find((p) => p.id === id) ?? null;
  const p = data ?? fallback;
  if (!p) return notFound();

  const stack = Array.isArray(p.stack) ? p.stack : p.stack ?? [];
  const bullets = Array.isArray(p.bullets) ? p.bullets : p.bullets ?? [];
  const tags = Array.isArray(p.tags) ? p.tags : p.tags ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Edit project</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          ID: <code className="font-mono-meta">{id}</code>
        </p>
      </div>

      <form action={upsertProject} className="space-y-6">
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={p.title ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" defaultValue={p.subtitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period_label">Period label</Label>
            <Input
              id="period_label"
              name="period_label"
              defaultValue={p.period_label ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={p.sort_order ?? 0}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="stack">Stack</Label>
            <Textarea
              id="stack"
              name="stack"
              rows={4}
              defaultValue={JSON.stringify(stack, null, 2)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bullets">Bullets</Label>
            <Textarea
              id="bullets"
              name="bullets"
              rows={6}
              defaultValue={JSON.stringify(bullets, null, 2)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Textarea
              id="tags"
              name="tags"
              rows={3}
              defaultValue={JSON.stringify(tags, null, 2)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="case_study">Case study (JSON)</Label>
            <Textarea
              id="case_study"
              name="case_study"
              rows={8}
              defaultValue={p.case_study ? JSON.stringify(p.case_study, null, 2) : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo_url">Repo URL</Label>
            <Input id="repo_url" name="repo_url" defaultValue={p.repo_url ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input id="demo_url" name="demo_url" defaultValue={p.demo_url ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cover_url">Cover image URL (card + modal)</Label>
            <Input
              id="cover_url"
              name="cover_url"
              type="url"
              placeholder="https://…"
              defaultValue={
                typeof (p as { cover_url?: string | null }).cover_url === "string"
                  ? (p as { cover_url: string }).cover_url
                  : ""
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="flex items-center gap-3 text-sm">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={Boolean(p.featured)}
                className="h-4 w-4"
              />
              Featured
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status publish</Label>
            <select
              id="status"
              name="status"
              defaultValue={p.status ?? "published"}
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

