"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { loadGsap, registerGsapPlugins } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type Lenis from "lenis";
import type { Project } from "@/types/portfolio";

type WindowWithLenis = Window & { __portfolioLenis?: Lenis };
import { TextReveal } from "@/components/interactions/TextReveal";
import { InteractiveGridBackground } from "@/components/visual/InteractiveGridBackground";
import { useT } from "@/i18n/context";

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
  const t = useT();
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
    void (async () => {
      const { gsap } = await loadGsap();
      const tl = gsap.timeline({
        defaults: { ease: "power3.in" },
        onComplete: onClose,
      });
      tl.to(modalEl, { opacity: 0, y: 28, scale: 0.98, duration: 0.28 }).to(
        backdrop,
        { opacity: 0, duration: 0.22 },
        "<0.05",
      );
    })();
  }, [onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const lenis = (window as WindowWithLenis).__portfolioLenis;
    lenis?.stop();

    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
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

    let tl: GSAPTimeline | null = null;
    let mountedNow = true;

    void (async () => {
      const { gsap } = await loadGsap();
      if (!mountedNow) return;
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28 }).fromTo(
        modalEl,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.35)" },
        "<+0.04",
      );
    })();

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 80);

    return () => {
      mountedNow = false;
      window.clearTimeout(t);
      tl?.kill();
    };
  }, []);

  if (!mounted) return null;

  const portalRoot = typeof document !== "undefined" ? document.body : null;
  if (!portalRoot) return null;

  const hasLinks = Boolean(project.repo_url || project.demo_url);
  const modalBullets = project.subtitle?.trim()
    ? project.bullets
    : project.bullets.slice(1);
  const modalMetaTags = previewTagsForList(project, 2);

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
          aria-label={t("projects.modal.closeAria")}
        >
          {t("projects.modal.close")}
        </button>

        <div className="ifs-modal__scroll" data-lenis-prevent>
          {project.cover_url ? (
            <div className="ifs-modal-cover">
              <Image
                src={project.cover_url}
                alt=""
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="ifs-modal-cover-img"
                loading="lazy"
              />
            </div>
          ) : null}

          <header className="ifs-modal__header">
            <p className="ifs-subheading ifs-modal__kicker">{t("projects.modal.kicker")}</p>
            <h3 id={titleId} className="ifs-project-title ifs-modal__title">
              {project.title}
            </h3>
            {project.subtitle ? (
              <p className="ifs-project-subtitle ifs-modal__subtitle">{project.subtitle}</p>
            ) : null}
            {project.period_label ? (
              <p className="ifs-project-meta ifs-modal__meta">{project.period_label}</p>
            ) : null}
            {modalMetaTags.length ? (
              <p className="ifs-modal__meta-bar font-mono-meta">{modalMetaTags.join(" · ")}</p>
            ) : null}
          </header>

          <div className="ifs-modal__section">
            <p className="ifs-modal__section-label font-mono-meta">{t("projects.modal.stackTags")}</p>
            <p className="ifs-modal__section-hint">{t("projects.modal.stackTagsHint")}</p>
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
              <p className="ifs-modal__section-label font-mono-meta">{t("projects.modal.highlights")}</p>
              <p className="ifs-modal__section-hint">{t("projects.modal.highlightsHint")}</p>
              <ul className="ifs-case-list ifs-modal__bullets">
                {modalBullets.slice(0, 6).map((b, i) => (
                  <li key={`b-${project.id}-${i}`}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.case_study ? (
            <div className="ifs-modal__section">
              <p className="ifs-modal__section-label font-mono-meta">{t("projects.modal.caseStudy")}</p>
              <p className="ifs-modal__section-hint">{t("projects.modal.caseStudyHint")}</p>
              <div className="ifs-case-grid ifs-modal__case ifs-modal__case--framed">
                <div className="ifs-case-block">
                  <div className="ifs-case-label">{t("projects.modal.problem")}</div>
                  <p className="ifs-case-text">{project.case_study.problem}</p>
                </div>
                {project.case_study.constraints.length ? (
                  <div className="ifs-case-block">
                    <div className="ifs-case-label">{t("projects.modal.constraints")}</div>
                    <ul className="ifs-case-study-list">
                      {project.case_study.constraints.map((c, i) => (
                        <li key={`c-${project.id}-${i}`}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="ifs-case-block">
                  <div className="ifs-case-label">{t("projects.modal.solution")}</div>
                  <p className="ifs-case-text">{project.case_study.solution}</p>
                </div>
                {project.case_study.results.length ? (
                  <div className="ifs-case-block ifs-case-block--impact">
                    <div className="ifs-case-label">{t("projects.modal.impact")}</div>
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
          <footer className="ifs-modal__cta" aria-label={t("projects.modal.ctaAria")}>
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn ifs-pill-btn--primary ifs-modal__cta-primary"
              >
                {t("projects.modal.demo")}
              </a>
            ) : null}
            {project.repo_url ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="ifs-pill-btn ifs-modal__cta-secondary"
              >
                {t("projects.modal.repo")}
              </a>
            ) : null}
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(inner, portalRoot);
}

function ProjectCoverFrame({
  project,
  index,
  variant = "expanded",
}: {
  project: Project;
  index: number;
  variant?: "collapsed" | "expanded";
}) {
  const src = project.cover_url?.trim();
  const domainTag = project.tags?.[0]?.trim() || project.stack[0]?.trim();

  if (src) {
    return (
      <div
        className={cn(
          "ifs-project-cover-frame ifs-accordion-cover-frame",
          variant === "collapsed" && "ifs-accordion-cover-frame--collapsed",
        )}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={variant === "collapsed" ? "120px" : "(min-width: 1024px) 40vw, 100vw"}
          className="ifs-project-cover-img"
          loading="lazy"
        />
        <div className="ifs-project-cover-shine" aria-hidden />
        {domainTag && variant === "expanded" ? (
          <span className="ifs-accordion-cover-domain font-mono-meta">{domainTag}</span>
        ) : null}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "ifs-project-cover-frame ifs-project-cover-frame--placeholder ifs-accordion-cover-frame",
        variant === "collapsed" && "ifs-accordion-cover-frame--collapsed",
      )}
    >
      <div className="ifs-project-cover-gradient" aria-hidden />
      <span className="ifs-accordion-cover-stroke-index" aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </span>
      {domainTag && variant === "expanded" ? (
        <span className="ifs-accordion-cover-domain font-mono-meta">{domainTag}</span>
      ) : null}
      {variant === "expanded" ? (
        <p className="ifs-project-cover-watermark">{project.title}</p>
      ) : null}
    </div>
  );
}

const ProjectAccordionPanel = forwardRef<
  HTMLButtonElement,
  {
    project: Project;
    index: number;
    isActive: boolean;
    onActivate: () => void;
    onOpenModal: () => void;
    tabId: string;
    panelId: string;
  }
>(function ProjectAccordionPanel(
  { project, index, isActive, onActivate, onOpenModal, tabId, panelId },
  ref,
) {
  const t = useT();
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const listTags = previewTagsForList(project, 3);
  const impactLine = project.bullets[0]?.trim();
  const indexLabel = String(index + 1).padStart(2, "0");

  useEffect(() => {
    if (!isActive) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const content = contentRef.current;
    const visual = visualRef.current;
    if (!content) return;

    let ctx: { revert: () => void } | null = null;

    void (async () => {
      await registerGsapPlugins();
      const { gsap } = await loadGsap();

      const items = content.querySelectorAll<HTMLElement>(".ifs-accordion-animate-in");
      gsap.set(items, { opacity: 0, y: 18 });
      if (visual) gsap.set(visual, { opacity: 0, scale: 0.96 });

      ctx = gsap.context(() => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "opacity,transform",
        });
        if (visual) {
          gsap.to(visual, {
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.12,
            clearProps: "opacity,transform",
          });
        }
      }, content);
    })();

    return () => ctx?.revert();
  }, [isActive, project.id]);

  return (
    <div
      className={cn(
        "ifs-project-accordion-panel",
        isActive && "is-active",
        project.featured && "ifs-project-accordion-panel--featured",
      )}
    >
      <div className="ifs-project-accordion-panel-inner">
        <div className="ifs-project-accordion-cover-bg" aria-hidden>
          <ProjectCoverFrame project={project} index={index} variant="collapsed" />
        </div>

        <button
          ref={ref}
          type="button"
          role="tab"
          id={tabId}
          aria-selected={isActive}
          aria-expanded={isActive}
          aria-controls={panelId}
          aria-label={t("projects.accordion.tabAria", { index: indexLabel, title: project.title })}
          tabIndex={isActive ? 0 : -1}
          className="ifs-project-accordion-tab"
          onClick={onActivate}
        >
          <span className="ifs-project-accordion-index font-mono-meta">{indexLabel}</span>
          <span className="ifs-project-accordion-strip-title">{project.title}</span>
        </button>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId}
          aria-hidden={!isActive}
          className={cn("ifs-project-accordion-body", isActive && "is-open")}
        >
          <div ref={contentRef} className="ifs-project-accordion-content">
            <div className="ifs-project-accordion-meta ifs-accordion-animate-in mb-4 flex flex-wrap items-center gap-3 sm:mb-5">
              <span className="ifs-project-accordion-kicker font-mono-meta text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                {t("projects.accordion.kicker", { index: indexLabel })}
              </span>
              {project.featured ? (
                <span className="ifs-project-accordion-pill ifs-project-accordion-pill--featured font-mono-meta">
                  {t("projects.accordion.featured")}
                </span>
              ) : null}
              {project.period_label ? (
                <span className="ifs-project-accordion-pill font-mono-meta">{project.period_label}</span>
              ) : null}
            </div>

            <div className="ifs-project-accordion-title-wrap ifs-accordion-animate-in relative mb-4 sm:mb-5">
              <span className="ifs-project-accordion-watermark" aria-hidden>
                {indexLabel}
              </span>
              <h3 className="ifs-project-accordion-title relative z-[1] text-[clamp(1.35rem,4vw+0.5rem,2.75rem)] font-bold tracking-tight lg:text-4xl">
                {project.title}
              </h3>
            </div>

            {project.subtitle ? (
              <p className="ifs-project-accordion-desc ifs-accordion-animate-in text-base leading-relaxed text-[var(--muted-foreground)] lg:text-lg">
                {project.subtitle}
              </p>
            ) : null}

            {impactLine ? (
              <blockquote className="ifs-project-impact-quote ifs-accordion-animate-in mt-5 sm:mt-6">{impactLine}</blockquote>
            ) : null}

            {listTags.length ? (
              <div className="ifs-accordion-animate-in mt-auto flex flex-wrap gap-2 pt-6 sm:pt-8">
                {listTags.map((tag) => (
                  <span key={tag} className="ifs-project-accordion-tag font-mono-meta">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              onClick={onOpenModal}
              className="ifs-project-glass-cta ifs-accordion-animate-in mt-6 sm:mt-8"
            >
              <span>{t("projects.accordion.viewDetail")}</span>
              <span className="ifs-project-glass-cta-icon" aria-hidden>
                ↗
              </span>
            </button>
          </div>

          <div ref={visualRef} className="ifs-project-accordion-visual">
            <ProjectCoverFrame project={project} index={index} variant="expanded" />
          </div>
        </div>
      </div>
    </div>
  );
});

export function IFProjectsSection({ projects }: { projects: Project[] }) {
  const t = useT();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [modal, setModal] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const ordered = useMemo(() => sortProjects(projects), [projects]);
  const featuredCount = useMemo(() => ordered.filter((p) => p.featured).length, [ordered]);

  const focusTab = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, ordered.length - 1));
    setActiveIndex(clamped);
    tabRefs.current[clamped]?.focus();
  }, [ordered.length]);

  const handleAccordionKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;
      const isVertical = window.matchMedia("(max-width: 1023px)").matches;
      const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
      const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

      if (key !== prevKey && key !== nextKey && key !== "Home" && key !== "End") return;

      e.preventDefault();
      if (key === "Home") {
        focusTab(0);
        return;
      }
      if (key === "End") {
        focusTab(ordered.length - 1);
        return;
      }
      if (key === prevKey) {
        focusTab(activeIndex - 1);
        return;
      }
      focusTab(activeIndex + 1);
    },
    [activeIndex, focusTab, ordered.length],
  );

  useEffect(() => {
    if (activeIndex < ordered.length) return;
    setActiveIndex(Math.max(0, ordered.length - 1));
  }, [activeIndex, ordered.length]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="ifs-section ifs-projects-accordion-section"
    >
      <InteractiveGridBackground />

      <div className="ifs-content-pad ifs-content-wrap">
        <header className="ifs-projects-header mb-6 sm:mb-8" aria-labelledby="projects-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono-meta mb-4 text-xs uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                {t("projects.kicker")}
              </p>
              <TextReveal
                as="h2"
                id="projects-title"
                text={t("projects.title")}
                className="ifs-heading !mb-0 text-left"
              />
              <p className="ifs-projects-lead mt-3 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:mt-4 sm:text-lg">
                {t("projects.lead")}
              </p>
            </div>
            <p className="font-mono-meta shrink-0 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)] lg:text-right">
              {t("projects.count", { count: ordered.length })}
              {featuredCount ? t("projects.featuredSuffix", { count: featuredCount }) : ""}
            </p>
          </div>
        </header>
      </div>

      <div className="ifs-content-pad ifs-content-wrap">
        <div
          role="tablist"
          aria-label={t("projects.tablistAria")}
          className="ifs-project-accordion"
          onKeyDown={handleAccordionKeyDown}
        >
          {ordered.map((p, i) => (
            <ProjectAccordionPanel
              key={p.id}
              project={p}
              index={i}
              isActive={i === activeIndex}
              onActivate={() => setActiveIndex(i)}
              onOpenModal={() => setModal(p)}
              tabId={`ifs-project-tab-${p.id}`}
              panelId={`ifs-project-panel-${p.id}`}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      {modal ? <ProjectModal project={modal} onClose={() => setModal(null)} mounted /> : null}
    </section>
  );
}
