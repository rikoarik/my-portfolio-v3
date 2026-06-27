import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/layout/AdminShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="admin-shell p-8 text-sm text-[var(--muted-foreground)]">
        Set{" "}
        <code className="font-mono-meta text-[var(--primary)]">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
        <code className="font-mono-meta text-[var(--primary)]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
        di <code>.env.local</code>.
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/?error=forbidden");
  }

  return (
    <AdminShell userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
