import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProfileForm } from "@/components/admin/forms/ProfileForm";
import { PORTFOLIO_SEED } from "@/data/portfolio.seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminProfilePage() {
  const supabase = await createSupabaseServerClient();
  let initial = PORTFOLIO_SEED.profile;

  if (supabase) {
    const { data } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();
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
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Profil situs"
        description="Perubahan akan memperbarui cache portofolio."
      />
      <ProfileForm initial={initial} />
    </div>
  );
}
