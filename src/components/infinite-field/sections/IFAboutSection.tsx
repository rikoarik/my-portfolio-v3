"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { SectionContent } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";

export function IFAboutSection({
  section,
}: {
  section?: SectionContent;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerGsapPlugins();

    const ctx = gsap.context(() => {
      // Reveal intro text
      gsap.from(".ifs-about-content > *", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const headline =
    typeof section?.meta?.about_headline === "string" && section.meta.about_headline.trim()
      ? section.meta.about_headline
      : "Build products that feel clear, fast, and human.";
  const subline =
    typeof section?.meta?.about_intro === "string" && section.meta.about_intro.trim()
      ? section.meta.about_intro
      : "I turn product goals into production-ready interfaces: clean architecture, sharp UX details, and smooth interactions that help users trust what they use.";
  const philosophyTitle =
    typeof section?.subtitle === "string" && section.subtitle.trim() ? section.subtitle : "Philosophy";
  const philosophyBody =
    typeof section?.body === "string" && section.body.trim()
      ? section.body
      : "I believe in building digital experiences that don't just work, but feel emotional. Every pixel and every interaction is an opportunity to tell a story and create a connection.";
  const focusTitle =
    typeof section?.meta?.focus_title === "string" ? section.meta.focus_title : "Focus";
  const focusBody =
    typeof section?.meta?.focus_body === "string"
      ? section.meta.focus_body
      : "Specializing in high-end interactive frontend development, combining physics-based animations with editorial design aesthetics to create award-winning digital products.";

  return (
    <section ref={rootRef} id="about" aria-labelledby="about-title" className="ifs-section py-32">
      <div className="max-w-4xl">
        <TextReveal as="h2" id="about-title" text={section?.title ?? "About Me"} className="ifs-heading" />
        
        <div className="ifs-about-content">
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-6 leading-[1.05]">
            {headline}{headline && !headline.endsWith('.') ? '.' : ''}
          </h3>
          
          <p className="text-1xl text-[var(--muted-foreground)] mb-16 max-w-2xl font-medium leading-snug">
            {subline}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[var(--border)]">
            <div>
              <div className="ifs-subheading mb-4">{philosophyTitle}</div>
              <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
                {philosophyBody}
              </p>
            </div>
            <div>
              <div className="ifs-subheading mb-4">{focusTitle}</div>
              <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
                {focusBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}