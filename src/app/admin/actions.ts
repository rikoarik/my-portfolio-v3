"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function revalidatePortfolio() {
  updateTag("portfolio");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateSiteProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase tidak dikonfigurasi");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Belum login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("Bukan admin");

  const payload = {
    full_name: String(formData.get("full_name") ?? ""),
    title: String(formData.get("title") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    location: String(formData.get("location") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || null,
    github_url: String(formData.get("github_url") ?? "") || null,
    linkedin_url: String(formData.get("linkedin_url") ?? "") || null,
    website_url: String(formData.get("website_url") ?? "") || null,
    cv_url: String(formData.get("cv_url") ?? "") || null,
    locale_ui: "id",
    og_description: String(formData.get("og_description") ?? "") || null,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from("site_profile")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("site_profile")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("site_profile").insert(payload);
    if (error) throw new Error(error.message);
  }

  await revalidatePortfolio();
  redirect("/admin/dashboard/profile?saved=1");
}
