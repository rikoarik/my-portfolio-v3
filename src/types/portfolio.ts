export type SiteProfile = {
  full_name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  cv_url: string | null;
  locale_ui: string;
  og_description: string | null;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  bullets: string[];
  status?: "draft" | "published";
  published_at?: string | null;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string | null;
  period_label: string | null;
  stack: string[];
  bullets: string[];
  tags?: string[];
  case_study?: {
    problem: string;
    constraints: string[];
    solution: string;
    results: string[];
  } | null;
  repo_url: string | null;
  demo_url: string | null;
  sort_order: number;
  featured: boolean;
  status?: "draft" | "published";
  published_at?: string | null;
  /** Hero / card image — add column in DB when ready */
  cover_url?: string | null;
};

export type SkillGroup = {
  id: string;
  name: string;
  sort_order: number;
  skills: { id: string; name: string; sort_order: number }[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  gpa: string | null;
  sort_order: number;
  bullets: string[];
};

export type GuestMessage = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  status?: "pending" | "approved" | "hidden";
  moderated_by?: string | null;
  moderated_at?: string | null;
  moderation_note?: string | null;
};

export type SectionContent = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  meta: Record<string, unknown>;
  status: "draft" | "published";
  published_at: string | null;
};

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  created_at: string;
};

export type SeoSettings = {
  landing_theme_preset:
    | "ember-night"
    | "forest-hearth"
    | "cocoa-slate"
    | "dusk-mocha"
    | "sage-mist"
    | "linen-dawn"
    | "rose-clay"
    | "ocean-paper"
    | "amber-fog"
    | "pine-smoke";
  site_title: string;
  title_template: string;
  default_description: string | null;
  default_og_image_url: string | null;
  default_robots: string | null;
  metadata: Record<string, unknown>;
  status: "draft" | "published";
};

export type SeoPage = {
  id: string;
  page_key: string;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  robots: string | null;
  metadata: Record<string, unknown>;
  status: "draft" | "published";
};

export type GitHubContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubContributionWeek = {
  weekStart: string;
  days: GitHubContributionDay[];
};

export type GitHubContributionSummary = {
  username: string;
  totalContributions: number;
  maxCount: number;
  weeks: GitHubContributionWeek[];
  fetchedAt: string;
  isFallback?: boolean;
};

export type PortfolioPayload = {
  profile: SiteProfile;
  experiences: Experience[];
  projects: Project[];
  skill_groups: SkillGroup[];
  education: Education[];
  guestbook: GuestMessage[];
  sections: SectionContent[];
  media_assets: MediaAsset[];
  seo: {
    settings: SeoSettings | null;
    pages: SeoPage[];
  };
  github_contributions: GitHubContributionSummary | null;
  source: "supabase" | "seed";
};
