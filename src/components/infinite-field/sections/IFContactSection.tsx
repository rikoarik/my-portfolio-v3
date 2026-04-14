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
  const kicker = typeof section?.meta?.kicker === "string" ? section.meta.kicker : "Closing chapter";
  const talkLabel =
    typeof section?.meta?.talk_label === "string" ? section.meta.talk_label : "Let's talk";
  const cvLabel = typeof section?.meta?.cv_label === "string" ? section.meta.cv_label : "Download CV";

  const socialLinks: { label: string; url: string }[] = [];
  if (profile.github_url) socialLinks.push({ label: "GitHub", url: profile.github_url });
  if (profile.linkedin_url) socialLinks.push({ label: "LinkedIn", url: profile.linkedin_url });
  if (profile.website_url) socialLinks.push({ label: "Website", url: profile.website_url });

  return (
    <section
      id="contact"
      role="contentinfo"
      aria-labelledby="contact-title"
      className="ifs-section"
    >
      <div className="ifs-contact-wrap">
        <div className="ifs-contact-epilogue">
          <p className="ifs-contact-kicker">{kicker}</p>
          <p className="ifs-contact-epilogue-copy">
            {section?.body ?? "Akhir cerita ada di sini. Kalau mau mulai proyek berikutnya, kita lanjut lewat email."}
          </p>
        </div>

        <div className="ifs-contact-grid">
          <div className="ifs-contact-main">
            <h2 id="contact-title" className="ifs-contact-heading">
              {section?.title ?? "Get in touch"}
            </h2>
            <p className="ifs-contact-sub">
              {section?.subtitle ?? "Unduh CV atau kirim email — respons cepat."}
            </p>
            <div className="ifs-contact-links">
              <span>{profile.email}</span>
              <span>{profile.location}</span>
            </div>
            {socialLinks.length > 0 ? (
              <div className="ifs-contact-links">
                {socialLinks.map((l) => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="ifs-contact-side">
            <MagneticHover strength={20}>
              <a href={`mailto:${profile.email}`} className="ifs-pill-btn ifs-pill-btn--primary">
                {talkLabel}
              </a>
            </MagneticHover>
            <MagneticHover strength={20}>
              <a href={cv} download className="ifs-pill-btn">
                ↓ {cvLabel}
              </a>
            </MagneticHover>
            {profile.phone ? (
              <MagneticHover strength={20}>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="ifs-pill-btn">
                  {profile.phone}
                </a>
              </MagneticHover>
            ) : null}
          </div>
        </div>

        <div className="ifs-copyright">
          © {new Date().getFullYear()} {profile.full_name} · {profile.title}
        </div>
      </div>
    </section>
  );
}
