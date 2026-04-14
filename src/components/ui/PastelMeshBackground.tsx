"use client";

import type { CSSProperties } from "react";

const baseStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -1,
  overflow: "hidden",
  backgroundColor: "#FDFAF8",
};

const blobBaseStyle: CSSProperties = {
  position: "absolute",
  width: 600,
  height: 600,
  borderRadius: "50%",
  filter: "blur(90px)",
  opacity: 0.4,
  pointerEvents: "none",
};

export function PastelMeshBackground() {
  return (
    <div style={baseStyle} aria-hidden>
      <div
        className="pmb-blob"
        style={{
          ...blobBaseStyle,
          top: "-10%",
          left: "-10%",
          background: "#FDE8E8",
          animation: "pmbFloatA 25s ease-in-out infinite alternate",
        }}
      />
      <div
        className="pmb-blob"
        style={{
          ...blobBaseStyle,
          top: "30%",
          right: "-15%",
          background: "#F9D0C4",
          animation: "pmbFloatB 31s ease-in-out infinite alternate",
        }}
      />
      <div
        className="pmb-blob"
        style={{
          ...blobBaseStyle,
          bottom: "10%",
          left: "20%",
          background: "#F7E6C4",
          animation: "pmbFloatC 38s ease-in-out infinite alternate",
        }}
      />
      <div
        className="pmb-blob"
        style={{
          ...blobBaseStyle,
          top: "-5%",
          right: "30%",
          background: "#E8F4E8",
          animation: "pmbFloatD 29s ease-in-out infinite alternate",
        }}
      />

      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}
      >
        <filter id="pmb-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pmb-noise)" />
      </svg>

      <style>{`
        @keyframes pmbFloatA {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(40px, 28px, 0) scale(1.08); }
        }
        @keyframes pmbFloatB {
          0% { transform: translate3d(0, 0, 0) scale(1.02); }
          100% { transform: translate3d(-48px, 34px, 0) scale(1.1); }
        }
        @keyframes pmbFloatC {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(44px, -36px, 0) scale(1.06); }
        }
        @keyframes pmbFloatD {
          0% { transform: translate3d(0, 0, 0) scale(1.01); }
          100% { transform: translate3d(-36px, 24px, 0) scale(1.09); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pmb-blob {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PastelMeshBackground;

