import { upsertProject } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">New project</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Fields array bisa JSON (`[&quot;a&quot;,&quot;b&quot;]`) atau 1 item per baris.
        </p>
      </div>

      <form action={upsertProject} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period_label">Period label</Label>
            <Input id="period_label" name="period_label" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={0} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="stack">Stack</Label>
            <Textarea id="stack" name="stack" rows={4} placeholder="Flutter\nBLoC\nDio" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bullets">Bullets</Label>
            <Textarea id="bullets" name="bullets" rows={6} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Textarea id="tags" name="tags" rows={3} placeholder="mobile\nfintech" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="case_study">Case study (JSON object)</Label>
            <Textarea
              id="case_study"
              name="case_study"
              rows={6}
              placeholder='{"problem":"...","constraints":["..."],"solution":"...","results":["..."]}'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo_url">Repo URL</Label>
            <Input id="repo_url" name="repo_url" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input id="demo_url" name="demo_url" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cover_url">Cover image URL</Label>
            <Input id="cover_url" name="cover_url" type="url" placeholder="https://…" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="featured">Featured</Label>
            <Input id="featured" name="featured" type="checkbox" className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status publish</Label>
            <select
              id="status"
              name="status"
              defaultValue="published"
              className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <SubmitButton pendingText="Creating...">Create</SubmitButton>
      </form>
    </div>
  );
}

