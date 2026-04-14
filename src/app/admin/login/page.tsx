"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const err = searchParams.get("error");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
      setIsSubmitting(false);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 text-[var(--admin-ink)] shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">Admin CMS</h1>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Login pakai email dan password. Pastikan user ada di tabel{" "}
          <code className="font-mono-meta text-[var(--admin-accent)]">admin_users</code>.
        </p>
      </div>
      {err ? (
        <p className="text-sm text-red-600" role="alert">
          Autentikasi gagal. Coba lagi.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-600" role="alert">
          Email/password salah atau akun belum punya password.
        </p>
      ) : null}
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>
      <Link
        href="/"
        className="font-mono-meta block text-center text-xs text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"
      >
        ← Kembali ke portofolio
      </Link>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login-shell flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<div className="text-sm text-[var(--admin-muted)]">Memuat…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
