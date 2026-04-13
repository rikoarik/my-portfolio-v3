import type { Metadata } from "next";

import { PortfolioClient } from "@/components/portfolio/PortfolioClient";
import { getPortfolio } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const desc =
    data.profile.og_description ??
    data.profile.tagline.slice(0, 155) +
      (data.profile.tagline.length > 155 ? "…" : "");
  return {
    title: data.profile.full_name,
    description: desc,
    openGraph: {
      title: data.profile.full_name,
      description: desc,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const data = await getPortfolio();
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const offlineBanner = supabaseConfigured && data.source === "seed";

  return (
    <main id="main">
      <a
        href="#chapter-title-open"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)]"
      >
        Lewati ke konten
      </a>
      <PortfolioClient data={data} offlineBanner={offlineBanner} />
    </main>
  );
}
