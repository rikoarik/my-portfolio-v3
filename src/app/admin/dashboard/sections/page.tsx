import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSectionTabs } from "@/components/admin/AdminSectionTabs";
import { SectionsList } from "@/components/admin/SectionsList";
import type { SectionData } from "@/components/admin/forms/SectionForm";
import { Button } from "@/components/ui/button";
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
        description="Kelola copy tiap section homepage. Klik baris untuk edit."
        actions={
          <Button asChild size="lg">
            <Link href="/admin/dashboard/sections/new">+ Section baru</Link>
          </Button>
        }
      />
      <AdminSectionTabs active={activeTab} />
      <SectionsList rows={rows} activeTab={activeTab} />
    </div>
  );
}
