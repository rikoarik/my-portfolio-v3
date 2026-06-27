import { deleteSkill, deleteSkillGroup, reorderSkillGroup, upsertSkill, upsertSkillGroup } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ReorderControls } from "@/components/admin/ReorderControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SkillGroup } from "@/types/portfolio";

export const dynamic = "force-dynamic";

async function loadSkillGroups(): Promise<SkillGroup[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return PORTFOLIO_SEED.skill_groups;

  const { data: groupRows } = await supabase
    .from("skill_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: skillRows } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  const skillsByGroup = new Map<string, { id: string; name: string; sort_order: number }[]>();
  for (const skill of skillRows ?? []) {
    const gid = skill.group_id as string;
    const list = skillsByGroup.get(gid) ?? [];
    list.push({ id: skill.id, name: skill.name, sort_order: skill.sort_order ?? 0 });
    skillsByGroup.set(gid, list);
  }

  if (!groupRows?.length) return PORTFOLIO_SEED.skill_groups;

  return groupRows.map((group) => ({
    id: group.id,
    name: group.name,
    sort_order: group.sort_order ?? 0,
    skills: (skillsByGroup.get(group.id) ?? []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export default async function AdminSkillsPage() {
  const groups = await loadSkillGroups();

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Skills"
        description="Kelola skill groups dan daftar skill per group."
      />

      <Card className="admin-card border-[var(--border)] bg-[var(--card)] shadow-none">
        <CardHeader>
          <CardTitle>Tambah skill group</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminActionForm action={upsertSkillGroup} formId="skill-group-new" className="flex flex-wrap items-end gap-3">
            <UnsavedChangesGuard formId="skill-group-new" />
            <input
              name="name"
              placeholder="Group name"
              className="min-w-[12rem] flex-1 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
              required
            />
            <input
              name="sort_order"
              type="number"
              defaultValue={groups.length}
              className="w-24 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
            />
            <SubmitButton pendingText="Menyimpan...">Tambah group</SubmitButton>
          </AdminActionForm>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {groups.map((group, index) => (
          <Card key={group.id} className="admin-card border-[var(--border)] bg-[var(--card)] shadow-none">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <AdminActionForm action={upsertSkillGroup} formId={`skill-group-${group.id}`} className="grid gap-3 sm:grid-cols-3">
                  <UnsavedChangesGuard formId={`skill-group-${group.id}`} />
                  <input type="hidden" name="id" value={group.id} />
                  <input
                    name="name"
                    defaultValue={group.name}
                    className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
                    required
                  />
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={group.sort_order}
                    className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                  />
                  <SubmitButton variant="outline" size="sm" pendingText="Updating...">
                    Update group
                  </SubmitButton>
                </AdminActionForm>
                <p className="font-mono-meta mt-2 text-xs text-[var(--muted-foreground)]">
                  sort {group.sort_order} · {group.skills.length} skills
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ReorderControls
                  id={group.id}
                  index={index}
                  total={groups.length}
                  module="Skills"
                  reorderAction={reorderSkillGroup}
                />
                <DeleteButton
                  id={group.id}
                  title={group.name}
                  deleteAction={deleteSkillGroup}
                  label="Delete group"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-col gap-2 rounded-md border border-[var(--border)]/60 p-3 sm:flex-row sm:items-center"
                >
                  <AdminActionForm action={upsertSkill} formId={`skill-${skill.id}`} className="flex flex-1 flex-wrap items-center gap-2">
                    <UnsavedChangesGuard formId={`skill-${skill.id}`} />
                    <input type="hidden" name="id" value={skill.id} />
                    <input type="hidden" name="group_id" value={group.id} />
                    <input
                      name="name"
                      defaultValue={skill.name}
                      className="min-w-[10rem] flex-1 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                      required
                    />
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={skill.sort_order}
                      className="w-20 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                    />
                    <SubmitButton variant="outline" size="sm" pendingText="...">
                      Save
                    </SubmitButton>
                  </AdminActionForm>
                  <DeleteButton
                    id={skill.id}
                    title={skill.name}
                    deleteAction={deleteSkill}
                    label="Delete"
                  />
                </div>
              ))}

              <AdminActionForm action={upsertSkill} formId={`skill-new-${group.id}`} className="flex flex-wrap items-end gap-2 border-t border-[var(--border)]/60 pt-3">
                <UnsavedChangesGuard formId={`skill-new-${group.id}`} />
                <input type="hidden" name="group_id" value={group.id} />
                <input
                  name="name"
                  placeholder="New skill"
                  className="min-w-[10rem] flex-1 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                  required
                />
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={group.skills.length}
                  className="w-20 rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                />
                <SubmitButton size="sm" pendingText="Adding...">
                  Add skill
                </SubmitButton>
              </AdminActionForm>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
