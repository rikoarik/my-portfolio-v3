"use client";

import { useEffect, useState } from "react";
import { IFAboutSection } from "@/components/infinite-field/sections/IFAboutSection";
import { IFCareerSection } from "@/components/infinite-field/sections/IFCareerSection";
import { IFContactSection } from "@/components/infinite-field/sections/IFContactSection";
import { IFGuestbookSection } from "@/components/infinite-field/sections/IFGuestbookSection";
import { IFProofStrip } from "@/components/infinite-field/sections/IFProofStrip";
import { IFNav } from "@/components/infinite-field/IFNav";
import { IFProjectsSection } from "@/components/infinite-field/sections/IFProjectsSection";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { PageLoader } from "@/components/portfolio/PageLoader";
import { PastelHero } from "@/components/portfolio/PastelHero";
import { SmoothScroller } from "@/components/portfolio/SmoothScroller";
import type { PortfolioPayload } from "@/types/portfolio";

import "@/components/infinite-field/if-sections.css";

export function PortfolioClient({
  data,
  offlineBanner,
}: {
  data: PortfolioPayload;
  offlineBanner: boolean;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show off the loader and ensure styles process
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const sections = data.sections ?? [];
  const getSection = (key: string) => sections.find((section) => section.section_key === key);
  const heroSection = getSection("hero");
  const navSection = getSection("nav");
  const aboutSection = getSection("about");
  const contactSection = getSection("contact");
  const proofSection = getSection("proof");
  const loaderConfigRaw =
    data.seo?.settings?.metadata &&
    typeof data.seo.settings.metadata.loader_config === "object" &&
    data.seo.settings.metadata.loader_config !== null
      ? (data.seo.settings.metadata.loader_config as Record<string, unknown>)
      : null;
  const navItems = Array.isArray(navSection?.meta?.items)
    ? (navSection?.meta.items as { id: string; label: string }[])
    : undefined;
  const brand = typeof heroSection?.meta?.brand === "string" ? heroSection.meta.brand : "ARP · Portfolio";
  const loaderMessages = Array.isArray(loaderConfigRaw?.messages)
    ? loaderConfigRaw.messages.filter((m): m is string => typeof m === "string" && m.trim().length > 0)
    : [];
  const loaderTextAnimation =
    loaderConfigRaw?.text_animation === "slide-up" ||
    loaderConfigRaw?.text_animation === "pulse" ||
    loaderConfigRaw?.text_animation === "fade" ||
    loaderConfigRaw?.text_animation === "typewriter" ||
    loaderConfigRaw?.text_animation === "flip" ||
    loaderConfigRaw?.text_animation === "glitch"
      ? loaderConfigRaw.text_animation
      : "slide-up";
  const loaderLabel =
    typeof loaderConfigRaw?.label === "string" && loaderConfigRaw.label.trim()
      ? loaderConfigRaw.label
      : "Loading";

  return (
    <>
      <CustomCursor />
      <SmoothScroller />
      <PageLoader
        isLoading={loading}
        config={{
          label: loaderLabel,
          messages: loaderMessages.length ? loaderMessages : ["Preparing scene", "Loading portfolio"],
          textAnimation: loaderTextAnimation,
          colors: {
            overlayBg:
              typeof loaderConfigRaw?.background_color === "string"
                ? loaderConfigRaw.background_color
                : "#12100E",
            text: typeof loaderConfigRaw?.text_color === "string" ? loaderConfigRaw.text_color : "#F3EDE6",
          },
        }}
      />
      
      {offlineBanner ? (
        <div
          className="font-mono-meta sticky top-0 z-[60] border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200 backdrop-blur-md"
          role="status"
        >
          Mode offline — data seed. Hubungkan Supabase untuk konten live.
        </div>
      ) : null}

      <div className={`relative transition-opacity duration-700 ease-in-out ${loading ? "opacity-0" : "opacity-100"}`}>
        <IFNav brand={brand} items={navItems} />
        <PastelHero
          profile={data.profile}
          section={heroSection}
          contributions={data.github_contributions}
        />

        {/* pointer-events-none + child auto = klik tembus ke footer/back-to-top di area kosong; section tetap bisa diklik */}
        <div className="portfolio-main-column relative z-[1] bg-transparent pointer-events-none">
          <IFProofStrip section={proofSection} />
          <IFProjectsSection projects={data.projects} />
          <IFAboutSection section={aboutSection} />
          <IFCareerSection
            experiences={data.experiences}
            skillGroups={data.skill_groups}
            education={data.education}
          />
          <IFGuestbookSection messages={data.guestbook} />
          <IFContactSection profile={data.profile} section={contactSection} />
        </div>

        <BackToTopButton />
      </div>
    </>
  );
}
