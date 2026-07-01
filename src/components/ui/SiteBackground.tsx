"use client";

import dynamic from "next/dynamic";

import DotField from "@/components/ui/DotField";
import { PastelMeshBackground } from "@/components/ui/PastelMeshBackground";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";
import type { SiteBackgroundConfig } from "@/lib/theme/site-background";

const Aurora = dynamic(() => import("@/components/ui/backgrounds/Aurora"), { ssr: false });
const RippleGrid = dynamic(() => import("@/components/ui/backgrounds/RippleGrid"), { ssr: false });
const Particles = dynamic(() => import("@/components/ui/backgrounds/Particles"), { ssr: false });
const Plasma = dynamic(() => import("@/components/ui/backgrounds/Plasma"), { ssr: false });
const Galaxy = dynamic(() => import("@/components/ui/backgrounds/Galaxy"), { ssr: false });

function LayerShell({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {children}
    </div>
  );
}

export function SiteBackground({ config }: { config: SiteBackgroundConfig }) {
  if (config.type === "pastel-mesh") {
    return <PastelMeshBackground />;
  }

  if (config.type === "webcam-pixel-grid") {
    const webcam = config.webcamPixelGrid;
    return (
      <LayerShell>
        <WebcamPixelGrid
          gridCols={webcam.gridCols}
          gridRows={webcam.gridRows}
          maxElevation={webcam.maxElevation}
          motionSensitivity={webcam.motionSensitivity}
          elevationSmoothing={webcam.elevationSmoothing}
          colorMode={webcam.colorMode}
          monochromeColor={webcam.monochromeColor}
          backgroundColor={webcam.backgroundColor}
          mirror={webcam.mirror}
          gapRatio={webcam.gapRatio}
          invertColors={webcam.invertColors}
          darken={webcam.darken}
          borderColor={webcam.borderColor}
          borderOpacity={webcam.borderOpacity}
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </LayerShell>
    );
  }

  if (config.type === "aurora") {
    const aurora = config.aurora;
    return (
      <LayerShell>
        <Aurora
          colorStops={[...aurora.colorStops]}
          amplitude={aurora.amplitude}
          blend={aurora.blend}
          speed={aurora.speed}
        />
      </LayerShell>
    );
  }

  if (config.type === "ripple-grid") {
    const ripple = config.rippleGrid;
    return (
      <LayerShell>
        <RippleGrid
          enableRainbow={ripple.enableRainbow}
          gridColor={ripple.gridColor}
          rippleIntensity={ripple.rippleIntensity}
          gridSize={ripple.gridSize}
          mouseInteraction={ripple.mouseInteraction}
          glowIntensity={ripple.glowIntensity}
        />
      </LayerShell>
    );
  }

  if (config.type === "particles") {
    const particles = config.particles;
    return (
      <LayerShell>
        <Particles
          particleCount={particles.particleCount}
          particleSpread={particles.particleSpread}
          speed={particles.speed}
          particleColors={particles.particleColors}
          moveParticlesOnHover={particles.moveParticlesOnHover}
          particleBaseSize={particles.particleBaseSize}
          className="h-full w-full"
        />
      </LayerShell>
    );
  }

  if (config.type === "plasma") {
    const plasma = config.plasma;
    return (
      <LayerShell>
        <Plasma
          color={plasma.color}
          speed={plasma.speed}
          scale={plasma.scale}
          opacity={plasma.opacity}
          mouseInteractive={plasma.mouseInteractive}
        />
      </LayerShell>
    );
  }

  if (config.type === "galaxy") {
    const galaxy = config.galaxy;
    return (
      <LayerShell>
        <Galaxy
          density={galaxy.density}
          hueShift={galaxy.hueShift}
          glowIntensity={galaxy.glowIntensity}
          speed={galaxy.speed}
          mouseRepulsion={galaxy.mouseRepulsion}
          twinkleIntensity={galaxy.twinkleIntensity}
          transparent
          className="h-full w-full"
        />
      </LayerShell>
    );
  }

  const dot = config.dotField;
  return (
    <LayerShell>
      <DotField
        dotRadius={dot.dotRadius}
        dotSpacing={dot.dotSpacing}
        bulgeStrength={dot.bulgeStrength}
        glowRadius={dot.glowRadius}
        sparkle={dot.sparkle}
        waveAmplitude={dot.waveAmplitude}
        cursorRadius={dot.cursorRadius}
        cursorForce={dot.cursorForce}
        bulgeOnly={dot.bulgeOnly}
        gradientFrom={dot.gradientFrom}
        gradientTo={dot.gradientTo}
        glowColor={dot.glowColor}
      />
    </LayerShell>
  );
}
