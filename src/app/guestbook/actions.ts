"use server";

import { revalidateTag, updateTag } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/anon";

export type GuestMessageActionState =
  | { success: true }
  | { errorKey: string }
  | null;

export async function postGuestMessage(
  _prevState: GuestMessageActionState,
  formData: FormData,
): Promise<GuestMessageActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message) {
    return { errorKey: "guestbook.errors.required" };
  }

  const supabase = createAnonServerClient();
  if (!supabase) {
    return { errorKey: "guestbook.errors.supabaseDisconnected" };
  }

  const { error } = await supabase.from("guestbook").insert({
    name,
    message,
    status: "pending",
  });

  if (error) {
    console.error("Guestbook insert error:", error);
    return { errorKey: "guestbook.errors.sendFailed" };
  }

  updateTag("portfolio");
  return { success: true as const };
}
