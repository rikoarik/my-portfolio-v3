"use client";

import { useState } from "react";

import { AdminField } from "@/components/admin/AdminField";
import type { SiteBackgroundConfig, SiteBackgroundType } from "@/lib/theme/site-background";
import {
  isSiteBackgroundType,
  SITE_BACKGROUND_OPTIONS,
} from "@/lib/theme/site-background-catalog";

const inputClass =
  "h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 text-sm";

export function BackgroundSettingsFields({ background }: { background: SiteBackgroundConfig }) {
  const [backgroundType, setBackgroundType] = useState<SiteBackgroundType>(background.type);
  const selected = SITE_BACKGROUND_OPTIONS.find((option) => option.value === backgroundType);
  const dot = background.dotField;
  const webcam = background.webcamPixelGrid;
  const aurora = background.aurora;
  const ripple = background.rippleGrid;
  const particles = background.particles;
  const plasma = background.plasma;
  const galaxy = background.galaxy;

  return (
    <fieldset className="sm:col-span-2 space-y-3 rounded-lg border border-[var(--border)] p-3">
      <legend className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        Background situs
      </legend>
      <p className="text-xs text-[var(--muted-foreground)]">
        {selected?.hint ?? "Background fullscreen untuk template Infinite Field."} Simpan lalu hard
        refresh homepage.
      </p>

      <AdminField label="Tipe background" htmlFor="background_type">
        <select
          id="background_type"
          name="background_type"
          value={backgroundType}
          onChange={(e) => {
            const next = e.target.value;
            if (isSiteBackgroundType(next)) setBackgroundType(next);
          }}
          className={inputClass}
        >
          {SITE_BACKGROUND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminField>

      {backgroundType === "dot-field" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Dot radius" htmlFor="dot_radius">
            <input id="dot_radius" name="dot_radius" type="number" step="0.1" defaultValue={dot.dotRadius} className={inputClass} />
          </AdminField>
          <AdminField label="Dot spacing" htmlFor="dot_spacing">
            <input id="dot_spacing" name="dot_spacing" type="number" step="1" defaultValue={dot.dotSpacing} className={inputClass} />
          </AdminField>
          <AdminField label="Bulge strength" htmlFor="bulge_strength">
            <input id="bulge_strength" name="bulge_strength" type="number" step="1" defaultValue={dot.bulgeStrength} className={inputClass} />
          </AdminField>
          <AdminField label="Glow radius" htmlFor="glow_radius">
            <input id="glow_radius" name="glow_radius" type="number" step="1" defaultValue={dot.glowRadius} className={inputClass} />
          </AdminField>
          <AdminField label="Gradient from" htmlFor="gradient_from">
            <input id="gradient_from" name="gradient_from" defaultValue={dot.gradientFrom} className={inputClass} />
          </AdminField>
          <AdminField label="Gradient to" htmlFor="gradient_to">
            <input id="gradient_to" name="gradient_to" defaultValue={dot.gradientTo} className={inputClass} />
          </AdminField>
          <AdminField label="Glow color" htmlFor="glow_color">
            <input id="glow_color" name="glow_color" defaultValue={dot.glowColor} className={inputClass} />
          </AdminField>
          <AdminField label="Bulge only" htmlFor="bulge_only">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="bulge_only" name="bulge_only" type="checkbox" defaultChecked={dot.bulgeOnly} className="size-4" />
              Bulge-only mode
            </label>
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "webcam-pixel-grid" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Grid cols" htmlFor="wpg_grid_cols">
            <input id="wpg_grid_cols" name="wpg_grid_cols" type="number" defaultValue={webcam.gridCols} className={inputClass} />
          </AdminField>
          <AdminField label="Grid rows" htmlFor="wpg_grid_rows">
            <input id="wpg_grid_rows" name="wpg_grid_rows" type="number" defaultValue={webcam.gridRows} className={inputClass} />
          </AdminField>
          <AdminField label="Motion sensitivity" htmlFor="wpg_motion_sensitivity">
            <input id="wpg_motion_sensitivity" name="wpg_motion_sensitivity" type="number" step="0.01" defaultValue={webcam.motionSensitivity} className={inputClass} />
          </AdminField>
          <AdminField label="Darken" htmlFor="wpg_darken">
            <input id="wpg_darken" name="wpg_darken" type="number" step="0.01" defaultValue={webcam.darken} className={inputClass} />
          </AdminField>
          <AdminField label="Background color" htmlFor="wpg_background_color">
            <input id="wpg_background_color" name="wpg_background_color" defaultValue={webcam.backgroundColor} className={inputClass} />
          </AdminField>
          <AdminField label="Mirror webcam" htmlFor="wpg_mirror">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="wpg_mirror" name="wpg_mirror" type="checkbox" defaultChecked={webcam.mirror} className="size-4" />
              Cerminkan feed
            </label>
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "aurora" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Colors (comma)" htmlFor="aurora_colors" className="sm:col-span-2">
            <input id="aurora_colors" name="aurora_colors" defaultValue={aurora.colorStops.join(", ")} className={inputClass} />
          </AdminField>
          <AdminField label="Amplitude" htmlFor="aurora_amplitude">
            <input id="aurora_amplitude" name="aurora_amplitude" type="number" step="0.1" defaultValue={aurora.amplitude} className={inputClass} />
          </AdminField>
          <AdminField label="Blend" htmlFor="aurora_blend">
            <input id="aurora_blend" name="aurora_blend" type="number" step="0.1" defaultValue={aurora.blend} className={inputClass} />
          </AdminField>
          <AdminField label="Speed" htmlFor="aurora_speed">
            <input id="aurora_speed" name="aurora_speed" type="number" step="0.1" defaultValue={aurora.speed} className={inputClass} />
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "ripple-grid" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Grid color" htmlFor="rg_grid_color">
            <input id="rg_grid_color" name="rg_grid_color" defaultValue={ripple.gridColor} className={inputClass} />
          </AdminField>
          <AdminField label="Ripple intensity" htmlFor="rg_ripple_intensity">
            <input id="rg_ripple_intensity" name="rg_ripple_intensity" type="number" step="0.01" defaultValue={ripple.rippleIntensity} className={inputClass} />
          </AdminField>
          <AdminField label="Grid size" htmlFor="rg_grid_size">
            <input id="rg_grid_size" name="rg_grid_size" type="number" step="0.1" defaultValue={ripple.gridSize} className={inputClass} />
          </AdminField>
          <AdminField label="Glow intensity" htmlFor="rg_glow_intensity">
            <input id="rg_glow_intensity" name="rg_glow_intensity" type="number" step="0.01" defaultValue={ripple.glowIntensity} className={inputClass} />
          </AdminField>
          <AdminField label="Mouse interaction" htmlFor="rg_mouse_interaction">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="rg_mouse_interaction" name="rg_mouse_interaction" type="checkbox" defaultChecked={ripple.mouseInteraction} className="size-4" />
              Ikuti cursor
            </label>
          </AdminField>
          <AdminField label="Rainbow mode" htmlFor="rg_enable_rainbow">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="rg_enable_rainbow" name="rg_enable_rainbow" type="checkbox" defaultChecked={ripple.enableRainbow} className="size-4" />
              Rainbow grid
            </label>
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "particles" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Colors (comma)" htmlFor="pt_colors" className="sm:col-span-2">
            <input id="pt_colors" name="pt_colors" defaultValue={particles.particleColors.join(", ")} className={inputClass} />
          </AdminField>
          <AdminField label="Particle count" htmlFor="pt_particle_count">
            <input id="pt_particle_count" name="pt_particle_count" type="number" defaultValue={particles.particleCount} className={inputClass} />
          </AdminField>
          <AdminField label="Speed" htmlFor="pt_speed">
            <input id="pt_speed" name="pt_speed" type="number" step="0.01" defaultValue={particles.speed} className={inputClass} />
          </AdminField>
          <AdminField label="Spread" htmlFor="pt_particle_spread">
            <input id="pt_particle_spread" name="pt_particle_spread" type="number" step="0.1" defaultValue={particles.particleSpread} className={inputClass} />
          </AdminField>
          <AdminField label="Base size" htmlFor="pt_base_size">
            <input id="pt_base_size" name="pt_base_size" type="number" defaultValue={particles.particleBaseSize} className={inputClass} />
          </AdminField>
          <AdminField label="Hover react" htmlFor="pt_move_on_hover">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="pt_move_on_hover" name="pt_move_on_hover" type="checkbox" defaultChecked={particles.moveParticlesOnHover} className="size-4" />
              Gerak saat hover
            </label>
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "plasma" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Color" htmlFor="plasma_color">
            <input id="plasma_color" name="plasma_color" defaultValue={plasma.color} className={inputClass} />
          </AdminField>
          <AdminField label="Speed" htmlFor="plasma_speed">
            <input id="plasma_speed" name="plasma_speed" type="number" step="0.1" defaultValue={plasma.speed} className={inputClass} />
          </AdminField>
          <AdminField label="Scale" htmlFor="plasma_scale">
            <input id="plasma_scale" name="plasma_scale" type="number" step="0.1" defaultValue={plasma.scale} className={inputClass} />
          </AdminField>
          <AdminField label="Opacity" htmlFor="plasma_opacity">
            <input id="plasma_opacity" name="plasma_opacity" type="number" step="0.05" defaultValue={plasma.opacity} className={inputClass} />
          </AdminField>
          <AdminField label="Mouse interactive" htmlFor="plasma_mouse_interactive">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="plasma_mouse_interactive" name="plasma_mouse_interactive" type="checkbox" defaultChecked={plasma.mouseInteractive} className="size-4" />
              Ikuti cursor
            </label>
          </AdminField>
        </div>
      ) : null}

      {backgroundType === "galaxy" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Density" htmlFor="gx_density">
            <input id="gx_density" name="gx_density" type="number" step="0.1" defaultValue={galaxy.density} className={inputClass} />
          </AdminField>
          <AdminField label="Hue shift" htmlFor="gx_hue_shift">
            <input id="gx_hue_shift" name="gx_hue_shift" type="number" step="1" defaultValue={galaxy.hueShift} className={inputClass} />
          </AdminField>
          <AdminField label="Glow intensity" htmlFor="gx_glow_intensity">
            <input id="gx_glow_intensity" name="gx_glow_intensity" type="number" step="0.05" defaultValue={galaxy.glowIntensity} className={inputClass} />
          </AdminField>
          <AdminField label="Speed" htmlFor="gx_speed">
            <input id="gx_speed" name="gx_speed" type="number" step="0.1" defaultValue={galaxy.speed} className={inputClass} />
          </AdminField>
          <AdminField label="Twinkle" htmlFor="gx_twinkle_intensity">
            <input id="gx_twinkle_intensity" name="gx_twinkle_intensity" type="number" step="0.05" defaultValue={galaxy.twinkleIntensity} className={inputClass} />
          </AdminField>
          <AdminField label="Mouse repulsion" htmlFor="gx_mouse_repulsion">
            <label className="flex h-10 items-center gap-2 text-sm">
              <input id="gx_mouse_repulsion" name="gx_mouse_repulsion" type="checkbox" defaultChecked={galaxy.mouseRepulsion} className="size-4" />
              Tolak cursor
            </label>
          </AdminField>
        </div>
      ) : null}
    </fieldset>
  );
}
