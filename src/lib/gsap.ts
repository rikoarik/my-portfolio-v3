"use client";

type GsapRuntime = {
  gsap: (typeof import("gsap"))["default"];
  ScrollTrigger: (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
};

let runtimePromise: Promise<GsapRuntime> | null = null;
let registered = false;

export async function loadGsap(): Promise<GsapRuntime> {
  if (!runtimePromise) {
    runtimePromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => ({
      gsap: gsapMod.default,
      ScrollTrigger: stMod.ScrollTrigger,
    }));
  }
  return runtimePromise;
}

export async function registerGsapPlugins() {
  if (registered) return;
  const { gsap, ScrollTrigger } = await loadGsap();
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}
