# Portfolio Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the portfolio source copy so the site is professional, recruiter-ready, and clearly positioned as a Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.

**Architecture:** Preserve the existing data-driven portfolio architecture: `src/lib/portfolio.ts` loads Supabase content and falls back to `PORTFOLIO_SEED` in `src/data/portfolio.seed.ts`. Update seed content for reliable offline/build fallback, update component fallback text so missing CMS rows are still professional, and make only minimal render logic changes for safe fallback numbers/date display.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript, Vitest, Supabase-backed portfolio data, GSAP client animations.

## Global Constraints

- Do not perform a large visual redesign.
- Do not add dependencies.
- Do not remove existing features.
- Do not automatically commit; the user explicitly requested no automatic commits unless asked.
- Keep changes focused on copy/content and minimal display safety.
- Main positioning must be: `Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.`
- Hero subheadline must communicate: `I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.`
- Emphasize Kotlin/Android, React Native/Expo, Flutter, Laravel, REST API, MySQL, GitLab CI/CD, Play Store, and App Store deployment.
- Emphasize fintech mobile apps, merchant apps, member app ecosystem, PPOB/digital payment, QRIS, NFC, EDC/payment flow, GPS/selfie attendance, multi-tenant mobile architecture, and production app maintenance.
- Avoid misleading fallback numbers such as `0+ years`, `0+ apps`, or `0% passion`.
- Use `Present` for ongoing dates instead of unsafe future dates.
- Remove fake/random seed guestbook messages from the main fallback portfolio.
- If production Supabase content overrides the seed, report that the CMS rows must be aligned manually.

---

## File Structure

### Files to modify

- `src/data/portfolio.seed.ts`
  - Owns fallback portfolio content.
  - Update profile, SEO, hero/about/proof/contact sections, experiences, projects, skills, and seed guestbook.

- `src/components/portfolio/PastelHero.tsx`
  - Owns hero rendering fallback when `section_content.hero` is unavailable.
  - Replace poetic fallback copy with professional mobile fintech positioning.

- `src/components/infinite-field/sections/IFAboutSection.tsx`
  - Owns about section fallback copy and animated stat fallback HTML.
  - Replace aesthetic/magical/frontend fallback copy with mobile engineering copy.
  - Render stat initial text as the real value instead of `0` to avoid `0+` fallback HTML before animation.

- `src/components/infinite-field/sections/IFProjectsSection.tsx`
  - Owns static projects section lead copy.
  - Update the section lead toward fintech/payment/mobile production work.

- `src/components/infinite-field/sections/IFCareerSection.tsx`
  - Owns experience date formatting.
  - Keep existing `end_date: null → Present` behavior, but make the helper safer for blank start dates.

- `src/components/infinite-field/sections/IFGuestbookSection.tsx`
  - Owns guestbook section static copy.
  - Replace casual `raw vibes` wording with recruiter-safe wording while preserving the guestbook feature.

- `src/components/ui/motion-footer.tsx`
  - Owns contact/footer fallback copy.
  - Replace casual/poetic fallbacks with professional contact copy.

### Files to create

- `src/data/portfolio.seed.test.ts`
  - Guards the seed content against regression to fake testimonials, poetic/aesthetic copy, unsafe date labels, and misleading fallback metrics.

### Project workflow file

- `tasks/todo.md`
  - Track implementation checklist and final review notes for this task.

---

### Task 1: Add Content Regression Tests

**Files:**
- Create: `src/data/portfolio.seed.test.ts`

**Interfaces:**
- Consumes: `PORTFOLIO_SEED` exported from `src/data/portfolio.seed.ts`.
- Produces: A Vitest content regression test suite that must fail before content updates and pass after them.

- [ ] **Step 1: Create the failing content test**

Create `src/data/portfolio.seed.test.ts` with this complete content:

```ts
import { describe, expect, it } from "vitest";
import { PORTFOLIO_SEED } from "./portfolio.seed";

function section(key: string) {
  return PORTFOLIO_SEED.sections.find((item) => item.section_key === key);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

describe("portfolio seed content", () => {
  it("positions the hero around mobile fintech and payment apps", () => {
    const hero = section("hero");

    expect(hero?.subtitle).toBe("Mobile Developer");
    expect(hero?.body).toContain(
      "Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.",
    );
    expect(hero?.body).toContain(
      "I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.",
    );
    expect(PORTFOLIO_SEED.profile.tagline).toContain(
      "production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations",
    );
  });

  it("keeps about copy professional and avoids aesthetic-only positioning", () => {
    const about = section("about");
    const text = collectStrings(about).join("\n").toLowerCase();

    expect(text).toContain("production mobile apps");
    expect(text).toContain("clean architecture");
    expect(text).toContain("api");
    expect(text).not.toMatch(/magical|physics-based|editorial design|emotional|passion driven/);
  });

  it("does not ship fake or random guestbook testimonials in seed data", () => {
    expect(PORTFOLIO_SEED.guestbook).toEqual([]);
  });

  it("uses professional proof stats without zero or passion fallbacks", () => {
    const about = section("about");
    const proof = section("proof");
    const text = [about, proof].flatMap(collectStrings).join("\n").toLowerCase();

    expect(text).toContain("production apps");
    expect(text).toContain("fintech");
    expect(text).not.toMatch(/0\+|0%|passion driven/);
  });

  it("uses Present for active project period labels", () => {
    const member = PORTFOLIO_SEED.projects.find((project) => project.title === "Member App Ecosystem");
    const puas = PORTFOLIO_SEED.projects.find((project) => project.title === "Puas HUB");

    expect(member?.period_label).toBe("Aug 2025 – Present");
    expect(puas?.period_label).toBe("Feb 2026 – Present");

    const labels = PORTFOLIO_SEED.projects.map((project) => project.period_label ?? "").join("\n");
    expect(labels).not.toContain("Nov 2026");
    expect(labels).not.toContain("May 2026");
  });

  it("highlights the requested mobile project domains", () => {
    const text = collectStrings(PORTFOLIO_SEED.projects).join("\n").toLowerCase();

    expect(text).toContain("multi-tenant");
    expect(text).toContain("member");
    expect(text).toContain("merchant");
    expect(text).toContain("ppob");
    expect(text).toContain("qris");
    expect(text).toContain("nfc");
    expect(text).toContain("edc");
    expect(text).toContain("gps");
    expect(text).toContain("selfie");
  });
});
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run:

```bash
npm run test:run -- src/data/portfolio.seed.test.ts
```

Expected before implementation: `FAIL` with assertions mentioning the old hero/body copy, non-empty fake guestbook, `Passion Driven`, or old future period labels.

- [ ] **Step 3: Do not commit**

Do not commit. Keep the failing test in the working tree for the next task.

---

### Task 2: Refresh Seed Profile, Sections, SEO, Skills, and Guestbook

**Files:**
- Modify: `src/data/portfolio.seed.ts:32-47`
- Modify: `src/data/portfolio.seed.ts:345-387`
- Modify: `src/data/portfolio.seed.ts:405-507`
- Modify: `src/data/portfolio.seed.ts:509-534`

**Interfaces:**
- Consumes: `PortfolioPayload` shape from `src/types/portfolio.ts`.
- Produces: Professional fallback content for profile, skills, sections, SEO, and an empty seed guestbook array.

- [ ] **Step 1: Update profile positioning and SEO-facing fields**

In `src/data/portfolio.seed.ts`, replace the `profile` object fields at the top with these values, preserving unchanged contact URLs and personal details:

```ts
  profile: {
    full_name: "Arik Riko Prasetya",
    title: "Mobile Developer",
    tagline:
      "I build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations for fintech, payment, and multi-tenant products.",
    location: "Bojonegoro, Jawa Timur",
    email: "rikoarik04@gmail.com",
    phone: "+6285158880779",
    github_url: "https://github.com/rikoarik",
    linkedin_url: "https://linkedin.com/in/rikoarik",
    website_url: "https://arkdev.my.id",
    cv_url: "/NodeFlair_Resume_2026-04-11_13_37_51.pdf",
    locale_ui: "id",
    og_description:
      "Mobile Developer focused on fintech, payment, and multi-tenant mobile apps — Kotlin, React Native, Flutter, Laravel, REST API, and CI/CD.",
  },
```

- [ ] **Step 2: Update skill groups to match requested stack**

Replace the `skill_groups` array with this complete array:

```ts
  skill_groups: [
    {
      id: id("sg-1"),
      name: "Mobile Development",
      sort_order: 0,
      skills: [
        { id: id("sk-1"), name: "Kotlin", sort_order: 0 },
        { id: id("sk-2"), name: "Android", sort_order: 1 },
        { id: id("sk-3"), name: "React Native", sort_order: 2 },
        { id: id("sk-4"), name: "Expo", sort_order: 3 },
        { id: id("sk-5"), name: "Flutter", sort_order: 4 },
        { id: id("sk-6"), name: "MVVM", sort_order: 5 },
        { id: id("sk-7"), name: "Clean Architecture", sort_order: 6 },
        { id: id("sk-8"), name: "BLoC", sort_order: 7 },
        { id: id("sk-9"), name: "Zustand", sort_order: 8 },
        { id: id("sk-10"), name: "REST API", sort_order: 9 },
        { id: id("sk-11"), name: "Firebase", sort_order: 10 },
      ],
    },
    {
      id: id("sg-2"),
      name: "Backend & Integration",
      sort_order: 1,
      skills: [
        { id: id("sk-12"), name: "Laravel", sort_order: 0 },
        { id: id("sk-13"), name: "MySQL", sort_order: 1 },
        { id: id("sk-14"), name: "REST API", sort_order: 2 },
        { id: id("sk-15"), name: "JSON", sort_order: 3 },
        { id: id("sk-16"), name: "Swagger / OpenAPI", sort_order: 4 },
      ],
    },
    {
      id: id("sg-3"),
      name: "Tools & Delivery",
      sort_order: 2,
      skills: [
        { id: id("sk-17"), name: "GitLab", sort_order: 0 },
        { id: id("sk-18"), name: "GitLab CI/CD", sort_order: 1 },
        { id: id("sk-19"), name: "Git", sort_order: 2 },
        { id: id("sk-20"), name: "Postman", sort_order: 3 },
        { id: id("sk-21"), name: "Jira", sort_order: 4 },
        { id: id("sk-22"), name: "Play Store", sort_order: 5 },
        { id: id("sk-23"), name: "App Store", sort_order: 6 },
      ],
    },
  ],
```

- [ ] **Step 3: Remove non-credible seed guestbook messages**

Replace the entire `guestbook` array with an empty array:

```ts
  guestbook: [],
```

This intentionally removes fake/random fallback messages while preserving the real Supabase guestbook feature.

- [ ] **Step 4: Replace section copy for hero, about, contact, and proof**

Replace the `sections` array with this complete array:

```ts
  sections: [
    {
      id: id("section-hero"),
      section_key: "hero",
      title: "Arik Riko Prasetya",
      subtitle: "Mobile Developer",
      body: "Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.\nI build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.",
      meta: { cta_label: "Explore Work", cta_href: "#projects", brand: "ARP · Mobile Portfolio" },
      status: "published",
      published_at: null,
    },
    {
      id: id("section-about"),
      section_key: "about",
      title: "About Me",
      subtitle: "Engineering Approach",
      body: "I focus on mobile flows that users and operators can trust: clear states, predictable validation, resilient API handling, and careful edge-case coverage.",
      meta: {
        about_headline: "Reliable mobile apps for fintech and payments.",
        about_intro:
          "I build production mobile apps with clean architecture, reliable user flows, API integrations, and maintainable code that holds up in real user conditions.",
        focus_title: "Domain Focus",
        focus_body:
          "Fintech, payment, merchant and member apps, PPOB, QRIS, NFC, and multi-tenant mobile architecture.",
        craft_title: "Delivery",
        craft_body:
          "I keep features maintainable from development to release: reusable modules, GitLab CI/CD, store deployment, and production issue triage.",
        stats: [
          { value: 2, suffix: "+", label: "Years Mobile" },
          { value: 15, suffix: "+", label: "Production Apps" },
          { value: 3, suffix: "", label: "Core Stacks" },
        ],
      },
      status: "published",
      published_at: null,
    },
    {
      id: id("section-contact"),
      section_key: "contact",
      title: "Let's build reliable mobile apps.",
      subtitle: "Available for mobile roles, fintech/payment projects, and production app maintenance.",
      body: "Send an email or download my CV to discuss Kotlin, React Native, Flutter, or backend-integrated mobile work.",
      meta: {
        kicker: "Contact",
        talk_label: "Email me",
        cv_label: "Download CV",
        marquee_items: [
          "Kotlin Android",
          "React Native Expo",
          "Flutter",
          "Fintech",
          "Payment",
          "Multi-tenant Apps",
          "API Integration",
        ],
      },
      status: "published",
      published_at: null,
    },
    {
      id: id("section-proof"),
      section_key: "proof",
      title: "Proof Strip",
      subtitle: null,
      body: null,
      meta: {
        stats: [
          { value: "15+", label: "Production Apps" },
          { value: "2+ Years", label: "Mobile Experience" },
          { value: "Stores", label: "Play Store · App Store" },
          { value: "Fintech", label: "Payment Focus" },
        ],
      },
      status: "published",
      published_at: null,
    },
  ],
```

- [ ] **Step 5: Update SEO settings and home page description**

Replace the SEO descriptions with this value wherever `default_description` and `pages[0].description` currently use the old `Mobile & cross-platform developer` text:

```ts
"Mobile Developer focused on fintech, payment, and multi-tenant mobile apps — Kotlin, React Native, Flutter, Laravel, REST API, and CI/CD."
```

Also keep:

```ts
site_title: "Arik Riko Prasetya — Mobile Developer",
```

- [ ] **Step 6: Run the seed content test and confirm remaining failures are only project/experience copy**

Run:

```bash
npm run test:run -- src/data/portfolio.seed.test.ts
```

Expected after this task: Some assertions may still fail for active project periods or domain-specific project copy until Task 3 is complete. There must be no failures related to fake guestbook messages, hero positioning, `Passion Driven`, or aesthetic-only about copy.

- [ ] **Step 7: Do not commit**

Do not commit. Continue to Task 3.

---

### Task 3: Refresh Seed Experience and Project Copy

**Files:**
- Modify: `src/data/portfolio.seed.ts:48-344`

**Interfaces:**
- Consumes: the existing `Experience[]` and `Project[]` shapes.
- Produces: Recruiter-ready experience/project copy emphasizing mobile fintech/payment, multi-tenant apps, merchant/member flows, PPOB, QRIS, NFC, EDC, GPS/selfie attendance, API integration, and production maintenance.

- [ ] **Step 1: Replace experience bullets with focused production-mobile copy**

In `src/data/portfolio.seed.ts`, update only the `bullets` arrays for the four existing experiences with these values.

For `PUAS Hub`:

```ts
      bullets: [
        "Built and maintained a Flutter mobile app for PPOB and digital payment flows including pulsa, data packages, electricity, e-wallet, and game vouchers.",
        "Structured features with Clean Architecture and BLoC to keep transaction-heavy screens maintainable.",
        "Integrated REST APIs with Dio for product inquiry, checkout, payment status, and transaction history flows.",
        "Standardized loading, error, retry, and empty states across payment-related screens.",
        "Supported production fixes for daily digital payment workflows.",
      ],
```

For `Diprojectin`:

```ts
      bullets: [
        "Built Laravel backend services and web applications for client projects from requirements to delivery.",
        "Designed REST API structures that were easier to integrate from mobile and frontend clients.",
        "Delivered end-to-end features across database, API, and UI integration layers.",
        "Improved maintainability by using modular backend structure and clear request/response contracts.",
        "Shipped production-ready client work within agreed timelines.",
      ],
```

For `PT Teknologi Kartu Indonesia`:

```ts
      bullets: [
        "Developed and maintained merchant and member mobile apps within a multi-tenant fintech ecosystem, contributing to 15+ production apps.",
        "Built reusable React Native structures for shared flows, tenant customization, and API integration across member apps.",
        "Implemented merchant transaction features including QRIS, NFC, Bluetooth/POS, receipt, verification, and EDC-related flows.",
        "Handled production maintenance, release fixes, and app stability improvements for real merchant operations.",
        "Managed Play Store and App Store deployment workflows for multiple mobile applications.",
      ],
```

For `PT. Mahawangsa`:

```ts
      bullets: [
        "Developed an Android attendance app for real employee check-in/check-out usage.",
        "Implemented GPS and selfie verification to validate attendance location and identity.",
        "Built attendance history, notification, and validation flows for daily operations.",
        "Improved attendance data reliability through location and image-based checks.",
        "Delivered a production-ready app used for employee attendance management.",
      ],
```

- [ ] **Step 2: Update Member App Ecosystem project**

For the project with `title: "Member App Ecosystem"`, set these fields:

```ts
      subtitle: "Multi-tenant fintech member apps",
      period_label: "Aug 2025 – Present",
      stack: ["React Native", "Expo", "REST API", "Play Store", "App Store"],
      tags: ["mobile", "fintech", "multi-tenant", "payment"],
      case_study: {
        problem: "Multiple tenants needed member mobile apps with consistent financial flows while still supporting brand-specific customization.",
        constraints: ["Multi-tenant structure", "Reusable member flows", "Production releases", "Store compliance"],
        solution: "Built shared React Native structures, reusable feature patterns, API integration flows, and tenant-level customization points.",
        results: ["15+ apps shipped or maintained", "Consistent member experience across tenant apps"],
      },
      bullets: [
        "Developed and maintained member apps in a multi-tenant fintech ecosystem.",
        "Built reusable flows for authentication, member profiles, balance/payment-related screens, QRIS, PPOB, marketplace, and virtual card features.",
        "Integrated REST APIs and standardized state handling for loading, error, retry, and empty states.",
        "Supported tenant customization while keeping shared structure maintainable across apps.",
        "Handled Play Store and App Store release preparation for production apps.",
      ],
```

- [ ] **Step 3: Update Puas HUB project**

For `title: "Puas HUB"`, set these fields:

```ts
      subtitle: "Flutter app for PPOB and digital payment",
      period_label: "Feb 2026 – Present",
      stack: ["Flutter", "BLoC", "Dio", "Clean Architecture", "REST API"],
      tags: ["mobile", "fintech", "flutter", "ppob"],
      case_study: {
        problem: "PPOB and digital payment flows need reliable UX across many product categories and transaction states.",
        constraints: ["Real-time transaction status", "Consistent state handling", "Maintainable feature growth"],
        solution: "Implemented Clean Architecture, BLoC, Dio API integration, and standardized loading/error/retry patterns.",
        results: ["More consistent transaction UX", "Scalable structure for new PPOB services"],
      },
      bullets: [
        "Built and maintained a Flutter app for PPOB and digital payments such as pulsa, data packages, electricity, e-wallet top-up, and game vouchers.",
        "Implemented Clean Architecture and BLoC for maintainable transaction-heavy features.",
        "Integrated REST APIs with Dio for inquiry, checkout, payment status, and transaction history.",
        "Standardized loading, error, retry, and success states across payment flows.",
      ],
```

- [ ] **Step 4: Update DIGILUH attendance project**

For `title: "DIGILUH"`, set these fields:

```ts
      subtitle: "Government attendance app",
      period_label: "May 2025 – Aug 2025",
      stack: ["Flutter", "BLoC", "GPS", "Offline-first"],
      tags: ["mobile", "flutter", "attendance"],
      bullets: [
        "Developed a Flutter-based attendance app for real-world field usage.",
        "Implemented GPS-based attendance validation, history, and operational attendance flows.",
        "Built offline-first handling with background synchronization for unstable connectivity.",
        "Applied BLoC and Repository Pattern for maintainable state and data access.",
      ],
```

- [ ] **Step 5: Update Merchant SolusiNegeri project**

For `title: "Merchant SolusiNegeri"`, set these fields:

```ts
      subtitle: "Native Android merchant payment app",
      period_label: "Jan 2025 – Present",
      stack: ["Kotlin", "Android", "MVVM", "QRIS", "NFC", "EDC"],
      tags: ["mobile", "merchant", "payment", "fintech"],
      case_study: {
        problem: "Merchant operations need reliable transaction flows across QRIS, NFC, EDC-related usage, receipt handling, and member verification.",
        constraints: ["Operational reliability", "Payment edge cases", "Device and peripheral behavior", "Security checks"],
        solution: "Built native Android flows with maintainable architecture, defensive transaction states, verification screens, and payment-related integrations.",
        results: ["More reliable merchant transaction flow", "Maintainable base for production fixes and feature updates"],
      },
      bullets: [
        "Developed a native Android merchant app for daily payment and transaction operations.",
        "Implemented QRIS, NFC, EDC-related flow, receipt handling, member verification, and transaction screens.",
        "Applied MVVM and Clean Architecture to keep merchant features maintainable.",
        "Handled payment edge cases, device checks, and production reliability concerns.",
      ],
```

- [ ] **Step 6: Update eMahaWangsa attendance project**

For `title: "eMahaWangsa"`, set these fields:

```ts
      subtitle: "Attendance with GPS and selfie verification",
      period_label: "Nov 2024 – Jan 2025",
      stack: ["Android", "GPS", "Camera", "Validation Flow"],
      tags: ["mobile", "attendance", "android"],
      bullets: [
        "Developed an Android attendance app for employee check-in and check-out workflows.",
        "Implemented GPS and selfie verification to validate location and identity before attendance submission.",
        "Built attendance history, notifications, and validation states for daily real-world usage.",
        "Improved attendance data reliability with location and image-based checks.",
      ],
```

- [ ] **Step 7: Update supporting project copy only where needed**

Keep supporting projects, but lightly align any vague bullets to production mobile maintenance. Apply these exact replacements if the current copy is still present:

For `Payment Reliability Kit`, replace bullets with:

```ts
      bullets: [
        "Standardized loading, error, retry, and success flows across transaction-heavy mobile screens.",
        "Reduced inconsistent UI states during network interruptions and payment status checks.",
      ],
```

For `Bluetooth POS Stabilization`, replace bullets with:

```ts
      bullets: [
        "Improved reconnect behavior for Bluetooth POS peripherals under unstable field conditions.",
        "Added defensive transaction state handling to avoid stuck cashier screens.",
      ],
```

For `NFC Tap-to-Pay Flow`, replace bullets with:

```ts
      bullets: [
        "Hardened NFC read paths and error reporting for merchant cashier workflows.",
        "Added lightweight telemetry hooks to support production field debugging.",
      ],
```

For `Store Release Pipeline`, replace bullets with:

```ts
      bullets: [
        "Streamlined release checklists for multiple mobile app builds and tenant variants.",
        "Reduced manual versioning and track-promotion mistakes during Play Store and App Store releases.",
      ],
```

For `API Contract Playground`, replace bullets with:

```ts
      bullets: [
        "Prototyped Laravel/OpenAPI endpoints before mobile integration work started.",
        "Documented request, response, and edge-case behavior discovered during mobile testing.",
      ],
```

For `React Native State Toolkit`, replace bullets with:

```ts
      bullets: [
        "Created reusable hooks for auth, session, feature flags, and tenant-aware state in React Native apps.",
        "Improved consistency between member apps in the same multi-tenant ecosystem.",
      ],
```

For `Crash & ANR Triage Dashboard`, replace bullets with:

```ts
      bullets: [
        "Correlated crash and ANR clusters to release trains for faster production triage.",
        "Prioritized fixes based on merchant and member app impact.",
      ],
```

- [ ] **Step 8: Run content test and confirm it passes**

Run:

```bash
npm run test:run -- src/data/portfolio.seed.test.ts
```

Expected: `PASS src/data/portfolio.seed.test.ts` and all six tests passing.

- [ ] **Step 9: Do not commit**

Do not commit. Continue to Task 4.

---

### Task 4: Refresh Component Fallback Copy and Safe Display Defaults

**Files:**
- Modify: `src/components/portfolio/PastelHero.tsx:32-38`
- Modify: `src/components/infinite-field/sections/IFAboutSection.tsx:57-130`
- Modify: `src/components/infinite-field/sections/IFProjectsSection.tsx:545-548`
- Modify: `src/components/infinite-field/sections/IFCareerSection.tsx:9-13`
- Modify: `src/components/infinite-field/sections/IFGuestbookSection.tsx:367-374`
- Modify: `src/components/ui/motion-footer.tsx:208-235`

**Interfaces:**
- Consumes: existing component props and SectionContent fields.
- Produces: Professional fallback UI copy even if CMS rows are missing, plus no `0+` stat fallback before animation.

- [ ] **Step 1: Update hero fallback copy**

In `src/components/portfolio/PastelHero.tsx`, replace this fallback:

```ts
  const taglineLines = (section?.body ?? "He didn't wait to be taught.\nHe just started building.")
```

with:

```ts
  const taglineLines = (section?.body ?? "Mobile Developer focused on fintech, payment, and multi-tenant mobile applications.\nI build production-ready mobile apps using Kotlin, React Native, Flutter, and backend integrations.")
```

Do not change hero layout, refs, animation, CTA behavior, or contribution visualization.

- [ ] **Step 2: Update about stat fallback HTML from `0` to the actual value**

In `src/components/infinite-field/sections/IFAboutSection.tsx`, inside `StatBlock`, replace:

```tsx
        <span
          ref={numRef}
          data-stat-value={value}
          className="ifs-stat-num font-black text-[clamp(2.25rem,12vw,3.75rem)] leading-none tracking-tighter text-[var(--foreground)] sm:text-7xl md:text-8xl lg:text-[6.5rem]"
        >
          0
        </span>
```

with:

```tsx
        <span
          ref={numRef}
          data-stat-value={value}
          className="ifs-stat-num font-black text-[clamp(2.25rem,12vw,3.75rem)] leading-none tracking-tighter text-[var(--foreground)] sm:text-7xl md:text-8xl lg:text-[6.5rem]"
        >
          {value}
        </span>
```

This keeps animation logic but prevents static HTML from showing `0+` before JavaScript runs.

- [ ] **Step 3: Update about fallback copy and stats**

In `src/components/infinite-field/sections/IFAboutSection.tsx`, replace fallback strings with these exact values:

```ts
  const headline =
    typeof section?.meta?.about_headline === "string" && section.meta.about_headline.trim()
      ? section.meta.about_headline
      : "Reliable mobile apps for fintech and payments.";
  const subline =
    typeof section?.meta?.about_intro === "string" && section.meta.about_intro.trim()
      ? section.meta.about_intro
      : "I build production mobile apps with clean architecture, reliable user flows, API integrations, and maintainable code that holds up in real user conditions.";
  const philosophyTitle =
    typeof section?.subtitle === "string" && section.subtitle.trim()
      ? section.subtitle
      : "Engineering Approach";
  const philosophyBody =
    typeof section?.body === "string" && section.body.trim()
      ? section.body
      : "I focus on mobile flows that users and operators can trust: clear states, predictable validation, resilient API handling, and careful edge-case coverage.";
  const focusTitle =
    typeof section?.meta?.focus_title === "string" ? section.meta.focus_title : "Domain Focus";
  const focusBody =
    typeof section?.meta?.focus_body === "string"
      ? section.meta.focus_body
      : "Fintech, payment, merchant and member apps, PPOB, QRIS, NFC, and multi-tenant mobile architecture.";
```

Replace `defaultAboutStats` with:

```ts
  const defaultAboutStats: AboutStat[] = [
    { value: 2, suffix: "+", label: "Years Mobile" },
    { value: 15, suffix: "+", label: "Production Apps" },
    { value: 3, suffix: "", label: "Core Stacks" },
  ];
```

Replace craft fallback with:

```ts
  const craftTitle =
    typeof section?.meta?.craft_title === "string" && section.meta.craft_title.trim()
      ? section.meta.craft_title
      : "Delivery";
  const craftBody =
    typeof section?.meta?.craft_body === "string" && section.meta.craft_body.trim()
      ? section.meta.craft_body
      : "I keep features maintainable from development to release: reusable modules, GitLab CI/CD, store deployment, and production issue triage.";
```

- [ ] **Step 4: Update projects section lead copy**

In `src/components/infinite-field/sections/IFProjectsSection.tsx`, replace the lead paragraph text:

```tsx
                Production apps across mobile and cross-platform — curated case studies with
                measurable impact.
```

with:

```tsx
                Fintech, payment, merchant/member, and operational mobile apps — selected work
                focused on real production flows.
```

- [ ] **Step 5: Make career period helper safer while preserving Present behavior**

In `src/components/infinite-field/sections/IFCareerSection.tsx`, replace:

```ts
function fmtPeriod(e: { start_date: string | null; end_date: string | null }) {
  const s = e.start_date ?? "";
  const end = e.end_date ? e.end_date : "Present";
  return `${s} — ${end}`;
}
```

with:

```ts
function fmtPeriod(e: { start_date: string | null; end_date: string | null }) {
  const start = e.start_date?.trim() ?? "";
  const end = e.end_date?.trim() || "Present";
  return start ? `${start} — ${end}` : end;
}
```

- [ ] **Step 6: Update guestbook section copy without removing the feature**

In `src/components/infinite-field/sections/IFGuestbookSection.tsx`, replace:

```tsx
          <p className="text-[var(--muted-foreground)] text-base font-medium leading-relaxed">
            Leave a mark on this infinite field. No login, just raw vibes.
          </p>
```

with:

```tsx
          <p className="text-[var(--muted-foreground)] text-base font-medium leading-relaxed">
            Messages from collaborators and visitors appear here after review. Keep it relevant and professional.
          </p>
```

Keep the `Write Message` button and `CommentModal` unchanged.

- [ ] **Step 7: Update footer fallback copy**

In `src/components/ui/motion-footer.tsx`, replace `chunkMarquee` fallback return:

```ts
  return cleaned.length ? cleaned : ["Open to work", "Software engineering", "Mari berhubung", "Create impact", "Creative development"];
```

with:

```ts
  return cleaned.length ? cleaned : ["Kotlin Android", "React Native Expo", "Flutter", "Fintech", "Payment", "API Integration"];
```

Then replace footer fallback constants:

```ts
  const kicker = typeof section?.meta?.kicker === "string" ? section.meta.kicker : "Closing chapter";
  const heading = section?.title?.trim() || "Let's build something.";
  const lead = section?.subtitle?.trim() || "Unduh CV atau kirim email — respons cepat.";
```

with:

```ts
  const kicker = typeof section?.meta?.kicker === "string" ? section.meta.kicker : "Contact";
  const heading = section?.title?.trim() || "Let's build reliable mobile apps.";
  const lead = section?.subtitle?.trim() || "Available for mobile roles, fintech/payment projects, and production app maintenance.";
```

Replace default primary label:

```ts
  const primaryLabel = typeof section?.meta?.talk_label === "string" ? section.meta.talk_label : "Get in touch";
```

with:

```ts
  const primaryLabel = typeof section?.meta?.talk_label === "string" ? section.meta.talk_label : "Email me";
```

- [ ] **Step 8: Run targeted content checks**

Run:

```bash
grep -RInE "He didn't wait|physics-based|magical|raw vibes|Awwwards Bot|Satya Nadella|Passion Driven" src/data/portfolio.seed.ts src/components/portfolio/PastelHero.tsx src/components/infinite-field/sections/IFAboutSection.tsx src/components/infinite-field/sections/IFGuestbookSection.tsx src/components/ui/motion-footer.tsx || true
```

Expected: no matching lines.

- [ ] **Step 9: Run content test again**

Run:

```bash
npm run test:run -- src/data/portfolio.seed.test.ts
```

Expected: `PASS src/data/portfolio.seed.test.ts`.

- [ ] **Step 10: Do not commit**

Do not commit. Continue to Task 5.

---

### Task 5: Track Work in `tasks/todo.md` and Add CMS-Ready Notes

**Files:**
- Create or Modify: `tasks/todo.md`

**Interfaces:**
- Consumes: completed code/content changes from Tasks 1-4.
- Produces: project-local checklist and review notes required by the repository workflow.

- [ ] **Step 1: Create/update `tasks/todo.md`**

Write `tasks/todo.md` with this structure, marking boxes accurately as implementation proceeds:

```md
# Portfolio Content Refresh Todo

Date: 2026-07-01

## Goal

Make the portfolio copy more professional, recruiter-ready, and aligned with Mobile Developer positioning for fintech, payment, and multi-tenant mobile apps.

## Checklist

- [ ] Add content regression tests for seed portfolio copy.
- [ ] Refresh profile, hero, about, proof, contact, SEO, skills, and guestbook seed content.
- [ ] Refresh experience and project copy for fintech/payment/mobile production positioning.
- [ ] Refresh component fallback copy and stat/date display safety.
- [ ] Run targeted content grep checks.
- [ ] Run `npm run test:run -- src/data/portfolio.seed.test.ts`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Prepare final report with changed files, section summary, verification results, and CMS override risk.

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
  - `npm run test:run -- src/data/portfolio.seed.test.ts`
  - `npm run lint`
  - `npm run build`
- Manual review risk: production Supabase content may override seed fallback content.
```

- [ ] **Step 2: Update checklist boxes as tasks are completed**

After each verification command, edit `tasks/todo.md` to mark completed items with `[x]`. Do not mark `npm run build` complete unless it succeeds.

- [ ] **Step 3: Do not commit**

Do not commit. Continue to Task 6.

---

### Task 6: Full Verification and Final Report Preparation

**Files:**
- Read only: changed files and command output.
- Modify only if verification reveals a real issue.

**Interfaces:**
- Consumes: all changes from Tasks 1-5.
- Produces: verified working tree and final user report.

- [ ] **Step 1: Run content regression test**

Run:

```bash
npm run test:run -- src/data/portfolio.seed.test.ts
```

Expected: all tests pass.

If it fails, fix the exact failing copy/content assertion and rerun before continuing.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: no ESLint errors.

If it fails, fix only issues caused by this task. If unrelated pre-existing lint errors appear, report them separately and do not claim lint passed.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: `next build` completes successfully.

If it fails, fix only issues caused by this task. If unrelated build failures appear, capture the output and report honestly.

- [ ] **Step 4: Inspect git diff**

Run:

```bash
git diff -- src/data/portfolio.seed.ts src/data/portfolio.seed.test.ts src/components/portfolio/PastelHero.tsx src/components/infinite-field/sections/IFAboutSection.tsx src/components/infinite-field/sections/IFProjectsSection.tsx src/components/infinite-field/sections/IFCareerSection.tsx src/components/infinite-field/sections/IFGuestbookSection.tsx src/components/ui/motion-footer.tsx tasks/todo.md docs/superpowers/specs/2026-07-01-portfolio-content-design.md docs/superpowers/plans/2026-07-01-portfolio-content-refresh.md
```

Expected: diff is content/copy/test/doc focused, with no large UI rewrite and no dependency changes.

- [ ] **Step 5: Prepare final report**

Report these sections to the user:

```md
## Selesai

### File diubah
- `...`

### Section diperbaiki
- Hero
- About
- Projects
- Experience/Career
- Skills/Tech stack
- Contact
- Guestbook seed/fallback
- SEO fallback

### Ringkasan perubahan copy
- ...

### Verification
- `npm run test:run -- src/data/portfolio.seed.test.ts`: PASS/FAIL
- `npm run lint`: PASS/FAIL
- `npm run build`: PASS/FAIL

### Risiko / perlu review manual
- Supabase production rows can override seed content; align CMS rows if live site still shows old copy.
- Review whether `15+ Production Apps` and `2+ Years Mobile` remain accurate.
- Guestbook seed is intentionally empty; real approved Supabase messages still render.

No commit dibuat.
```

- [ ] **Step 6: Do not commit**

Do not commit unless the user explicitly asks.
