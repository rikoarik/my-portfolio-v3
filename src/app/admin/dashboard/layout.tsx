import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="p-8 text-sm text-[var(--muted-foreground)]">
        Set{" "}
        <code className="font-mono-meta text-[var(--primary)]">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        dan{" "}
        <code className="font-mono-meta text-[var(--primary)]">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
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
    <div className="min-h-screen bg-[var(--background)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
        <nav className="flex flex-wrap items-center gap-4 font-mono-meta text-sm">
          <Link href="/admin/dashboard" className="font-semibold text-[var(--primary)]">
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/profile"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Profil situs
          </Link>
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Lihat situs
          </Link>
        </nav>
        <form action={signOutAdmin}>
          <Button type="submit" variant="outline" size="sm">
            Keluar
          </Button>
        </form>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
