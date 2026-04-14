"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioPayload, Project } from "@/types/portfolio";

export type IFStageRefs = {
  editorial: RefObject<HTMLDivElement | null>;
  proof: RefObject<HTMLDivElement | null>;
  cases: RefObject<HTMLDivElement | null>;
  projects: RefObject<HTMLDivElement | null>;
  timeline: RefObject<HTMLDivElement | null>;
  toolbox: RefObject<HTMLDivElement | null>;
  contact: RefObject<HTMLDivElement | null>;
};

const PROOF_ITEMS = [
  { label: "Multi-tenant fintech", value: "15+ apps" },
  { label: "Payments", value: "QRIS · PPOB · POS" },
  { label: "Stability", value: "offline-first + sync" },
  { label: "Delivery", value: "Play Store · App Store" },
] as const;

function pickFeatured(projects: Project[]) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, 4);
}

function byFeaturedThenOrder(projects: Project[]) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest];
}

function fmtExp(e: { start_date: string | null; end_date: string | null }) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}

export function IFStage({ data, refs: panelRefs }: { data: PortfolioPayload; refs: IFStageRefs }) {
  const {
    editorial: editorialRef,
    proof: proofRef,
    cases: casesRef,
    projects: projectsRef,
    timeline: timelineRef,
    toolbox: toolboxRef,
    contact: contactRef,
  } = panelRefs;
  const { profile, projects: projectList, experiences, education, skill_groups: groups } = data;
  const editorialText = profile.tagline?.trim() || "";
  const cv = profile.cv_url ?? "/NodeFlair_Resume_2026-04-11_13_37_51.pdf";

  const featuredCases = useMemo(() => pickFeatured(projectList), [projectList]);
  const [caseIdx, setCaseIdx] = useState(0);
  const caseProject = featuredCases[caseIdx] ?? null;

  const orderedProjects = useMemo(() => byFeaturedThenOrder(projectList), [projectList]);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openProject]);

  return (
    <>
      <div className="if-stage">
        <div ref={editorialRef} className="if-stage-panel">
          <div className="if-stage-inner if-stage-editorial">
            <p className="if-stage-paragraph">{editorialText}</p>
            <a href="#contact" className="if-careers-button">
              Careers
            </a>
          </div>
        </div>

        <div ref={proofRef} className="if-stage-panel">
          <div className="if-stage-inner if-stage-proof">
            <p className="if-stage-kicker">Proof</p>
            <div className="if-proof-grid">
              {PROOF_ITEMS.map((it) => (
                <div key={it.label} className="if-proof-cell">
                  <p className="if-proof-value">{it.value}</p>
                  <p className="if-proof-label">{it.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={casesRef} className="if-stage-panel" id="case-studies">
          <div className="if-stage-inner if-stage-cases">
            <p className="if-stage-kicker">Case studies</p>
            {caseProject ? (
              <>
                <div className="if-case-head">
                  <h2 className="if-case-title">{caseProject.title}</h2>
                  {caseProject.subtitle ? (
                    <p className="if-case-sub">{caseProject.subtitle}</p>
                  ) : null}
                </div>
                <div className="if-case-lines">
                  {caseProject.case_study ? (
                    <>
                      <p className="if-case-line">
                        <span className="if-case-tag">Problem</span>
                        {caseProject.case_study.problem}
                      </p>
                      <p className="if-case-line">
                        <span className="if-case-tag">Solution</span>
                        {caseProject.case_study.solution}
                      </p>
                      <p className="if-case-line">
                        <span className="if-case-tag">Result</span>
                        {caseProject.case_study.results[0] ?? "—"}
                      </p>
                    </>
                  ) : (
                    caseProject.bullets.slice(0, 3).map((b, i) => (
                      <p key={`${caseProject.id}-b-${i}`} className="if-case-line">
                        {b}
                      </p>
                    ))
                  )}
                </div>
                {featuredCases.length > 1 ? (
                  <div className="if-case-pager">
                    {featuredCases.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`if-case-dot${i === caseIdx ? " if-case-dot--on" : ""}`}
                        onClick={() => setCaseIdx(i)}
                        aria-label={`Case ${i + 1}: ${p.title}`}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="if-stage-muted">No projects.</p>
            )}
          </div>
        </div>

        <div ref={projectsRef} className="if-stage-panel" id="projects">
          <div className="if-stage-inner if-stage-projects">
            <p className="if-stage-kicker">Index</p>
            <div className="if-project-scroll">
              {orderedProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="if-project-row"
                  onClick={() => setOpenProject(p)}
                >
                  <span className="if-project-title">{p.title}</span>
                  <span className="if-project-meta">
                    {p.period_label ?? ""}
                    {(p.tags ?? []).slice(0, 3).map((t) => (
                      <span key={t} className="if-project-tag">
                        {t}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={timelineRef} className="if-stage-panel">
          <div className="if-stage-inner if-stage-timeline">
            <p className="if-stage-kicker">Timeline</p>
            <ul className="if-mono-list">
              {experiences.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <span className="if-mono-date">{fmtExp(e)}</span>
                  <span className="if-mono-main">
                    {e.role} · {e.company}
                  </span>
                </li>
              ))}
              {education.slice(0, 2).map((ed) => (
                <li key={ed.id}>
                  <span className="if-mono-date">
                    {ed.start_date ?? ""} — {ed.end_date ?? "Present"}
                  </span>
                  <span className="if-mono-main">
                    {ed.degree} · {ed.institution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={toolboxRef} className="if-stage-panel">
          <div className="if-stage-inner if-stage-toolbox">
            <p className="if-stage-kicker">Toolbox</p>
            <ul className="if-tool-list">
              {groups.map((g) => (
                <li key={g.id}>
                  <span className="if-tool-group">{g.name}</span>
                  <span className="if-tool-skills">
                    {g.skills.map((s) => s.name).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={contactRef} className="if-stage-panel" id="contact">
          <div className="if-stage-inner if-stage-contact">
            <p className="if-stage-kicker">Contact</p>
            <h2 className="if-contact-title">Mari lanjutkan</h2>
            <p className="if-contact-sub">Unduh CV atau kirim email.</p>
            <div className="if-contact-actions">
              <a href={cv} download className="if-contact-pill if-contact-pill--solid">
                Unduh CV
              </a>
              <a href={`mailto:${profile.email}`} className="if-contact-pill">
                {profile.email}
              </a>
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="if-contact-pill"
                >
                  {profile.phone}
                </a>
              ) : null}
              {profile.github_url ? (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="if-contact-pill"
                >
                  GitHub
                </a>
              ) : null}
              {profile.linkedin_url ? (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="if-contact-pill"
                >
                  LinkedIn
                </a>
              ) : null}
              {profile.website_url ? (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="if-contact-pill"
                >
                  Web
                </a>
              ) : null}
            </div>
            <p className="if-contact-foot">
              © {new Date().getFullYear()} {profile.full_name}
            </p>
          </div>
        </div>
      </div>

      {openProject && typeof document !== "undefined"
        ? createPortal(
            <div className="if-modal-root">
              <button
                type="button"
                className="if-modal-backdrop"
                onClick={() => setOpenProject(null)}
                aria-label="Close"
              />
              <div
                className="if-modal-panel"
                role="dialog"
                aria-modal="true"
                aria-label={`Project: ${openProject.title}`}
              >
                <div className="if-modal-head">
                  <div>
                    <p className="if-modal-kicker">project</p>
                    <h3 className="if-modal-title">{openProject.title}</h3>
                    {openProject.subtitle ? (
                      <p className="if-modal-sub">{openProject.subtitle}</p>
                    ) : null}
                  </div>
                  <Button type="button" variant="outline" onClick={() => setOpenProject(null)}>
                    Close
                  </Button>
                </div>
                <div className="if-modal-tags">
                  {(openProject.tags ?? []).slice(0, 8).map((t) => (
                    <Badge key={t} variant="outline" className="font-mono-meta text-[10px]">
                      {t}
                    </Badge>
                  ))}
                  {openProject.stack.slice(0, 12).map((s) => (
                    <Badge key={s} variant="muted" className="font-mono-meta text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
                <ul className="if-modal-bullets">
                  {openProject.bullets.map((b, i) => (
                    <li key={`${openProject.id}-mb-${i}`}>{b}</li>
                  ))}
                </ul>
                <div className="if-modal-links">
                  {openProject.demo_url ? (
                    <a href={openProject.demo_url} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  ) : null}
                  {openProject.repo_url ? (
                    <a href={openProject.repo_url} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
