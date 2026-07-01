# Portfolio Content Refresh Design

Date: 2026-07-01

## Goal

Refresh the public portfolio copy so it is more professional, recruiter-ready, and aligned with this positioning:

> Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.

The work is content-first. It must not redesign the site, remove existing features, add dependencies, or change the overall interaction concept.

## Current Context

The active homepage is rendered from `src/app/page.tsx` through `src/components/portfolio/PortfolioClient.tsx`. Portfolio content is loaded by `src/lib/portfolio.ts` from Supabase and falls back to `PORTFOLIO_SEED` in `src/data/portfolio.seed.ts`.

Active homepage sections include:

- Hero: `src/components/portfolio/PastelHero.tsx`
- Proof strip: `src/components/infinite-field/sections/IFProofStrip.tsx`
- Projects: `src/components/infinite-field/sections/IFProjectsSection.tsx`
- About: `src/components/infinite-field/sections/IFAboutSection.tsx`
- Experience, skills, education: `src/components/infinite-field/sections/IFCareerSection.tsx`
- Guestbook: `src/components/infinite-field/sections/IFGuestbookSection.tsx`
- Contact: `src/components/ui/motion-footer.tsx`

Because Supabase may override seed content in production, the implementation will update the seed copy and provide CMS-ready copy notes in the final report for manual Supabase alignment.

## Problems to Fix

1. Hero copy is not direct enough for recruiters. The line “He didn't wait to be taught. He just started building.” is personal but does not clearly sell the mobile fintech/payment positioning.
2. About copy contains aesthetic language such as “emotional”, “physics-based animations”, “editorial design aesthetics”, and “magical”. This does not match the desired Mobile Developer positioning.
3. The about stats include “100% Passion Driven”, which feels promotional rather than professional.
4. Some project periods imply future completion, especially `Aug 2025 – Nov 2026`, instead of using `Present` for ongoing work.
5. Guestbook seed messages use fake/random names and casual praise such as “Awwwards Bot”, “Satya Nadella”, and dummy visitor comments. These reduce recruiter trust if seed data is visible.
6. Project copy can better emphasize fintech, payment, merchant/member ecosystems, QRIS, NFC, EDC/payment flows, PPOB, GPS/selfie attendance, and production maintenance.
7. Skills and SEO copy should consistently prioritize Kotlin/Android, React Native/Expo, Flutter, Laravel, REST API, MySQL, GitLab CI/CD, and app store deployment.

## Chosen Approach

Use a content-first seed update plus minimal display logic fixes.

### Why this approach

- It keeps the existing CMS/data-driven architecture intact.
- The site remains valid when Supabase is unavailable because fallback seed content is professional.
- Copy can be verified through the normal app build without requiring database changes.
- Final report can include CMS-ready copy notes so Supabase content can be aligned later.

### Non-goals

- No large visual redesign.
- No new dependency.
- No feature removal.
- No automatic commit.
- No unverified inflated metrics.

## Content Design

### Hero

Replace the current poetic hero body with direct professional positioning.

Target direction:

- Title stays `Arik Riko Prasetya`.
- Subtitle stays or becomes `Mobile Developer`.
- Body should clearly say: `Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.`
- Supporting profile tagline should explain: `I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.`
- CTA can remain `Explore Work`.

### About

Reframe the section around production mobile engineering.

Target themes:

- Building production-ready mobile apps.
- Clean architecture and maintainability.
- Reliable transaction/member/attendance flows.
- REST API integration and edge-case handling.
- Real user and operational conditions.

Remove or replace language about magical experiences, physics-based frontend, emotional UI, and editorial design.

Replace `100% Passion Driven` with a professional stat such as `Production Mindset`, `Maintainable Delivery`, or another non-numeric label supported by the component data model.

### Proof Strip

Keep the strip but ensure it supports the new positioning. Preferred labels:

- `15+ Production Apps`
- `2+ Years Mobile`
- `Play Store · App Store`
- `Fintech & Payment Focus`

### Projects

Update project descriptions without changing project structure or ordering unless needed for clarity.

#### Member App Ecosystem

Emphasize:

- Multi-tenant fintech mobile apps.
- Shared app structure and reusable feature patterns.
- Member flows, balance/payment-related screens, API integration, and tenant customization.
- Production maintenance and store releases.

Use `Present` for active work instead of future end dates.

#### Merchant SolusiNegeri

Emphasize:

- Native Android merchant app.
- Transaction reliability for merchant operations.
- QRIS, NFC, EDC-related flow, receipts, and member verification.
- Maintainable architecture and defensive handling around transaction states.

#### Puas HUB

Emphasize:

- Flutter app for PPOB and digital payments.
- Pulsa, data package, electricity, e-wallet, and game voucher flows.
- API integration, transaction states, and maintainable BLoC/Clean Architecture.

#### Attendance Apps

For `DIGILUH` and `eMahaWangsa`, emphasize:

- GPS attendance.
- Selfie verification where applicable.
- Validation flow.
- Offline/real-world usage where already supported by the existing copy.

### Experience / Career

Keep the existing experience entries but sharpen bullets toward impact and domain fit.

Required direction:

- `PT Teknologi Kartu Indonesia`: multi-tenant fintech ecosystem, merchant/member apps, QRIS/NFC/Bluetooth/POS, app store deployment, production maintenance.
- `PUAS Hub`: Flutter PPOB/payment app, transaction flows, BLoC/Clean Architecture, API integration.
- `Diprojectin`: Laravel/backend integration, production client delivery, API structure.
- `PT. Mahawangsa`: Android attendance app, GPS/selfie validation, real-world employee usage.

Ongoing roles with `end_date: null` must display as `Present`.

### Skills / Tech Stack

Keep the same skill group structure but adjust skills to reflect the requested stack clearly:

- Mobile: Kotlin, Android, React Native, Expo, Flutter, MVVM, Clean Architecture, BLoC, Zustand, REST API, Firebase.
- Backend & Integration: Laravel, MySQL, REST API, JSON, Swagger/OpenAPI.
- Tools & Delivery: GitLab, GitLab CI/CD, Git, Postman, Jira, Play Store, App Store.

### Contact

Replace casual closing copy with concise professional copy.

Target direction:

- Invite recruiters/clients to discuss mobile app roles, fintech/payment projects, or production app maintenance.
- Keep email/CV CTA.
- Avoid overly poetic phrasing like “Akhir cerita ada di sini.”

### Guestbook

Remove non-credible seed guestbook messages and dummy visitor messages from `PORTFOLIO_SEED`.

Do not remove the guestbook feature. Real approved Supabase messages should still render. Seed fallback should not show fake testimonials.

## Display Logic Design

### Date display

Update display logic so items with `end_date: null` render as `Present` when a period is constructed from `start_date`/`end_date`.

If a project uses an explicit `period_label`, prefer updating seed labels for active work to `Present` or ensure render logic avoids unsafe future-dated labels where practical.

### Fallback counters

Do not introduce fallback values like `0+ years`, `0+ apps`, or `0% passion`. Existing professional metrics must have meaningful defaults.

## Files Expected to Change

Likely required:

- `src/data/portfolio.seed.ts`

Potentially required for display safety:

- `src/components/infinite-field/sections/IFCareerSection.tsx`
- `src/components/infinite-field/sections/IFProjectsSection.tsx`

Potentially required if empty guestbook needs graceful rendering:

- `src/components/infinite-field/sections/IFGuestbookSection.tsx`

Documentation/task tracking per project workflow:

- `tasks/todo.md`
- optionally `docs/superpowers/specs/2026-07-01-portfolio-content-design.md` itself

## Verification Plan

After implementation:

1. Inspect the changed diff for unintended UI rewrites.
2. Run the project’s available validation commands from `package.json`.
3. At minimum, run a production build or the closest available build command.
4. Confirm there are no TypeScript/runtime errors from content shape changes.
5. Report:
   - changed files;
   - sections updated;
   - summary of copy changes;
   - verification commands and results;
   - manual review risks, especially Supabase CMS overriding seed content in production.

## Risks and Manual Review Notes

- If production Supabase has published `section_content`, `projects`, `experiences`, or `guestbook` rows, those rows can override seed copy. The final report must call out that CMS content should be aligned manually or through a separate migration/import.
- Some exact metrics such as `15+ production apps` depend on the user’s real history. The copy should retain only metrics already present in the seed or explicitly provided by the user.
- Removing fake seed guestbook messages makes fallback guestbook empty. This is intentional for recruiter trust, but the user may later choose to add real testimonials.
