"use server";

import { revalidateTag, updateTag } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/anon";

export async function postGuestMessage(prevState: any, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message) {
    return { error: "Nama dan pesan wajib diisi." };
  }

  const supabase = createAnonServerClient();
  if (!supabase) {
    return { error: "Supabase tidak terhubung." };
  }

  const { error } = await supabase.from("guestbook").insert({
    name,
    message,
    status: "pending",
  });

  if (error) {
    console.error("Guestbook insert error:", error);
    return { error: "Gagal mengirim pesan. Silakan coba lagi." };
  }

  updateTag("portfolio");
  return { success: true };
}
