import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Orbitron, Syne } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { PastelMeshBackground } from "@/components/ui/PastelMeshBackground";
import { getPortfolio } from "@/lib/portfolio";

import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ifDisplay = Orbitron({
  variable: "--font-if-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ifBody = DM_Sans({
  variable: "--font-if-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const seo = data.seo?.settings;
  return {
    title: {
      default: seo?.site_title ?? "Arik Riko Prasetya — Mobile Developer",
      template: seo?.title_template ?? "%s — Portfolio",
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    description:
      seo?.default_description ??
      "Mobile & cross-platform developer — Kotlin, Flutter, React Native, fintech, clean architecture.",
    robots: seo?.default_robots ?? undefined,
    openGraph: seo?.default_og_image_url
      ? {
          images: [{ url: seo.default_og_image_url }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${geistMono.variable} ${ifDisplay.variable} ${ifBody.variable} h-full antialiased`}
    >
      {/* overflow-x-hidden di body memotong strip career (transform) + bayangan di tepi kiri/kanan */}
      <body className="min-h-full min-w-0 bg-[var(--background)] text-[var(--foreground)]">
        <PastelMeshBackground />
        {/* Film Grain Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.04] mix-blend-multiply">
          <svg className="absolute inset-0 h-full w-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
        
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
