export type HeroTypography = {
  titleSize: string;
  roleSize: string;
  taglineSize: string;
  ctaSize: string;
};

const DEFAULT_TITLE_MOBILE = "2rem";
const DEFAULT_TITLE_DESKTOP = "5.5rem";
const DEFAULT_ROLE_SIZE = "0.65rem";
const DEFAULT_TAGLINE_SIZE = "0.9rem";
const DEFAULT_CTA_SIZE = "0.68rem";

function cssSize(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}rem`;
  if (/^\d+(\.\d+)?(rem|em|px|vw|vh|%)$/i.test(trimmed)) return trimmed;
  return fallback;
}

export function heroTypographyFromMeta(meta?: Record<string, unknown> | null): HeroTypography {
  const mobile = cssSize(meta?.hero_title_size_mobile, DEFAULT_TITLE_MOBILE);
  const desktop = cssSize(meta?.hero_title_size_desktop, DEFAULT_TITLE_DESKTOP);

  return {
    titleSize: `clamp(${mobile}, 8vw, ${desktop})`,
    roleSize: cssSize(meta?.hero_role_size, DEFAULT_ROLE_SIZE),
    taglineSize: cssSize(meta?.hero_tagline_size, DEFAULT_TAGLINE_SIZE),
    ctaSize: cssSize(meta?.hero_cta_size, DEFAULT_CTA_SIZE),
  };
}

export function heroTitleClassName(): string {
  return "text-left font-bold leading-[1.02] tracking-[-0.03em] text-[var(--foreground)]";
}
