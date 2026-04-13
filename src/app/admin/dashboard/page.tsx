import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Kelola konten yang tampil di portofolio publik.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
