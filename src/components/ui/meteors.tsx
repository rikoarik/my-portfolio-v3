"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteors, setMeteors] = useState<
    { id: number; left: number; top: number; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    // Generate meteors only on client to avoid hydration mismatch
    setMeteors(
      new Array(number).fill(true).map((_, idx) => ({
        id: idx,
        // Spread wider so meteors falling leftwards still cover the screen
        left: Math.floor(Math.random() * (window.innerWidth + 800)),
        // Cover entire vertical height (plus offset)
        top: Math.floor(Math.random() * window.innerHeight) - 200,
        delay: Math.random() * (1.5 - 0.2) + 0.2 + "s",
        duration: Math.floor(Math.random() * (12 - 4) + 4) + "s",
      }))
    );
  }, [number]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "animate-meteor-effect absolute h-[1px] w-[60px] rounded-[9999px] bg-slate-400/40 shadow-[0_0_0_1px_#ffffff10]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[60px] before:h-[1px] before:bg-gradient-to-r before:from-slate-400/50 before:to-transparent",
            className
          )}
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        ></span>
      ))}
    </div>
  );
};
