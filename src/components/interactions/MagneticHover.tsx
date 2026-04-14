"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

export function MagneticHover({
  children,
  strength = 30, // Max pixels the button will move
}: {
  children: ReactNode;
  strength?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;
    const element = elementRef.current;
    if (!container || !element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance from center (-1 to 1)
      const moveX = ((clientX - centerX) / (width / 2)) * strength;
      const moveY = ((clientY - centerY) / (height / 2)) * strength;

      xTo(moveX);
      yTo(moveY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={containerRef} className="magnetic-wrap relative inline-block p-4 -m-4">
      <div ref={elementRef} className="magnetic-element block">
        {children}
      </div>
    </div>
  );
}
