# Portfolio Content Refresh Todo

Date: 2026-07-01

## Goal

Make the portfolio copy more professional, recruiter-ready, and aligned with Mobile Developer positioning for fintech, payment, and multi-tenant mobile apps.

## Checklist

- [x] Add content regression tests for seed portfolio copy.
- [x] Refresh profile, hero, about, proof, contact, SEO, skills, and guestbook seed content.
- [x] Refresh experience and project copy for fintech/payment/mobile production positioning.
- [x] Refresh component fallback copy and stat/date display safety.
- [x] Run targeted content grep checks.
- [ ] Run `npm install` (required for `npm run test/lint/build`).
- [ ] Run `npm run test:run -- src/data/portfolio.seed.test.ts`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Prepare final report with changed files, section summary, verification results, and CMS override risk.

## Implementation Summary

### Files changed

- `src/data/portfolio.seed.ts` — profile, sections (hero/about/contact/proof), skill groups, experiences, projects, SEO, and empty guestbook fallback.
- `src/data/portfolio.seed.test.ts` — new content regression tests.
- `src/components/portfolio/PastelHero.tsx` — fallback hero tagline copy.
- `src/components/infinite-field/sections/IFAboutSection.tsx` — fallback about copy, default stats, and stat HTML initial value (`{value}` instead of `0`).
- `src/components/infinite-field/sections/IFProjectsSection.tsx` — projects section lead copy.
- `src/components/infinite-field/sections/IFCareerSection.tsx` — safer period formatter (`end_date: null` → `Present`, blank start guard).
- `src/components/infinite-field/sections/IFGuestbookSection.tsx` — guestbook section copy.
- `src/components/ui/motion-footer.tsx` — contact/footer fallback copy and marquee fallback.
- `tasks/todo.md` — this checklist.
- `docs/superpowers/specs/2026-07-01-portfolio-content-design.md` — design spec.
- `docs/superpowers/plans/2026-07-01-portfolio-content-refresh.md` — implementation plan.

### Section copy direction

- Hero: `Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.` + `I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.`
- About: production mobile apps, clean architecture, reliable flows, API integration, edge cases, maintainability, real user conditions.
- Projects: Member App Ecosystem (multi-tenant fintech, member flows, balance/payment screens, API integration, tenant customization), Merchant SolusiNegeri (native Android, QRIS, NFC, EDC, receipt, member verification), Puas HUB (Flutter PPOB/digital payment, pulsa/data/listrik/e-wallet/voucher), DIGILUH & eMahaWangsa (GPS, selfie verification, validation flow, real-world usage).
- Skills: Kotlin, Android, React Native, Expo, Flutter, MVVM, Clean Architecture, BLoC, Zustand, REST API, Firebase, Laravel, MySQL, Swagger/OpenAPI, GitLab, GitLab CI/CD, Postman, Jira, Play Store, App Store.
- Contact: invite for mobile roles, fintech/payment projects, and production app maintenance; CTA "Email me" + Download CV.
- Guestbook seed: empty (no fake testimonials). Real approved Supabase messages still render.
- SEO descriptions: mobile fintech/payment positioning.

### Data safety

- Removed fake/random seed guestbook messages (`Awwwards Bot`, `Satya Nadella`, `Design Hunter`, dummy visitors).
- Removed `Passion Driven` and other aesthetic-only stat.
- Fixed unsafe project period labels (`Aug 2025 – Nov 2026`, `Feb 2026 – May 2026`, `Jan 2025 – May 2025`) → `Present` for active work.
- Stats initial HTML is now the real value, not `0`, so SSR/static fallback no longer shows `0+`.
- Did not invent new inflated numbers; kept metrics already present (`2+ Years`, `15+ Production Apps`).

## CMS-Ready Copy Notes

Supabase production rows can override `src/data/portfolio.seed.ts`. If the live site still shows old copy after deploy, align these CMS areas manually:

- `site_profile.tagline`
- `site_profile.og_description`
- `section_content` rows for `hero`, `about`, `proof`, and `contact`
- `projects` rows for Member App Ecosystem, Puas HUB, DIGILUH, Merchant SolusiNegeri, eMahaWangsa, and supporting technical projects
- `experiences` bullets
- `skill_groups` and `skills`
- Approved `guestbook` rows if any fake/random messages already exist in Supabase

## Review

- Verification commands:
  - `npm install`
  - `npm run test:run -- src/data/portfolio.seed.test.ts`
  - `npm run lint`
  - `npm run build`
- Manual review risk: production Supabase content may override seed fallback content.

## Diagnostics

- TS diagnostic `react/jsx-runtime` not found di `motion-footer.tsx` dan `IFProjectsSection.tsx` terdeteksi di lingkungan lokal yang belum menjalankan `npm install`. Ini adalah environmental noise, bukan regresi yang disebabkan oleh edit konten ini. Setelah `npm install` selesai, diagnostics tersebut akan hilang.