export const LANDING_THEME_PRESETS = [
  "ember-night",
  "forest-hearth",
  "cocoa-slate",
  "dusk-mocha",
  "sage-mist",
  "linen-dawn",
  "rose-clay",
  "ocean-paper",
  "amber-fog",
  "pine-smoke",
  "tyrian-banana",
  "moss-cloud",
  "golden-parchment",
  "amber-mirage",
  "pistachio-espresso",
  "matcha-coal",
] as const;

export type LandingThemePreset = (typeof LANDING_THEME_PRESETS)[number];

const landingThemePresetSet = new Set<string>(LANDING_THEME_PRESETS);

export function parseLandingThemePreset(value: unknown): LandingThemePreset {
  if (typeof value !== "string") return "ember-night";
  return landingThemePresetSet.has(value) ? (value as LandingThemePreset) : "ember-night";
}
