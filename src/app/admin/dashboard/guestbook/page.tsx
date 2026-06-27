import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GuestbookAdmin } from "@/components/admin/GuestbookList";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type GuestbookAdminRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  status: "pending" | "approved" | "hidden" | null;
  moderation_note?: string | null;
};

export default async function AdminGuestbookPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase
    ? await supabase
        .from("guestbook")
        .select("id,name,message,created_at,status,moderation_note")
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: null };

  const rows = ((data as GuestbookAdminRow[] | null) ?? []).map((row) => ({
    ...row,
    status: (row.status ?? "pending") as "pending" | "approved" | "hidden",
  }));

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Guestbook"
        description="Moderasi pesan publik sebelum tampil di section guestbook."
      />
      <GuestbookAdmin rows={rows} />
    </div>
  );
}
