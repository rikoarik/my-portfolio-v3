"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/types/portfolio";
import { TextReveal } from "@/components/interactions/TextReveal";
import { InteractiveGridBackground } from "@/components/visual/InteractiveGridBackground";

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}

/** List preview: max 3 chips, tags first then stack (dedup). */
function previewTagsForList(project: Project, max = 3): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const t = raw.trim();
    if (!t || seen.has(t) || out.length >= max) return;
    seen.add(t);
    out.push(t);
  };
  for (const t of project.tags ?? []) push(t);
  for (const s of project.stack) push(s);
  return out;
}

/** Modal: full tag + stack list, dedup. */
function allTagsForModal(project: Project): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const t = raw.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  for (const t of project.tags ?? []) push(t);
  for (const s of project.stack) push(s);
  return out;
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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const titleId = `ifs-project-modal-title-${project.id}`;

  const closeWithAnim = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const backdrop = backdropRef.current;
    const modalEl = modalRef.current;
    if (!backdrop || !modalEl) {
      onClose();
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: "power3.in" },
      onComplete: onClose,
    });
    tl.to(modalEl, { opacity: 0, y: 28, scale: 0.98, duration: 0.28 }).to(
      backdrop,
      { opacity: 0, duration: 0.22 },
      "<0.05",
    );
  }, [onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWithAnim();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeWithAnim]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const modalEl = modalRef.current;
    if (!backdrop || !modalEl) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28 }).fromTo(
      modalEl,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.35)" },
      "<+0.04",
    );

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 80);

    return () => {
      window.clearTimeout(t);
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  const portalRoot =
    typeof document !== "undefined"
      ? (document.getElementById("main") ?? document.body)
      : null;
  if (!portalRoot) return null;

  const hasLinks = Boolean(project.repo_url || project.demo_url);
  const modalBullets = project.subtitle?.trim()
    ? project.bullets
    : project.bullets.slice(1);

  const inner = (
    <div
      ref={backdropRef}
      className="ifs-modal-backdrop"
      onClick={closeWithAnim}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="ifs-modal ifs-modal--project"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="ifs-modal-close"
          onClick={closeWithAnim}
          aria-label="Tutup detail proyek"
        >
          Tutup
        </button>

        <div className="ifs-modal__scroll">
          {project.cover_url ? (
            <div className="ifs-modal-cover">
              <img src={project.cover_url} alt="" className="ifs-modal-cover-img" />
            </div>
          ) : null}

          <header className="ifs-modal__header">
            <p className="ifs-subheading ifs-modal__kicker">Project</p>
            <h3 id={titleId} className="ifs-project-title ifs-modal__title">
              {project.title}
            </h3>
            {project.subtitle ? (
              <p className="ifs-project-subtitle ifs-modal__subtitle">{project.subtitle}</p>
            ) : null}
            {project.period_label ? (
              <p className="ifs-project-meta ifs-modal__meta">{project.period_label}</p>
            ) : null}
          </header>

          <div className="ifs-modal__section">
            <p className="ifs-modal__section-label font-mono-meta">Stack &amp; tags</p>
            <p className="ifs-modal__section-hint">Teknologi dan label yang dipakai di project ini.</p>
            <div className="ifs-project-tags ifs-modal__tags">
              {allTagsForModal(project).map((t) => (
                <span key={`tag-${t}`} className="ifs-project-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {modalBullets.length ? (
            <div className="ifs-modal__section">
              <p className="ifs-modal__section-label font-mono-meta">Highlights</p>
              <p className="ifs-modal__section-hint">Hasil, metrik, atau dampak utama — bukan daftar fitur.</p>
              <ul className="ifs-case-list ifs-modal__bullets">
                {modalBullets.slice(0, 6).map((b, i) => (
                  <li key={`b-${project.id}-${i}`}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.case_study ? (
            <div className="ifs-modal__section">
              <p className="ifs-modal__section-label font-mono-meta">Case study</p>
              <p className="ifs-modal__section-hint">Problem, batasan, solusi, lalu dampak terukur.</p>
              <div className="ifs-case-grid ifs-modal__case ifs-modal__case--framed">
                <div className="ifs-case-block">
                  <div className="ifs-case-label">Problem</div>
                  <p className="ifs-case-text">{project.case_study.problem}</p>
                </div>
                {project.case_study.constraints.length ? (
                  <div className="ifs-case-block">
                    <div className="ifs-case-label">Constraints</div>
                    <ul className="ifs-case-study-list">
                      {project.case_study.constraints.map((c, i) => (
                        <li key={`c-${project.id}-${i}`}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="ifs-case-block">
                  <div className="ifs-case-label">Solution</div>
                  <p className="ifs-case-text">{project.case_study.solution}</p>
                </div>
                {project.case_study.results.length ? (
                  <div className="ifs-case-block ifs-case-block--impact">
                    <div className="ifs-case-label">Impact</div>
                    <ul className="ifs-case-study-list ifs-case-study-list--impact">
                      {project.case_study.results.map((r, i) => (
                        <li key={`r-${project.id}-${i}`}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {hasLinks ? (
          <footer className="ifs-modal__cta" aria-label="Tautan proyek">
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn ifs-pill-btn--primary ifs-modal__cta-primary"
              >
                Demo {"\u2197"}
              </a>
            ) : null}
            {project.repo_url ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn ifs-modal__cta-secondary"
              >
                Repo {"\u2197"}
              </a>
            ) : null}
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(inner, portalRoot);
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

  const ordered = useMemo(() => sortProjects(projects), [projects]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      
      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;
        if (isLast) return;

        // When the NEXT card enters and scrolls up,
        // it pushes THIS card into the background (scaling it down and dimming)
        ScrollTrigger.create({
          trigger: cards[i + 1],
          start: `top bottom-=10%`,
          end: `top top+=15vh`, // Approximating sticky stop
          scrub: true,
          animation: gsap.to(card, {
            scale: 0.92 - (0.01 * i),
            opacity: 0.4,
            y: -20, // push it up slightly into the distance
            transformOrigin: "top center",
            ease: "none",
          }),
        });
      });
    }, root);

    return () => ctx.revert();
  }, [ordered]);

  return (
    <section
      ref={rootRef}
      id="projects"
      aria-labelledby="projects-title"
      className="ifs-section ifs-projects-stacking-section"
    >
      <InteractiveGridBackground />

      <div className="max-w-6xl mx-auto px-4 pb-[20vh]">
        <header className="ifs-projects-header text-center mb-[10vh] pt-[15vh]" aria-labelledby="projects-title">
          <p className="font-mono-meta text-xs uppercase tracking-[0.28em] text-[var(--muted-foreground)] mb-4">
            Portofolio
          </p>
          <TextReveal as="h2" id="projects-title" text="Selected Works" className="ifs-heading !mb-0 mx-auto" />
        </header>

        <div className="flex flex-col relative w-full ifs-stacking-container gap-[12vh]">
          {ordered.map((p, i) => {
            const listTags = previewTagsForList(p, 4);
            const impactLine = p.bullets[0]?.trim();
            
            return (
              <div
                key={p.id}
                data-project-card
                className="ifs-stacking-card"
                style={{ top: `calc(10vh + ${i * 1.5}rem)` }}
              >
                <div className="ifs-stacking-card-inner">
                  <div className="ifs-stacking-card-content flex-1 max-w-xl flex flex-col pt-4">
                    <div className="ifs-stacking-card-header flex items-center gap-4 mb-6">
                      <span className="ifs-stacking-index font-mono-meta text-6xl text-[var(--muted-foreground)] opacity-30 font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.featured && <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full font-bold uppercase tracking-wider">Unggulan</span>}
                    </div>
                    
                    <h3 className="ifs-stacking-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">{p.title}</h3>
                    <p className="ifs-stacking-desc text-[var(--muted-foreground)] text-lg leading-relaxed">{p.subtitle}</p>
                    
                    {impactLine && (
                      <div className="mt-8 p-5 bg-[var(--muted)]/30 border border-[var(--border)]/50 rounded-2xl text-sm leading-relaxed">
                        <span className="font-bold mr-2 text-[var(--foreground)]">Highlight:</span>
                        <span className="text-[var(--muted-foreground)]">{impactLine}</span>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-10 flex flex-wrap gap-2">
                       {listTags.map(t => <span key={t} className="px-3 py-1.5 border border-[var(--border)] rounded-full text-xs text-[var(--foreground)] opacity-80">{t}</span>)}
                    </div>
                    
                    <button 
                      onClick={() => setModal(p)}
                      className="mt-8 flex items-center justify-between gap-3 text-sm font-bold antialiased border border-[var(--border)] pl-6 pr-4 py-3 rounded-full w-max hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors group"
                    >
                      Lihat Detail 
                      <span className="w-8 h-8 flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] group-hover:bg-[var(--background)] group-hover:text-[var(--foreground)] rounded-full transition-colors">
                        ↗
                      </span>
                    </button>
                  </div>
                  
                  <div className="ifs-stacking-card-visual flex-1 relative w-full h-[300px] md:h-auto rounded-[2rem] overflow-hidden shadow-2xl ml-0 md:ml-8 mt-8 md:mt-0">
                    <ProjectCoverFrame project={p} index={i} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal && typeof document !== "undefined" ? (
        <ProjectModal project={modal} onClose={() => setModal(null)} mounted />
      ) : null}
    </section>
  );
}
