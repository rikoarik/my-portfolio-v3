import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAdmin } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";
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
    <div className="admin-shell min-h-screen">
      <aside className="admin-sidebar">
        <div className="space-y-1">
          <p className="admin-sidebar-title">CMS Panel</p>
          <p className="admin-sidebar-subtitle">Content management</p>
        </div>
        <nav className="mt-6 grid gap-1 text-sm">
          <Link href="/admin/dashboard" className="admin-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/dashboard/profile" className="admin-nav-link">
            Profil situs
          </Link>
          <Link href="/admin/dashboard/projects" className="admin-nav-link">
            Projects
          </Link>
          <Link href="/admin/dashboard/experiences" className="admin-nav-link">
            Experiences
          </Link>
          <Link href="/admin/dashboard/guestbook" className="admin-nav-link">
            Guestbook
          </Link>
          <Link href="/admin/dashboard/sections" className="admin-nav-link">
            Sections
          </Link>
          <Link href="/admin/dashboard/media" className="admin-nav-link">
            Media
          </Link>
          <Link href="/admin/dashboard/seo" className="admin-nav-link">
            SEO
          </Link>
          <Link href="/admin/dashboard/loader" className="admin-nav-link">
            Loader
          </Link>
          <Link href="/" className="admin-nav-link">
            Lihat situs
          </Link>
        </nav>
        <form action={signOutAdmin} className="mt-auto pt-6">
          <SubmitButton variant="outline" size="sm" className="w-full" pendingText="Keluar...">
            Keluar
          </SubmitButton>
        </form>
      </aside>
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
