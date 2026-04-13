import { Github, Linkedin, Mail, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SiteProfile } from "@/types/portfolio";

export function IntroChapter({ profile }: { profile: SiteProfile }) {
  return (
    <div className="relative flex min-h-full flex-col justify-center px-6 pb-12 pt-28 lg:px-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative max-w-3xl space-y-8">
        <p className="font-mono-meta text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Production log · v1.0
        </p>
        <h1
          id="chapter-title-open"
          className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {profile.full_name}
        </h1>
        <p className="font-mono-meta text-sm text-[var(--primary)] lg:text-base">
          {profile.title}
        </p>
        <p className="text-lg leading-relaxed text-[var(--muted-foreground)] lg:text-xl">
          {profile.tagline}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <MapPin className="h-4 w-4 text-[var(--primary)]" aria-hidden />
          <span>{profile.location}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.github_url ? (
            <Button asChild variant="outline" className="font-mono-meta">
              <a href={profile.github_url} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          ) : null}
          {profile.linkedin_url ? (
            <Button asChild variant="outline" className="font-mono-meta">
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          ) : null}
          <Button asChild className="font-mono-meta">
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
          <Badge variant="secondary">Kotlin</Badge>
          <Badge variant="secondary">Flutter</Badge>
          <Badge variant="secondary">React Native</Badge>
          <Badge variant="secondary">Fintech</Badge>
        </div>
      </div>
    </div>
  );
}
