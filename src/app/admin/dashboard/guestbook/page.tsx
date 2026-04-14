import { deleteGuestbookMessage, updateGuestbookStatus } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type GuestbookAdminStatus = "pending" | "approved" | "hidden";

type GuestbookAdminRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  status: GuestbookAdminStatus | null;
  moderation_note?: string | null;
};

const STATUS_OPTIONS: GuestbookAdminStatus[] = ["pending", "approved", "hidden"];

function isStatus(v: string): v is GuestbookAdminStatus {
  return STATUS_OPTIONS.includes(v as GuestbookAdminStatus);
}

function formatDate(v: string) {
  const date = new Date(v);
  if (Number.isNaN(date.getTime())) return v;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminGuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const filter = isStatus(String(sp.status ?? "")) ? String(sp.status) : "all";
  const supabase = await createSupabaseServerClient();

  let query = supabase
    ?.from("guestbook")
    .select("id,name,message,created_at,status,moderation_note")
    .order("created_at", { ascending: false })
    .limit(200);

  if (query && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data } = query ? await query : { data: null };
  const rows = ((data as GuestbookAdminRow[] | null) ?? []).map((row) => ({
    ...row,
    status: row.status ?? "pending",
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Guestbook</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Moderasi pesan publik sebelum tampil di section guestbook.
          </p>
          {sp.saved ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Status pesan tersimpan.
            </p>
          ) : null}
          {sp.deleted ? (
            <p className="mt-2 text-sm text-[var(--primary)]" role="status">
              Pesan terhapus.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-meta uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          <span>Filter:</span>
          {["all", ...STATUS_OPTIONS].map((item) => {
            const href =
              item === "all"
                ? "/admin/dashboard/guestbook"
                : `/admin/dashboard/guestbook?status=${item}`;
            const active = filter === item;
            return (
              <Button key={item} asChild size="sm" variant={active ? "default" : "outline"}>
                <a href={href}>{item}</a>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        {rows.length === 0 ? (
          <Card className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardContent className="py-6 text-sm text-[var(--muted-foreground)]">
              Belum ada pesan untuk filter ini.
            </CardContent>
          </Card>
        ) : null}
        {rows.map((row) => (
          <Card key={row.id} className="border-[var(--border)]/90 bg-[var(--card)]/60">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg">{row.name}</CardTitle>
                <p className="mt-1 font-mono-meta text-xs text-[var(--muted-foreground)]">
                  {formatDate(row.created_at)} · status {row.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <form key={`${row.id}-${status}`} action={updateGuestbookStatus}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="status" value={status} />
                    <input type="hidden" name="moderation_note" value={row.moderation_note ?? ""} />
                    <SubmitButton
                      size="sm"
                      variant={row.status === status ? "default" : "outline"}
                      pendingText="Menyimpan..."
                    >
                      {status}
                    </SubmitButton>
                  </form>
                ))}
                <form action={deleteGuestbookMessage}>
                  <input type="hidden" name="id" value={row.id} />
                  <SubmitButton size="sm" variant="outline" pendingText="Deleting...">Delete</SubmitButton>
                </form>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[var(--foreground)]">
              <p>{row.message}</p>
              <form action={updateGuestbookStatus} className="space-y-2">
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="status" value={row.status} />
                <label className="text-xs text-[var(--muted-foreground)]">Catatan moderasi</label>
                <textarea
                  name="moderation_note"
                  defaultValue={row.moderation_note ?? ""}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent p-2 text-sm"
                />
                <SubmitButton size="sm" variant="outline" pendingText="Menyimpan...">
                  Simpan catatan
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
