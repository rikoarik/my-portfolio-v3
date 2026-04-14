import { upsertExperience } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">New experience</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Bullets bisa JSON array atau per baris.
        </p>
      </div>

      <form action={upsertExperience} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment_type">Employment type</Label>
            <Input id="employment_type" name="employment_type" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" name="start_date" placeholder="2025-01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" name="end_date" placeholder="2026-02 (blank = present)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={0} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bullets">Bullets</Label>
            <Textarea id="bullets" name="bullets" rows={7} />
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

