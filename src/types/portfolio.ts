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
};

export type Project = {
  id: string;
  title: string;
  subtitle: string | null;
  period_label: string | null;
  stack: string[];
  bullets: string[];
  repo_url: string | null;
  demo_url: string | null;
  sort_order: number;
  featured: boolean;
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

export type PortfolioPayload = {
  profile: SiteProfile;
  experiences: Experience[];
  projects: Project[];
  skill_groups: SkillGroup[];
  education: Education[];
  source: "supabase" | "seed";
};
