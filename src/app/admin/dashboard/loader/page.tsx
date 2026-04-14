import { upsertLoaderSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function parseMetadata(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  return meta as Record<string, unknown>;
}

export default async function AdminLoaderPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: settings } = supabase
    ? await supabase.from("seo_settings").select("*").limit(1).maybeSingle()
    : { data: null };

  const metadata = parseMetadata(settings?.metadata);
  const config =
    metadata.loader_config && typeof metadata.loader_config === "object"
      ? (metadata.loader_config as Record<string, unknown>)
      : {};

  const messages = Array.isArray(config.messages)
    ? config.messages.filter((m): m is string => typeof m === "string").join("\n")
    : "Preparing scene\nLoading portfolio\nAlmost ready";

  const valueOf = (key: string, fallback: string) =>
    typeof config[key] === "string" && (config[key] as string).trim()
      ? (config[key] as string)
      : fallback;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Loader Settings</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Custom animasi teks loader + override warna background dan text.
        </p>
        {sp.saved ? <p className="mt-2 text-sm text-[var(--primary)]">Tersimpan.</p> : null}
      </div>

      <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
        <CardHeader>
          <CardTitle>Loader style</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertLoaderSettings} className="grid gap-3 sm:grid-cols-2">
            <input
              name="label"
              defaultValue={valueOf("label", "Loading")}
              placeholder="Loader label"
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
              required
            />
            <select
              name="text_animation"
              defaultValue={valueOf("text_animation", "slide-up")}
              className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
            >
              <option value="fade">Fade</option>
              <option value="slide-up">Slide Up</option>
              <option value="pulse">Pulse</option>
              <option value="typewriter">Typewriter</option>
              <option value="flip">Flip</option>
              <option value="glitch">Glitch</option>
            </select>

            <textarea
              name="messages"
              defaultValue={messages}
              rows={4}
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm sm:col-span-2"
              placeholder={"Satu baris satu pesan\nPreparing scene\nLoading portfolio"}
              required
            />

            <input
              name="background_color"
              defaultValue={valueOf("background_color", "#12100E")}
              placeholder="Background color (hex / css color)"
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
              required
            />
            <input
              name="text_color"
              defaultValue={valueOf("text_color", "#F3EDE6")}
              placeholder="Text color"
              className="rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
              required
            />

            <SubmitButton pendingText="Menyimpan loader...">Simpan loader settings</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
