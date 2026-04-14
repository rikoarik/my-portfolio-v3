import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Analytics = {
  projectsTotal: number;
  projectsPublished: number;
  experiencesTotal: number;
  experiencesPublished: number;
  guestbookTotal: number;
  guestbookPending: number;
  guestbookApproved: number;
  guestbookHidden: number;
  sectionsTotal: number;
  sectionsPublished: number;
  mediaTotal: number;
  seoPagesTotal: number;
};

async function countRows(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  filter?: { column: string; value: string }
): Promise<number> {
  if (!supabase) return 0;
  const query = supabase.from(table).select("id", { count: "exact", head: true });
  const request = filter ? query.eq(filter.column, filter.value) : query;
  const { count } = await request;
  return count ?? 0;
}

async function getAnalytics(): Promise<Analytics> {
  const supabase = await createSupabaseServerClient();
  const [
    projectsTotal,
    projectsPublished,
    experiencesTotal,
    experiencesPublished,
    guestbookTotal,
    guestbookPending,
    guestbookApproved,
    guestbookHidden,
    sectionsTotal,
    sectionsPublished,
    mediaTotal,
    seoPagesTotal,
  ] = await Promise.all([
    countRows(supabase, "projects"),
    countRows(supabase, "projects", { column: "status", value: "published" }),
    countRows(supabase, "experiences"),
    countRows(supabase, "experiences", { column: "status", value: "published" }),
    countRows(supabase, "guestbook"),
    countRows(supabase, "guestbook", { column: "status", value: "pending" }),
    countRows(supabase, "guestbook", { column: "status", value: "approved" }),
    countRows(supabase, "guestbook", { column: "status", value: "hidden" }),
    countRows(supabase, "section_content"),
    countRows(supabase, "section_content", { column: "status", value: "published" }),
    countRows(supabase, "media_assets"),
    countRows(supabase, "seo_pages"),
  ]);

  return {
    projectsTotal,
    projectsPublished,
    experiencesTotal,
    experiencesPublished,
    guestbookTotal,
    guestbookPending,
    guestbookApproved,
    guestbookHidden,
    sectionsTotal,
    sectionsPublished,
    mediaTotal,
    seoPagesTotal,
  };
}

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Ringkasan analitik konten + akses cepat ke semua CMS.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.projectsTotal}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Published: {analytics.projectsPublished}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.experiencesTotal}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Published: {analytics.experiencesPublished}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">Guestbook</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.guestbookTotal}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Pending {analytics.guestbookPending} · Approved {analytics.guestbookApproved} · Hidden{" "}
              {analytics.guestbookHidden}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.sectionsTotal}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Published: {analytics.sectionsPublished}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)] sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">Media Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.mediaTotal}</p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)] sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)]">SEO Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.seoPagesTotal}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/dashboard/profile">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Profil situs</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Nama, tagline, kontak, URL CV, dan metadata SEO.
            </CardContent>
          </Card>
        </Link>
        <Card className="border-[var(--border)] opacity-70">
          <CardHeader>
            <CardTitle className="text-lg">Proyek &amp; pengalaman</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--muted-foreground)]">
            CRUD lanjutan bisa ditambahkan di Supabase Table Editor atau lewat migrasi
            SQL; form untuk entitas ini dapat diperluas kemudian.
          </CardContent>
        </Card>
        <Link href="/admin/dashboard/projects">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Projects CMS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              CRUD + publish state untuk project dan case study.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/experiences">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Experiences CMS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Kelola timeline career, bullets, dan status publish.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/guestbook">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Guestbook moderation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Approve, hide, atau delete pesan tamu sebelum tampil publik.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/sections">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Homepage sections</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Copy hero/about/contact/proof/nav langsung dari CMS.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/media">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Media library</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Simpan asset URL + metadata untuk project cover dan OG image.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/seo">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">SEO settings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Metadata global dan override tiap halaman.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard/loader">
          <Card className="h-full border-[var(--border)] transition-colors hover:border-[var(--primary)]/50">
            <CardHeader>
              <CardTitle className="text-lg">Loader settings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              Ikuti tema global, opsional override bg + text, dan preset animasi teks.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
