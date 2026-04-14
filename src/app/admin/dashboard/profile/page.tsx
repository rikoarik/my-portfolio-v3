import { updateSiteProfile } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  let initial = PORTFOLIO_SEED.profile;

  if (supabase) {
    const { data } = await supabase
      .from("site_profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      initial = {
        full_name: data.full_name,
        title: data.title,
        tagline: data.tagline ?? "",
        location: data.location ?? "",
        email: data.email ?? "",
        phone: data.phone,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        website_url: data.website_url,
        cv_url: data.cv_url,
        locale_ui: data.locale_ui ?? "id",
        og_description: data.og_description,
      };
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profil situs</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Perubahan akan memperbarui cache portofolio.
        </p>
        {sp.saved ? (
          <p className="mt-2 text-sm text-[var(--primary)]" role="status">
            Tersimpan. Portofolio publik akan memuat data baru setelah refresh.
          </p>
        ) : null}
      </div>
      <form action={updateSiteProfile} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full_name">Nama lengkap</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              defaultValue={initial.full_name}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Judul / role</Label>
            <Input id="title" name="title" required defaultValue={initial.title} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              name="tagline"
              rows={4}
              defaultValue={initial.tagline}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" name="location" defaultValue={initial.location} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initial.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" name="phone" defaultValue={initial.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              name="github_url"
              defaultValue={initial.github_url ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              defaultValue={initial.linkedin_url ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website_url">Website</Label>
            <Input
              id="website_url"
              name="website_url"
              defaultValue={initial.website_url ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cv_url">URL CV (path publik atau absolut)</Label>
            <Input
              id="cv_url"
              name="cv_url"
              defaultValue={initial.cv_url ?? ""}
              placeholder="/NodeFlair_Resume_2026-04-11_13_37_51.pdf"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="og_description">Deskripsi Open Graph</Label>
            <Textarea
              id="og_description"
              name="og_description"
              rows={2}
              defaultValue={initial.og_description ?? ""}
            />
          </div>
        </div>
        <SubmitButton pendingText="Menyimpan profil...">Simpan</SubmitButton>
      </form>
    </div>
  );
}
