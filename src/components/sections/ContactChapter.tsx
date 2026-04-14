"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, ExternalLink, Mail, Phone, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SiteProfile } from "@/types/portfolio";

export function ContactChapter({ profile }: { profile: SiteProfile }) {
  const cv =
    profile.cv_url ?? "/NodeFlair_Resume_2026-04-11_13_37_51.pdf";
  const reduce = useReducedMotion() ?? false;

  const links = [
    {
      key: "cv",
      node: (
        <Button
          asChild
          size="lg"
          className="font-mono-meta w-full justify-center shadow-[0_0_40px_-12px_var(--primary-glow)] sm:w-auto"
        >
          <a href={cv} download>
            <Download className="h-4 w-4" />
            Unduh CV (PDF)
          </a>
        </Button>
      ),
    },
    {
      key: "mail",
      node: (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="font-mono-meta w-full border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm sm:w-auto"
        >
          <a href={`mailto:${profile.email}`}>
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
        </Button>
      ),
    },
  ];

  if (profile.phone) {
    links.push({
      key: "phone",
      node: (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="font-mono-meta w-full border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm sm:w-auto"
        >
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            <Phone className="h-4 w-4" />
            {profile.phone}
          </a>
        </Button>
      ),
    });
  }

  if (profile.website_url) {
    links.push({
      key: "web",
      node: (
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="font-mono-meta w-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:w-auto"
        >
          <a href={profile.website_url} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            {profile.website_url.replace(/^https?:\/\//, "")}
          </a>
        </Button>
      ),
    });
  }

  return (
    <div
      id="contact"
      className="flex min-h-full flex-col justify-center px-5 py-24 sm:px-8 lg:px-14 xl:px-20"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-[var(--border)]/90 bg-gradient-to-br from-[var(--card)]/90 via-[var(--card)]/70 to-[var(--muted)]/40 p-8 shadow-[0_0_60px_-24px_var(--accent-glow)] backdrop-blur-xl sm:p-10 lg:max-w-xl"
      >
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(124_92_255_/_0.2),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(52_245_197_/_0.15),transparent_70%)] blur-3xl" />

        <div className="relative flex items-center gap-2 text-[var(--primary)]">
          <Rocket className="h-5 w-5" aria-hidden />
          <span className="font-mono-meta text-xs uppercase tracking-[0.2em]">
            Next step
          </span>
        </div>

        <h2
          id="chapter-title-next"
          className="relative mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Mari lanjutkan
        </h2>
        <p className="font-mono-meta relative mt-2 text-sm text-[var(--muted-foreground)]">
          Unduh CV atau kirim email — respons cepat.
        </p>

        <motion.div
          className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduce ? 0 : 0.12 },
            },
          }}
        >
          {links.map((l) => (
            <motion.div
              key={l.key}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {l.node}
            </motion.div>
          ))}
        </motion.div>

        <p className="font-mono-meta relative mt-10 text-[11px] leading-relaxed text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} {profile.full_name}. Next.js · GSAP ·
          Framer Motion · Supabase.
        </p>
      </motion.div>
    </div>
  );
}
