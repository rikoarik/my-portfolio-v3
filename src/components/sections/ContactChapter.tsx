import { Download, ExternalLink, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SiteProfile } from "@/types/portfolio";

export function ContactChapter({ profile }: { profile: SiteProfile }) {
  const cv = profile.cv_url ?? "/NodeFlair_Resume_2026-04-11_13_37_51.pdf";

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-28 lg:px-16">
      <h2
        id="chapter-title-next"
        className="mb-6 max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl"
      >
        Lanjutkan percakapan
        <span className="font-mono-meta mt-2 block text-sm font-normal text-[var(--muted-foreground)]">
          Unduh CV atau hubungi langsung
        </span>
      </h2>
      <div className="flex max-w-xl flex-col gap-4">
        <Button asChild size="lg" className="font-mono-meta w-fit">
          <a href={cv} download>
            <Download className="h-4 w-4" />
            Unduh CV (PDF)
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-mono-meta w-fit">
          <a href={`mailto:${profile.email}`}>
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
        </Button>
        {profile.phone ? (
          <Button asChild variant="outline" size="lg" className="font-mono-meta w-fit">
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4" />
              {profile.phone}
            </a>
          </Button>
        ) : null}
        {profile.website_url ? (
          <Button asChild variant="ghost" size="lg" className="font-mono-meta w-fit">
            <a href={profile.website_url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              {profile.website_url.replace(/^https?:\/\//, "")}
            </a>
          </Button>
        ) : null}
      </div>
      <p className="font-mono-meta mt-12 max-w-lg text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} {profile.full_name}. Dibangun dengan Next.js,
        GSAP, Supabase.
      </p>
    </div>
  );
}
