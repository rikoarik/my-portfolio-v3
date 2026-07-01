import type { SiteBackgroundType } from "@/lib/theme/site-background";

export const SITE_BACKGROUND_OPTIONS: { value: SiteBackgroundType; label: string; hint: string }[] = [
  { value: "dot-field", label: "Dot Field", hint: "Grid dot interaktif + gradient, reaksi cursor" },
  { value: "webcam-pixel-grid", label: "Webcam pixel grid", hint: "Pixel 3D dari webcam — butuh izin kamera" },
  { value: "aurora", label: "Aurora", hint: "Gradient aurora WebGL mengalir" },
  { value: "ripple-grid", label: "Ripple grid", hint: "Grid gelombang + interaksi mouse" },
  { value: "particles", label: "Particles", hint: "Partikel 3D melayang" },
  { value: "plasma", label: "Plasma", hint: "Shader plasma organik" },
  { value: "galaxy", label: "Galaxy", hint: "Starfield parallax interaktif" },
  { value: "pastel-mesh", label: "Pastel mesh", hint: "Blob pastel statis (lama)" },
];

export function isSiteBackgroundType(value: string): value is SiteBackgroundType {
  return SITE_BACKGROUND_OPTIONS.some((option) => option.value === value);
}
