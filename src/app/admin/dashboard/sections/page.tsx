import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSectionTabs } from "@/components/admin/AdminSectionTabs";
import { SectionCreateForm, SectionsList } from "@/components/admin/SectionsList";
import type { SectionData } from "@/components/admin/forms/SectionForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const activeTab = sp.tab ?? "all";
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("section_content").select("*").order("section_key", { ascending: true })
    : { data: [] };
  const rows = (data as SectionData[]) ?? [];

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Sections"
        description="Kelola copy tiap section homepage."
        actions={<AdminSectionTabs active={activeTab} />}
      />
      <SectionCreateForm />
      <SectionsList rows={rows} activeTab={activeTab} />
    </div>
  );
}
