export type MediaOption = { url: string; alt?: string | null };

export async function fetchRecentMediaOptions(
  supabase: Awaited<
    ReturnType<typeof import("@/lib/supabase/server").createSupabaseServerClient>
  >,
  limit = 12,
): Promise<MediaOption[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("media_assets")
    .select("public_url, alt")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? [])
    .map((row) => ({
      url: (row as { public_url?: string }).public_url ?? "",
      alt: (row as { alt?: string | null }).alt,
    }))
    .filter((row) => row.url);
}
