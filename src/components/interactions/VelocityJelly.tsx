"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function VelocityJelly({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    // Use a proxy object so we can use quickSetter for high performance
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(el, "skewY", "deg");
    const clamp = gsap.utils.clamp(-4, 4); // Max 4 degrees of skew

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        onUpdate: (self) => {
          // Velocity is px/s. We divide to get a tiny skew value.
          const velocity = self.getVelocity();
          const skewAmount = clamp(velocity / -300);
          
          // Only animate if the skew has actually changed enough
          if (Math.abs(skewAmount) > 0.01) {
            proxy.skew = skewAmount;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`will-change-transform origin-center ${className}`}>
      {children}
    </div>
  );
}
