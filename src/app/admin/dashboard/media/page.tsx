import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaList } from "@/components/admin/MediaList";
import { MediaUploadForm } from "@/components/admin/forms/MediaUploadForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type MediaRow = {
  id: string;
  path: string;
  public_url: string;
  alt: string | null;
  caption: string | null;
  mime_type: string | null;
};

export default async function AdminMediaPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("media_assets").select("*").order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data as MediaRow[]) ?? [];

  return (
    <div className="space-y-3">
      <AdminPageHeader title="Media Library" description="Registrasi asset media + metadata." />
      <MediaUploadForm />
      <MediaList rows={rows} />
    </div>
  );
}
