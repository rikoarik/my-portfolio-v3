"use client";

import type { SectionContent, SiteProfile } from "@/types/portfolio";
import { MagneticHover } from "@/components/interactions/MagneticHover";

export function IFContactSection({
  profile,
  section,
}: {
  profile: SiteProfile;
  section?: SectionContent;
}) {
  const cv = profile.cv_url ?? "/NodeFlair_Resume_2026-04-11_13_37_51.pdf";
  const kicker =
    typeof section?.meta?.kicker === "string" && section.meta.kicker.trim()
      ? section.meta.kicker
      : "Langkah berikutnya";
  const talkLabel =
    typeof section?.meta?.talk_label === "string" ? section.meta.talk_label : "Email saya";
  const cvLabel = typeof section?.meta?.cv_label === "string" ? section.meta.cv_label : "Unduh CV";

  const socialLinks: { label: string; url: string }[] = [];
  if (profile.github_url) socialLinks.push({ label: "GitHub", url: profile.github_url });
  if (profile.linkedin_url) socialLinks.push({ label: "LinkedIn", url: profile.linkedin_url });
  if (profile.website_url) socialLinks.push({ label: "Web", url: profile.website_url });

  const title = section?.title?.trim() || "Kolaborasi berikutnya";
  const subtitle =
    section?.subtitle?.trim() || "Ceritakan brief, timeline, atau sekadar halo — biasanya membalas sama hari.";
  const extra =
    typeof section?.body === "string" && section.body.trim().length > 0 ? section.body.trim() : null;

  return (
    <section
      id="contact"
      role="contentinfo"
      aria-labelledby="contact-title"
      className="ifs-section ifs-contact-root"
    >
      <div className="ifs-contact-panel">
        <div className="ifs-contact-panel__glow" aria-hidden />
        <div className="ifs-contact-panel__inner">
          <header className="ifs-contact-head">
            <p className="ifs-contact-badge font-mono-meta">{kicker}</p>
            <h2 id="contact-title" className="ifs-contact-title">
              {title}
            </h2>
            <p className="ifs-contact-lead">{subtitle}</p>
            {extra ? <p className="ifs-contact-extra">{extra}</p> : null}
          </header>

          <dl className="ifs-contact-spec">
            <div className="ifs-contact-spec__row">
              <dt className="ifs-contact-spec__dt">Email</dt>
              <dd className="ifs-contact-spec__dd">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </div>
            <div className="ifs-contact-spec__row">
              <dt className="ifs-contact-spec__dt">Lokasi</dt>
              <dd className="ifs-contact-spec__dd">{profile.location}</dd>
            </div>
          </dl>

          {socialLinks.length ? (
            <nav className="ifs-contact-social" aria-label="Profil sosial">
              {socialLinks.map((l) => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="ifs-contact-social__link">
                  {l.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="ifs-contact-cta">
            <MagneticHover strength={18}>
              <a href={`mailto:${profile.email}`} className="ifs-pill-btn ifs-pill-btn--primary ifs-contact-cta__primary">
                {talkLabel}
              </a>
            </MagneticHover>
            <MagneticHover strength={18}>
              <a href={cv} download className="ifs-pill-btn ifs-contact-cta__ghost">
                {cvLabel}
              </a>
            </MagneticHover>
            {profile.phone ? (
              <MagneticHover strength={18}>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="ifs-pill-btn ifs-contact-cta__ghost">
                  {profile.phone}
                </a>
              </MagneticHover>
            ) : null}
          </div>

          <p className="ifs-contact-foot">
            © {new Date().getFullYear()} {profile.full_name} · {profile.title}
          </p>
        </div>
      </div>
    </section>
  );
}
