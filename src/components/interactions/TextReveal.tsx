"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function TextReveal({
  text,
  as: Tag = "div",
  className = "",
  delay = 0,
  ...props
}: {
  text: string;
  as?: any;
  className?: string;
  delay?: number;
  [key: string]: any;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Disable on reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".word-inner");
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          yPercent: 120,
          rotationZ: 8,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotationZ: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.04,
          ease: "expo.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay]);

  // Split text by standard spaces
  const words = text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden align-top leading-tight -mx-[0.02em]">
      <span className="word-inner inline-block origin-bottom-left will-change-transform pb-[0.1em]">
        {word}&nbsp;
      </span>
    </span>
  ));

  return (
    <Tag ref={containerRef} className={`${className} flex flex-wrap`} {...props}>
      {words}
    </Tag>
  );
}
