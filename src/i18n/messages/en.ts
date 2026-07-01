import type { Messages } from "./id";

export const messages = {
  common: {
    offlineBanner:
      "Offline mode — seed data. Connect Supabase for live content.",
    backToTop: {
      ariaLabel: "Back to top",
      label: "↑ Top",
    },
    skipToContent: "Skip to content",
  },
  loader: {
    label: "Loading",
    ariaLabel: "Loading",
    messages: {
      preparingScene: "Preparing scene",
      loadingPortfolio: "Loading portfolio",
    },
  },
  nav: {
    ariaLabel: "Site navigation",
    brandFallback: "ARP · Portfolio",
    scrollToTopAria: "Scroll to top",
    items: {
      work: "Work",
      about: "About",
      career: "Career",
      guestbook: "Guestbook",
      contact: "Contact",
    },
  },
  hero: {
    nameFallback: "Arik Riko Prasetya",
    taglineLine1:
      "Mobile developer focused on fintech, payments, and multi-tenant mobile apps.",
    taglineLine2:
      "I build production-ready mobile apps with Kotlin, React Native, Flutter, and backend integrations.",
    ctaExploreWork: "Explore Work",
    scrollIndicator: "scroll",
  },
  github: {
    unavailable: "[GitHub data unavailable]",
    contributionsTitle: "GitHub Contributions",
    hoverTimeline: "Hover to inspect timeline",
    commitCount: "{date} · {count} commits",
    legendLess: "Less",
    legendMore: "More",
  },
  proofStrip: {
    ariaLabel: "Key statistics",
    stats: {
      productionApps: { value: "15+", label: "Production Apps" },
      mobileExperience: { value: "2+ Years", label: "Mobile Experience" },
      ship: { value: "Ship", label: "Play Store · App Store" },
      fintech: { value: "Fintech", label: "Domain Focus" },
    },
  },
  projects: {
    kicker: "Portfolio",
    title: "Selected Works",
    lead: "Fintech, payment, merchant/member, and operational mobile apps — selected work focused on real production flows.",
    count: "{count} projects",
    featuredSuffix: " · {count} featured",
    tablistAria: "Portfolio projects",
    accordion: {
      tabAria: "Project {index}: {title}",
      kicker: "Project {index}",
      featured: "Featured",
      viewDetail: "View details",
    },
    modal: {
      closeAria: "Close project details",
      close: "Close",
      kicker: "Project",
      stackTags: "Stack & tags",
      stackTagsHint: "Technologies and labels used in this project.",
      highlights: "Highlights",
      highlightsHint: "Key outcomes, metrics, or impact — not a feature list.",
      caseStudy: "Case study",
      caseStudyHint: "Problem, constraints, solution, then measurable impact.",
      problem: "Problem",
      constraints: "Constraints",
      solution: "Solution",
      impact: "Impact",
      ctaAria: "Project links",
      demo: "Demo ↗",
      repo: "Repo ↗",
    },
  },
  about: {
    sectionLabel: "[ 01 — {title} ]",
    titleFallback: "About Me",
    headlineFallback: "Reliable mobile apps for fintech and payments.",
    introFallback:
      "I build production mobile apps with clean architecture, reliable user flows, API integrations, and maintainable code that holds up in real user conditions.",
    philosophyTitleFallback: "Engineering Approach",
    philosophyBodyFallback:
      "I focus on mobile flows that users and operators can trust: clear states, predictable validation, resilient API handling, and careful edge-case coverage.",
    focusTitleFallback: "Domain Focus",
    focusBodyFallback:
      "Fintech, payments, merchant and member apps, PPOB, QRIS, NFC, and multi-tenant mobile architecture.",
    craftTitleFallback: "Delivery",
    craftBodyFallback:
      "I keep features maintainable from development to release: reusable modules, GitLab CI/CD, store deployment, and production issue triage.",
    stats: {
      yearsMobile: "Years Mobile",
      productionApps: "Production Apps",
      coreStacks: "Core Stacks",
    },
  },
  career: {
    title: "Career",
    present: "Present",
    stackPill: "Stack",
    stackTitle: "Expertise",
    stackLead: "Tools and domains organized around how you ship.",
    educationPill: "Foundation",
    educationTitle: "Education",
    gpa: "GPA {gpa}",
  },
  guestbook: {
    title: "Guest Messages",
    lead: "Messages from collaborators and visitors appear here after review. Keep it relevant and professional.",
    orbitingCount: "{visible} of {total} messages orbiting",
    writeMessage: "Write Message",
    modal: {
      closeAria: "Close message form",
      title: "Leave a Message",
      subtitle: "Your message will join the infinite field of drift.",
      nameLabel: "Your Name",
      namePlaceholder: "e.g. Satoshi",
      messageLabel: "Message",
      messagePlaceholder: "What's on your mind?",
      sending: "Sending...",
      success: "Success!",
      post: "Post Message",
      successMessage: "Message sent! See you on the voyage route.",
    },
    errors: {
      required: "Name and message are required.",
      supabaseDisconnected: "Supabase is not connected.",
      sendFailed: "Failed to send message. Please try again.",
    },
  },
  footer: {
    kickerFallback: "Contact",
    headingFallback: "Let's build reliable mobile apps.",
    leadFallback:
      "Available for mobile roles, fintech/payment projects, and production app maintenance.",
    bodyFallback:
      "Send an email or download my CV to discuss Kotlin, React Native, Flutter, or backend-integrated mobile work.",
    emailFallback: "Email me",
    cvFallback: "Download CV",
    github: "GitHub",
    linkedin: "LinkedIn",
    website: "Website",
    marquee: {
      kotlin: "Kotlin Android",
      reactNative: "React Native Expo",
      flutter: "Flutter",
      fintech: "Fintech",
      payment: "Payment",
      apiIntegration: "API Integration",
    },
    copyright: "© {year} {name}. All rights reserved.",
  },
} satisfies Messages;
