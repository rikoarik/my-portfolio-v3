"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { Project } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}

function ProjectModal({
  project,
  onClose,
  mounted,
}: {
  project: Project;
  onClose: () => void;
  mounted: boolean;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const modalEl = modalRef.current;
    if (!backdrop || !modalEl) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.24 }).fromTo(
      modalEl,
      { opacity: 0, y: 44, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.34 },
      "<+0.03"
    );

    return () => {
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  const inner = (
    <div ref={backdropRef} className="ifs-modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="ifs-modal ifs-modal--project"
        role="dialog"
        aria-modal="true"
        aria-label={`Project: ${project.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ifs-modal-close" onClick={onClose}>
          Close
        </button>

        {project.cover_url ? (
          <div className="ifs-modal-cover">
            <img src={project.cover_url} alt="" className="ifs-modal-cover-img" />
          </div>
        ) : null}

        <div className="ifs-subheading" style={{ marginBottom: "0.5rem" }}>
          Project
        </div>
        <h3 className="ifs-project-title">{project.title}</h3>
        {project.subtitle ? (
          <p className="ifs-project-subtitle">{project.subtitle}</p>
        ) : null}
        {project.period_label ? (
          <p className="ifs-project-meta">{project.period_label}</p>
        ) : null}

        <div className="ifs-project-tags" style={{ marginTop: "1rem" }}>
          {(project.tags ?? []).slice(0, 8).map((t) => (
            <span key={`t-${t}`} className="ifs-project-tag">
              {t}
            </span>
          ))}
          {project.stack.slice(0, 10).map((s) => (
            <span key={`s-${s}`} className="ifs-project-tag">
              {s}
            </span>
          ))}
        </div>

        <ul className="ifs-case-list" style={{ marginTop: "1.5rem" }}>
          {project.bullets.slice(0, 6).map((b, i) => (
            <li key={`b-${project.id}-${i}`}>{b}</li>
          ))}
        </ul>

        {project.case_study ? (
          <div className="ifs-case-grid" style={{ marginTop: "1.5rem" }}>
            <div className="ifs-case-block">
              <div className="ifs-case-label">Problem</div>
              <p className="ifs-case-text">{project.case_study.problem}</p>
            </div>
            <div className="ifs-case-block">
              <div className="ifs-case-label">Solution</div>
              <p className="ifs-case-text">{project.case_study.solution}</p>
            </div>
          </div>
        ) : null}

        {project.repo_url || project.demo_url ? (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {project.repo_url ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn"
              >
                Repo ↗
              </a>
            ) : null}
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn ifs-pill-btn--primary"
              >
                Demo ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(inner, document.body);
}

function ProjectCoverFrame({ project, index }: { project: Project; index: number }) {
  const src = project.cover_url?.trim();
  if (src) {
    return (
      <div className="ifs-project-cover-frame">
        <img src={src} alt="" className="ifs-project-cover-img" loading="lazy" decoding="async" />
        <div className="ifs-project-cover-shine" aria-hidden />
      </div>
    );
  }
  return (
    <div className="ifs-project-cover-frame ifs-project-cover-frame--placeholder">
      <div className="ifs-project-cover-gradient" aria-hidden />
      <span className="ifs-project-cover-ix font-mono-meta">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="ifs-project-cover-watermark">{project.title}</p>
    </div>
  );
}

export function IFProjectsSection({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<Project | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const ordered = useMemo(() => sortProjects(projects), [projects]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-showcase]");

      cards.forEach((card) => {
        const isFlip = card.classList.contains("ifs-project-showcase--flip");
        gsap.fromTo(
          card,
          { opacity: 0, x: isFlip ? 72 : -72, y: 26 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.82,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      const interactions: Array<() => void> = [];
      const cardButtons = root.querySelectorAll<HTMLElement>("[data-project-card]");

      cardButtons.forEach((button) => {
        const visual = button.querySelector<HTMLElement>(".ifs-project-showcase-visual");
        const frame = button.querySelector<HTMLElement>(".ifs-project-cover-frame");
        const cover = button.querySelector<HTMLElement>(".ifs-project-cover-img");

        const onMove = (e: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const px = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const py = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          gsap.to(button, {
            rotateY: px * 5.5,
            rotateX: py * -4.8,
            x: px * 6,
            y: py * 4,
            duration: 0.3,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.to(visual, {
            x: px * 7,
            y: py * 5,
            duration: 0.34,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.to(frame, {
            rotateY: px * 1.2,
            rotateX: py * -1.2,
            duration: 0.34,
            ease: "power3.out",
            overwrite: true,
          });
          if (cover) {
            gsap.to(cover, {
              x: px * -14,
              y: py * -10,
              scale: 1.08,
              duration: 0.38,
              ease: "power3.out",
              overwrite: true,
            });
          }
        };

        const onLeave = () => {
          gsap.to(button, {
            rotateY: 0,
            rotateX: 0,
            x: 0,
            y: 0,
            duration: 0.42,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.to([visual, frame], {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            duration: 0.42,
            ease: "power3.out",
            overwrite: true,
          });
          if (cover) {
            gsap.to(cover, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.42,
              ease: "power3.out",
              overwrite: true,
            });
          }
        };

        button.addEventListener("mousemove", onMove);
        button.addEventListener("mouseleave", onLeave);
        button.addEventListener("blur", onLeave);

        interactions.push(() => {
          button.removeEventListener("mousemove", onMove);
          button.removeEventListener("mouseleave", onLeave);
          button.removeEventListener("blur", onLeave);
        });
      });

      return () => interactions.forEach((dispose) => dispose());
    }, root);

    return () => ctx.revert();
  }, [ordered]);

  return (
    <section
      ref={rootRef}
      id="projects"
      aria-labelledby="projects-title"
      className="ifs-section ifs-projects-section"
    >
      <header className="ifs-projects-header mx-auto mb-14 flex max-w-4xl flex-col gap-4 px-6 md:mb-20">
        <p className="ifs-projects-kicker font-mono-meta text-[0.65rem] uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
          Portfolio
        </p>
        <TextReveal as="h2" id="projects-title" text="Projects" className="ifs-heading !mb-0" />
        <p className="ifs-projects-lead max-w-xl text-[var(--muted-foreground)]">
          Case studies and shipped work—full-width previews, detail on demand. Built for screenshots and
          motion later.
        </p>
      </header>

      <div className="ifs-projects-list mx-auto max-w-6xl space-y-20 px-6 pb-8 md:space-y-28 md:px-8">
        {ordered.map((p, i) => (
          <article
            key={p.id}
            data-project-showcase
            className={`ifs-project-showcase ${
              i % 2 === 1 ? "ifs-project-showcase--flip" : ""
            }`}
          >
            <button
              type="button"
              className="ifs-project-showcase-grid text-left"
              onClick={() => setModal(p)}
              aria-label={`Open project: ${p.title}`}
              data-cursor
              data-cursor-text="OPEN"
              data-project-card
            >
              <div className="ifs-project-showcase-visual">
                <ProjectCoverFrame project={p} index={i} />
              </div>
              <div className="ifs-project-showcase-copy">
                <div className="ifs-project-showcase-meta font-mono-meta">
                  {p.period_label ?? "—"}
                  {p.featured ? (
                    <span className="ifs-project-showcase-badge">Featured</span>
                  ) : null}
                </div>
                <h3 className="ifs-project-showcase-title">{p.title}</h3>
                {p.subtitle ? (
                  <p className="ifs-project-showcase-sub">{p.subtitle}</p>
                ) : null}
                <div className="ifs-project-showcase-tags">
                  {(p.tags ?? []).slice(0, 4).map((t) => (
                    <span key={t} className="ifs-project-showcase-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="ifs-project-showcase-cta font-mono-meta">
                  View detail →
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {modal && portalMounted ? (
        <ProjectModal
          project={modal}
          onClose={() => setModal(null)}
          mounted={portalMounted}
        />
      ) : null}
    </section>
  );
}
