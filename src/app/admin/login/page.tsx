"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const searchParams = useSearchParams();
  const err = searchParams.get("error");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    const origin = window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/admin/dashboard`,
      },
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
      <div>
        <h1 className="text-2xl font-bold">Admin CMS</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Magic link ke email Anda. Pastikan user ada di tabel{" "}
          <code className="font-mono-meta text-[var(--primary)]">admin_users</code>.
        </p>
      </div>
      {err ? (
        <p className="text-sm text-red-400" role="alert">
          Autentikasi gagal. Coba lagi.
        </p>
      ) : null}
      {status === "sent" ? (
        <p className="text-sm text-[var(--primary)]">
          Cek inbox untuk link masuk.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full">
            Kirim link
          </Button>
        </form>
      )}
      <Link
        href="/"
        className="font-mono-meta block text-center text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← Kembali ke portofolio
      </Link>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Memuat…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
