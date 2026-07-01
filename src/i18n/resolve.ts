import type { TranslateFn } from "./context";

/** CMS value wins when non-empty; otherwise i18n fallback for active locale. */
export function resolveSectionText(
  cmsValue: unknown,
  t: TranslateFn,
  fallbackKey: string,
): string {
  if (typeof cmsValue === "string" && cmsValue.trim()) return cmsValue.trim();
  return t(fallbackKey);
}
