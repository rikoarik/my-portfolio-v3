import { readBoolean } from "@/lib/admin/action-helpers";
import { isSiteBackgroundType } from "@/lib/theme/site-background-catalog";

export type SiteBackgroundType =
  | "pastel-mesh"
  | "dot-field"
  | "webcam-pixel-grid"
  | "aurora"
  | "ripple-grid"
  | "particles"
  | "plasma"
  | "galaxy";

export type DotFieldConfig = {
  dotRadius: number;
  dotSpacing: number;
  bulgeStrength: number;
  glowRadius: number;
  sparkle: boolean;
  waveAmplitude: number;
  cursorRadius: number;
  cursorForce: number;
  bulgeOnly: boolean;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
};

export type WebcamPixelGridConfig = {
  gridCols: number;
  gridRows: number;
  maxElevation: number;
  motionSensitivity: number;
  elevationSmoothing: number;
  colorMode: "webcam" | "monochrome";
  monochromeColor: string;
  backgroundColor: string;
  mirror: boolean;
  gapRatio: number;
  invertColors: boolean;
  darken: number;
  borderColor: string;
  borderOpacity: number;
};

export type AuroraConfig = {
  colorStops: [string, string, string];
  amplitude: number;
  blend: number;
  speed: number;
};

export type RippleGridConfig = {
  enableRainbow: boolean;
  gridColor: string;
  rippleIntensity: number;
  gridSize: number;
  mouseInteraction: boolean;
  glowIntensity: number;
};

export type ParticlesConfig = {
  particleCount: number;
  particleSpread: number;
  speed: number;
  particleColors: string[];
  moveParticlesOnHover: boolean;
  particleBaseSize: number;
};

export type PlasmaConfig = {
  color: string;
  speed: number;
  scale: number;
  opacity: number;
  mouseInteractive: boolean;
};

export type GalaxyConfig = {
  density: number;
  hueShift: number;
  glowIntensity: number;
  speed: number;
  mouseRepulsion: boolean;
  twinkleIntensity: number;
};

export type SiteBackgroundConfig = {
  type: SiteBackgroundType;
  dotField: DotFieldConfig;
  webcamPixelGrid: WebcamPixelGridConfig;
  aurora: AuroraConfig;
  rippleGrid: RippleGridConfig;
  particles: ParticlesConfig;
  plasma: PlasmaConfig;
  galaxy: GalaxyConfig;
};

export const DEFAULT_DOT_FIELD_CONFIG: DotFieldConfig = {
  dotRadius: 1.5,
  dotSpacing: 14,
  bulgeStrength: 67,
  glowRadius: 160,
  sparkle: false,
  waveAmplitude: 0,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  gradientFrom: "#A855F7",
  gradientTo: "#B497CF",
  glowColor: "#120F17",
};

export const DEFAULT_WEBCAM_PIXEL_GRID_CONFIG: WebcamPixelGridConfig = {
  gridCols: 60,
  gridRows: 40,
  maxElevation: 50,
  motionSensitivity: 0.25,
  elevationSmoothing: 0.2,
  colorMode: "webcam",
  monochromeColor: "#00ff88",
  backgroundColor: "#030303",
  mirror: true,
  gapRatio: 0.05,
  invertColors: false,
  darken: 0.6,
  borderColor: "#ffffff",
  borderOpacity: 0.06,
};

export const DEFAULT_AURORA_CONFIG: AuroraConfig = {
  colorStops: ["#5227FF", "#7cff67", "#5227FF"],
  amplitude: 1,
  blend: 0.5,
  speed: 1,
};

export const DEFAULT_RIPPLE_GRID_CONFIG: RippleGridConfig = {
  enableRainbow: false,
  gridColor: "#A855F7",
  rippleIntensity: 0.05,
  gridSize: 10,
  mouseInteraction: true,
  glowIntensity: 0.12,
};

export const DEFAULT_PARTICLES_CONFIG: ParticlesConfig = {
  particleCount: 180,
  particleSpread: 10,
  speed: 0.1,
  particleColors: ["#A855F7", "#B497CF", "#ffffff"],
  moveParticlesOnHover: true,
  particleBaseSize: 100,
};

export const DEFAULT_PLASMA_CONFIG: PlasmaConfig = {
  color: "#A855F7",
  speed: 1,
  scale: 1,
  opacity: 0.85,
  mouseInteractive: true,
};

export const DEFAULT_GALAXY_CONFIG: GalaxyConfig = {
  density: 1,
  hueShift: 140,
  glowIntensity: 0.35,
  speed: 1,
  mouseRepulsion: true,
  twinkleIntensity: 0.3,
};

export const DEFAULT_SITE_BACKGROUND_CONFIG: SiteBackgroundConfig = {
  type: "dot-field",
  dotField: DEFAULT_DOT_FIELD_CONFIG,
  webcamPixelGrid: DEFAULT_WEBCAM_PIXEL_GRID_CONFIG,
  aurora: DEFAULT_AURORA_CONFIG,
  rippleGrid: DEFAULT_RIPPLE_GRID_CONFIG,
  particles: DEFAULT_PARTICLES_CONFIG,
  plasma: DEFAULT_PLASMA_CONFIG,
  galaxy: DEFAULT_GALAXY_CONFIG,
};

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "on" || value === "1") return true;
  if (value === "false" || value === "off" || value === "0") return false;
  return fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function parseColorList(value: unknown, fallback: string[]): string[] {
  if (typeof value === "string" && value.trim()) {
    const parsed = value.split(",").map((part) => part.trim()).filter(Boolean);
    if (parsed.length) return parsed;
  }
  if (Array.isArray(value)) {
    const parsed = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    if (parsed.length) return parsed;
  }
  return fallback;
}

function parseBackgroundType(raw: unknown): SiteBackgroundType {
  if (typeof raw === "string" && isSiteBackgroundType(raw)) return raw;
  return DEFAULT_SITE_BACKGROUND_CONFIG.type;
}

function parseDotFieldConfig(raw: unknown): DotFieldConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return {
    dotRadius: asNumber(source.dotRadius ?? source.dot_radius, DEFAULT_DOT_FIELD_CONFIG.dotRadius),
    dotSpacing: asNumber(source.dotSpacing ?? source.dot_spacing, DEFAULT_DOT_FIELD_CONFIG.dotSpacing),
    bulgeStrength: asNumber(
      source.bulgeStrength ?? source.bulge_strength,
      DEFAULT_DOT_FIELD_CONFIG.bulgeStrength,
    ),
    glowRadius: asNumber(source.glowRadius ?? source.glow_radius, DEFAULT_DOT_FIELD_CONFIG.glowRadius),
    sparkle: asBoolean(source.sparkle, DEFAULT_DOT_FIELD_CONFIG.sparkle),
    waveAmplitude: asNumber(
      source.waveAmplitude ?? source.wave_amplitude,
      DEFAULT_DOT_FIELD_CONFIG.waveAmplitude,
    ),
    cursorRadius: asNumber(
      source.cursorRadius ?? source.cursor_radius,
      DEFAULT_DOT_FIELD_CONFIG.cursorRadius,
    ),
    cursorForce: asNumber(source.cursorForce ?? source.cursor_force, DEFAULT_DOT_FIELD_CONFIG.cursorForce),
    bulgeOnly: asBoolean(source.bulgeOnly ?? source.bulge_only, DEFAULT_DOT_FIELD_CONFIG.bulgeOnly),
    gradientFrom: asString(
      source.gradientFrom ?? source.gradient_from,
      DEFAULT_DOT_FIELD_CONFIG.gradientFrom,
    ),
    gradientTo: asString(source.gradientTo ?? source.gradient_to, DEFAULT_DOT_FIELD_CONFIG.gradientTo),
    glowColor: asString(source.glowColor ?? source.glow_color, DEFAULT_DOT_FIELD_CONFIG.glowColor),
  };
}

function parseWebcamPixelGridConfig(raw: unknown): WebcamPixelGridConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const colorModeRaw = asString(source.colorMode ?? source.color_mode, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.colorMode);
  const colorMode = colorModeRaw === "monochrome" ? "monochrome" : "webcam";

  return {
    gridCols: asNumber(source.gridCols ?? source.grid_cols, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gridCols),
    gridRows: asNumber(source.gridRows ?? source.grid_rows, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gridRows),
    maxElevation: asNumber(
      source.maxElevation ?? source.max_elevation,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.maxElevation,
    ),
    motionSensitivity: asNumber(
      source.motionSensitivity ?? source.motion_sensitivity,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.motionSensitivity,
    ),
    elevationSmoothing: asNumber(
      source.elevationSmoothing ?? source.elevation_smoothing,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.elevationSmoothing,
    ),
    colorMode,
    monochromeColor: asString(
      source.monochromeColor ?? source.monochrome_color,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.monochromeColor,
    ),
    backgroundColor: asString(
      source.backgroundColor ?? source.background_color,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.backgroundColor,
    ),
    mirror: asBoolean(source.mirror, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.mirror),
    gapRatio: asNumber(source.gapRatio ?? source.gap_ratio, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gapRatio),
    invertColors: asBoolean(
      source.invertColors ?? source.invert_colors,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.invertColors,
    ),
    darken: asNumber(source.darken, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.darken),
    borderColor: asString(source.borderColor ?? source.border_color, DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.borderColor),
    borderOpacity: asNumber(
      source.borderOpacity ?? source.border_opacity,
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.borderOpacity,
    ),
  };
}

function parseAuroraConfig(raw: unknown): AuroraConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const colors = parseColorList(source.colorStops ?? source.color_stops, [...DEFAULT_AURORA_CONFIG.colorStops]);
  return {
    colorStops: [colors[0] ?? DEFAULT_AURORA_CONFIG.colorStops[0], colors[1] ?? DEFAULT_AURORA_CONFIG.colorStops[1], colors[2] ?? colors[0] ?? DEFAULT_AURORA_CONFIG.colorStops[2]],
    amplitude: asNumber(source.amplitude, DEFAULT_AURORA_CONFIG.amplitude),
    blend: asNumber(source.blend, DEFAULT_AURORA_CONFIG.blend),
    speed: asNumber(source.speed, DEFAULT_AURORA_CONFIG.speed),
  };
}

function parseRippleGridConfig(raw: unknown): RippleGridConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    enableRainbow: asBoolean(source.enableRainbow ?? source.enable_rainbow, DEFAULT_RIPPLE_GRID_CONFIG.enableRainbow),
    gridColor: asString(source.gridColor ?? source.grid_color, DEFAULT_RIPPLE_GRID_CONFIG.gridColor),
    rippleIntensity: asNumber(source.rippleIntensity ?? source.ripple_intensity, DEFAULT_RIPPLE_GRID_CONFIG.rippleIntensity),
    gridSize: asNumber(source.gridSize ?? source.grid_size, DEFAULT_RIPPLE_GRID_CONFIG.gridSize),
    mouseInteraction: asBoolean(source.mouseInteraction ?? source.mouse_interaction, DEFAULT_RIPPLE_GRID_CONFIG.mouseInteraction),
    glowIntensity: asNumber(source.glowIntensity ?? source.glow_intensity, DEFAULT_RIPPLE_GRID_CONFIG.glowIntensity),
  };
}

function parseParticlesConfig(raw: unknown): ParticlesConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    particleCount: asNumber(source.particleCount ?? source.particle_count, DEFAULT_PARTICLES_CONFIG.particleCount),
    particleSpread: asNumber(source.particleSpread ?? source.particle_spread, DEFAULT_PARTICLES_CONFIG.particleSpread),
    speed: asNumber(source.speed, DEFAULT_PARTICLES_CONFIG.speed),
    particleColors: parseColorList(source.particleColors ?? source.particle_colors, DEFAULT_PARTICLES_CONFIG.particleColors),
    moveParticlesOnHover: asBoolean(
      source.moveParticlesOnHover ?? source.move_particles_on_hover,
      DEFAULT_PARTICLES_CONFIG.moveParticlesOnHover,
    ),
    particleBaseSize: asNumber(source.particleBaseSize ?? source.particle_base_size, DEFAULT_PARTICLES_CONFIG.particleBaseSize),
  };
}

function parsePlasmaConfig(raw: unknown): PlasmaConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    color: asString(source.color, DEFAULT_PLASMA_CONFIG.color),
    speed: asNumber(source.speed, DEFAULT_PLASMA_CONFIG.speed),
    scale: asNumber(source.scale, DEFAULT_PLASMA_CONFIG.scale),
    opacity: asNumber(source.opacity, DEFAULT_PLASMA_CONFIG.opacity),
    mouseInteractive: asBoolean(source.mouseInteractive ?? source.mouse_interactive, DEFAULT_PLASMA_CONFIG.mouseInteractive),
  };
}

function parseGalaxyConfig(raw: unknown): GalaxyConfig {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    density: asNumber(source.density, DEFAULT_GALAXY_CONFIG.density),
    hueShift: asNumber(source.hueShift ?? source.hue_shift, DEFAULT_GALAXY_CONFIG.hueShift),
    glowIntensity: asNumber(source.glowIntensity ?? source.glow_intensity, DEFAULT_GALAXY_CONFIG.glowIntensity),
    speed: asNumber(source.speed, DEFAULT_GALAXY_CONFIG.speed),
    mouseRepulsion: asBoolean(source.mouseRepulsion ?? source.mouse_repulsion, DEFAULT_GALAXY_CONFIG.mouseRepulsion),
    twinkleIntensity: asNumber(source.twinkleIntensity ?? source.twinkle_intensity, DEFAULT_GALAXY_CONFIG.twinkleIntensity),
  };
}

export function parseSiteBackgroundConfig(metadata: unknown): SiteBackgroundConfig {
  const meta =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? (metadata as Record<string, unknown>)
      : {};
  const background =
    meta.background && typeof meta.background === "object" && !Array.isArray(meta.background)
      ? (meta.background as Record<string, unknown>)
      : {};

  return {
    type: parseBackgroundType(background.type),
    dotField: parseDotFieldConfig(background.dotField ?? background.dot_field),
    webcamPixelGrid: parseWebcamPixelGridConfig(
      background.webcamPixelGrid ?? background.webcam_pixel_grid,
    ),
    aurora: parseAuroraConfig(background.aurora),
    rippleGrid: parseRippleGridConfig(background.rippleGrid ?? background.ripple_grid),
    particles: parseParticlesConfig(background.particles),
    plasma: parsePlasmaConfig(background.plasma),
    galaxy: parseGalaxyConfig(background.galaxy),
  };
}

export function serializeSiteBackgroundConfig(config: SiteBackgroundConfig): Record<string, unknown> {
  return {
    type: config.type,
    dotField: config.dotField,
    webcamPixelGrid: config.webcamPixelGrid,
    aurora: config.aurora,
    rippleGrid: config.rippleGrid,
    particles: config.particles,
    plasma: config.plasma,
    galaxy: config.galaxy,
  };
}

export function hasLayeredSiteBackground(type: SiteBackgroundType): boolean {
  return type !== "pastel-mesh";
}

export function siteBackgroundConfigFromFormData(
  formData: FormData,
  existing: SiteBackgroundConfig,
): SiteBackgroundConfig {
  const typeRaw = String(formData.get("background_type") ?? existing.type).trim();
  const type = isSiteBackgroundType(typeRaw) ? typeRaw : existing.type;

  return {
    type,
    dotField: type === "dot-field" ? dotFieldConfigFromFormData(formData) : existing.dotField,
    webcamPixelGrid:
      type === "webcam-pixel-grid" ? webcamPixelGridConfigFromFormData(formData) : existing.webcamPixelGrid,
    aurora: type === "aurora" ? auroraConfigFromFormData(formData) : existing.aurora,
    rippleGrid: type === "ripple-grid" ? rippleGridConfigFromFormData(formData) : existing.rippleGrid,
    particles: type === "particles" ? particlesConfigFromFormData(formData) : existing.particles,
    plasma: type === "plasma" ? plasmaConfigFromFormData(formData) : existing.plasma,
    galaxy: type === "galaxy" ? galaxyConfigFromFormData(formData) : existing.galaxy,
  };
}

export function dotFieldConfigFromFormData(formData: FormData): DotFieldConfig {
  return {
    dotRadius: asNumber(formData.get("dot_radius"), DEFAULT_DOT_FIELD_CONFIG.dotRadius),
    dotSpacing: asNumber(formData.get("dot_spacing"), DEFAULT_DOT_FIELD_CONFIG.dotSpacing),
    bulgeStrength: asNumber(formData.get("bulge_strength"), DEFAULT_DOT_FIELD_CONFIG.bulgeStrength),
    glowRadius: asNumber(formData.get("glow_radius"), DEFAULT_DOT_FIELD_CONFIG.glowRadius),
    sparkle: readBoolean(formData, "sparkle"),
    waveAmplitude: asNumber(formData.get("wave_amplitude"), DEFAULT_DOT_FIELD_CONFIG.waveAmplitude),
    cursorRadius: asNumber(formData.get("cursor_radius"), DEFAULT_DOT_FIELD_CONFIG.cursorRadius),
    cursorForce: asNumber(formData.get("cursor_force"), DEFAULT_DOT_FIELD_CONFIG.cursorForce),
    bulgeOnly: readBoolean(formData, "bulge_only"),
    gradientFrom: asString(formData.get("gradient_from"), DEFAULT_DOT_FIELD_CONFIG.gradientFrom),
    gradientTo: asString(formData.get("gradient_to"), DEFAULT_DOT_FIELD_CONFIG.gradientTo),
    glowColor: asString(formData.get("glow_color"), DEFAULT_DOT_FIELD_CONFIG.glowColor),
  };
}

export function webcamPixelGridConfigFromFormData(formData: FormData): WebcamPixelGridConfig {
  const colorModeRaw = asString(formData.get("wpg_color_mode"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.colorMode);
  return {
    gridCols: asNumber(formData.get("wpg_grid_cols"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gridCols),
    gridRows: asNumber(formData.get("wpg_grid_rows"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gridRows),
    maxElevation: asNumber(formData.get("wpg_max_elevation"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.maxElevation),
    motionSensitivity: asNumber(
      formData.get("wpg_motion_sensitivity"),
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.motionSensitivity,
    ),
    elevationSmoothing: asNumber(
      formData.get("wpg_elevation_smoothing"),
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.elevationSmoothing,
    ),
    colorMode: colorModeRaw === "monochrome" ? "monochrome" : "webcam",
    monochromeColor: asString(
      formData.get("wpg_monochrome_color"),
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.monochromeColor,
    ),
    backgroundColor: asString(
      formData.get("wpg_background_color"),
      DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.backgroundColor,
    ),
    mirror: readBoolean(formData, "wpg_mirror"),
    gapRatio: asNumber(formData.get("wpg_gap_ratio"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.gapRatio),
    invertColors: readBoolean(formData, "wpg_invert_colors"),
    darken: asNumber(formData.get("wpg_darken"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.darken),
    borderColor: asString(formData.get("wpg_border_color"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.borderColor),
    borderOpacity: asNumber(formData.get("wpg_border_opacity"), DEFAULT_WEBCAM_PIXEL_GRID_CONFIG.borderOpacity),
  };
}

export function auroraConfigFromFormData(formData: FormData): AuroraConfig {
  const colors = parseColorList(formData.get("aurora_colors"), [...DEFAULT_AURORA_CONFIG.colorStops]);
  return {
    colorStops: [colors[0] ?? DEFAULT_AURORA_CONFIG.colorStops[0], colors[1] ?? DEFAULT_AURORA_CONFIG.colorStops[1], colors[2] ?? colors[0] ?? DEFAULT_AURORA_CONFIG.colorStops[2]],
    amplitude: asNumber(formData.get("aurora_amplitude"), DEFAULT_AURORA_CONFIG.amplitude),
    blend: asNumber(formData.get("aurora_blend"), DEFAULT_AURORA_CONFIG.blend),
    speed: asNumber(formData.get("aurora_speed"), DEFAULT_AURORA_CONFIG.speed),
  };
}

export function rippleGridConfigFromFormData(formData: FormData): RippleGridConfig {
  return {
    enableRainbow: readBoolean(formData, "rg_enable_rainbow"),
    gridColor: asString(formData.get("rg_grid_color"), DEFAULT_RIPPLE_GRID_CONFIG.gridColor),
    rippleIntensity: asNumber(formData.get("rg_ripple_intensity"), DEFAULT_RIPPLE_GRID_CONFIG.rippleIntensity),
    gridSize: asNumber(formData.get("rg_grid_size"), DEFAULT_RIPPLE_GRID_CONFIG.gridSize),
    mouseInteraction: readBoolean(formData, "rg_mouse_interaction"),
    glowIntensity: asNumber(formData.get("rg_glow_intensity"), DEFAULT_RIPPLE_GRID_CONFIG.glowIntensity),
  };
}

export function particlesConfigFromFormData(formData: FormData): ParticlesConfig {
  return {
    particleCount: asNumber(formData.get("pt_particle_count"), DEFAULT_PARTICLES_CONFIG.particleCount),
    particleSpread: asNumber(formData.get("pt_particle_spread"), DEFAULT_PARTICLES_CONFIG.particleSpread),
    speed: asNumber(formData.get("pt_speed"), DEFAULT_PARTICLES_CONFIG.speed),
    particleColors: parseColorList(formData.get("pt_colors"), DEFAULT_PARTICLES_CONFIG.particleColors),
    moveParticlesOnHover: readBoolean(formData, "pt_move_on_hover"),
    particleBaseSize: asNumber(formData.get("pt_base_size"), DEFAULT_PARTICLES_CONFIG.particleBaseSize),
  };
}

export function plasmaConfigFromFormData(formData: FormData): PlasmaConfig {
  return {
    color: asString(formData.get("plasma_color"), DEFAULT_PLASMA_CONFIG.color),
    speed: asNumber(formData.get("plasma_speed"), DEFAULT_PLASMA_CONFIG.speed),
    scale: asNumber(formData.get("plasma_scale"), DEFAULT_PLASMA_CONFIG.scale),
    opacity: asNumber(formData.get("plasma_opacity"), DEFAULT_PLASMA_CONFIG.opacity),
    mouseInteractive: readBoolean(formData, "plasma_mouse_interactive"),
  };
}

export function galaxyConfigFromFormData(formData: FormData): GalaxyConfig {
  return {
    density: asNumber(formData.get("gx_density"), DEFAULT_GALAXY_CONFIG.density),
    hueShift: asNumber(formData.get("gx_hue_shift"), DEFAULT_GALAXY_CONFIG.hueShift),
    glowIntensity: asNumber(formData.get("gx_glow_intensity"), DEFAULT_GALAXY_CONFIG.glowIntensity),
    speed: asNumber(formData.get("gx_speed"), DEFAULT_GALAXY_CONFIG.speed),
    mouseRepulsion: readBoolean(formData, "gx_mouse_repulsion"),
    twinkleIntensity: asNumber(formData.get("gx_twinkle_intensity"), DEFAULT_GALAXY_CONFIG.twinkleIntensity),
  };
}
