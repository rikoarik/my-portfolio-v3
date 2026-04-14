import type { Metadata } from "next";

import { PortfolioClient } from "@/components/portfolio/PortfolioClient";
import { getPortfolio } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const seoPages = data.seo?.pages ?? [];
  const homeSeo = seoPages.find((page) => page.page_key === "home");
  const globalSeo = data.seo?.settings;
  const desc =
    homeSeo?.description ??
    globalSeo?.default_description ??
    data.profile.og_description ??
    data.profile.tagline.slice(0, 155) +
      (data.profile.tagline.length > 155 ? "…" : "");
  return {
    title: homeSeo?.title ?? data.profile.full_name,
    description: desc,
    robots: homeSeo?.robots ?? globalSeo?.default_robots ?? undefined,
    alternates: homeSeo?.canonical_url
      ? {
          canonical: homeSeo.canonical_url,
        }
      : undefined,
    openGraph: {
      title: homeSeo?.title ?? data.profile.full_name,
      description: desc,
      type: "website",
      images: homeSeo?.og_image_url
        ? [{ url: homeSeo.og_image_url }]
        : globalSeo?.default_og_image_url
          ? [{ url: globalSeo.default_og_image_url }]
          : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await getPortfolio();
  const landingThemePreset = data.seo?.settings?.landing_theme_preset ?? "ember-night";
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const offlineBanner = supabaseConfigured && data.source === "seed";

  return (
    <main
      id="main"
      data-landing-theme={landingThemePreset}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
    >
      <a
        href="#hero-title"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)]"
      >
        Lewati ke konten
      </a>
      <PortfolioClient data={data} offlineBanner={offlineBanner} />
    </main>
  );
}
