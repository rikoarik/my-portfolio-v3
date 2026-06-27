import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderKanban,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  UserCircle,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DashboardSnapshot = {
  projectsTotal: number;
  projectsPublished: number;
  experiencesTotal: number;
  experiencesPublished: number;
  guestbookTotal: number;
  guestbookPending: number;
  guestbookApproved: number;
  guestbookHidden: number;
  sectionsTotal: number;
  sectionsPublished: number;
  mediaTotal: number;
  seoPagesTotal: number;
  skillsTotal: number;
  educationTotal: number;
};

export type ShortcutCardConfig = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "orange";
};

export type KpiCardConfig = {
  id: string;
  label: string;
  value: number;
  subtext: string;
  href: string;
};

export type ChartDatum = {
  name: string;
  published: number;
  draft: number;
};

async function countRows(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  filter?: { column: string; value: string },
): Promise<number> {
  if (!supabase) return 0;
  const query = supabase.from(table).select("id", { count: "exact", head: true });
  const request = filter ? query.eq(filter.column, filter.value) : query;
  const { count } = await request;
  return count ?? 0;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = await createSupabaseServerClient();
  const [
    projectsTotal,
    projectsPublished,
    experiencesTotal,
    experiencesPublished,
    guestbookTotal,
    guestbookPending,
    guestbookApproved,
    guestbookHidden,
    sectionsTotal,
    sectionsPublished,
    mediaTotal,
    seoPagesTotal,
    skillsTotal,
    educationTotal,
  ] = await Promise.all([
    countRows(supabase, "projects"),
    countRows(supabase, "projects", { column: "status", value: "published" }),
    countRows(supabase, "experiences"),
    countRows(supabase, "experiences", { column: "status", value: "published" }),
    countRows(supabase, "guestbook"),
    countRows(supabase, "guestbook", { column: "status", value: "pending" }),
    countRows(supabase, "guestbook", { column: "status", value: "approved" }),
    countRows(supabase, "guestbook", { column: "status", value: "hidden" }),
    countRows(supabase, "section_content"),
    countRows(supabase, "section_content", { column: "status", value: "published" }),
    countRows(supabase, "media_assets"),
    countRows(supabase, "seo_pages"),
    countRows(supabase, "skills"),
    countRows(supabase, "education"),
  ]);

  return {
    projectsTotal,
    projectsPublished,
    experiencesTotal,
    experiencesPublished,
    guestbookTotal,
    guestbookPending,
    guestbookApproved,
    guestbookHidden,
    sectionsTotal,
    sectionsPublished,
    mediaTotal,
    seoPagesTotal,
    skillsTotal,
    educationTotal,
  };
}

export function buildChartData(snapshot: DashboardSnapshot): ChartDatum[] {
  return [
    {
      name: "Projects",
      published: snapshot.projectsPublished,
      draft: Math.max(snapshot.projectsTotal - snapshot.projectsPublished, 0),
    },
    {
      name: "Experiences",
      published: snapshot.experiencesPublished,
      draft: Math.max(snapshot.experiencesTotal - snapshot.experiencesPublished, 0),
    },
    {
      name: "Sections",
      published: snapshot.sectionsPublished,
      draft: Math.max(snapshot.sectionsTotal - snapshot.sectionsPublished, 0),
    },
    {
      name: "Guestbook",
      published: snapshot.guestbookApproved,
      draft: snapshot.guestbookPending,
    },
  ];
}

export const DASHBOARD_SHORTCUTS: ShortcutCardConfig[] = [
  {
    id: "projects",
    title: "Projects",
    description: "Kelola project wall, cover, dan case study.",
    href: "/admin/dashboard/projects",
    icon: FolderKanban,
    color: "blue",
  },
  {
    id: "sections",
    title: "Sections",
    description: "Edit copy hero, about, proof, contact, nav.",
    href: "/admin/dashboard/sections",
    icon: LayoutTemplate,
    color: "purple",
  },
  {
    id: "guestbook",
    title: "Guestbook",
    description: "Moderasi pesan tamu sebelum tampil publik.",
    href: "/admin/dashboard/guestbook",
    icon: MessageSquare,
    color: "orange",
  },
  {
    id: "profile",
    title: "Profil situs",
    description: "Nama, kontak, CV, dan metadata dasar.",
    href: "/admin/dashboard/profile",
    icon: UserCircle,
    color: "green",
  },
];

export function buildKpiCards(snapshot: DashboardSnapshot): KpiCardConfig[] {
  return [
    {
      id: "projects",
      label: "Projects",
      value: snapshot.projectsTotal,
      subtext: `${snapshot.projectsPublished} published`,
      href: "/admin/dashboard/projects",
    },
    {
      id: "experiences",
      label: "Experiences",
      value: snapshot.experiencesTotal,
      subtext: `${snapshot.experiencesPublished} published`,
      href: "/admin/dashboard/experiences",
    },
    {
      id: "sections",
      label: "Sections",
      value: snapshot.sectionsTotal,
      subtext: `${snapshot.sectionsPublished} published`,
      href: "/admin/dashboard/sections",
    },
    {
      id: "guestbook",
      label: "Guestbook",
      value: snapshot.guestbookTotal,
      subtext: `${snapshot.guestbookPending} pending`,
      href: "/admin/dashboard/guestbook",
    },
    {
      id: "media",
      label: "Media",
      value: snapshot.mediaTotal,
      subtext: "Registered assets",
      href: "/admin/dashboard/media",
    },
    {
      id: "seo",
      label: "SEO Pages",
      value: snapshot.seoPagesTotal,
      subtext: "Page overrides",
      href: "/admin/dashboard/seo",
    },
    {
      id: "skills",
      label: "Skills",
      value: snapshot.skillsTotal,
      subtext: "Skill entries",
      href: "/admin/dashboard/skills",
    },
    {
      id: "education",
      label: "Education",
      value: snapshot.educationTotal,
      subtext: "Education rows",
      href: "/admin/dashboard/education",
    },
  ];
}

export function buildLegendItems(snapshot: DashboardSnapshot) {
  return [
    {
      label: "Projects",
      published: snapshot.projectsPublished,
      draft: Math.max(snapshot.projectsTotal - snapshot.projectsPublished, 0),
      color: "#2563eb",
    },
    {
      label: "Experiences",
      published: snapshot.experiencesPublished,
      draft: Math.max(snapshot.experiencesTotal - snapshot.experiencesPublished, 0),
      color: "#a855f7",
    },
    {
      label: "Sections",
      published: snapshot.sectionsPublished,
      draft: Math.max(snapshot.sectionsTotal - snapshot.sectionsPublished, 0),
      color: "#22c55e",
    },
    {
      label: "Guestbook",
      published: snapshot.guestbookApproved,
      draft: snapshot.guestbookPending,
      color: "#f59e0b",
    },
  ];
}

export const SECONDARY_SHORTCUTS = [
  {
    id: "media",
    title: "Media library",
    description: "Asset URL + metadata untuk cover dan OG.",
    href: "/admin/dashboard/media",
    icon: ImageIcon,
    color: "blue" as const,
  },
  {
    id: "education",
    title: "Education",
    description: "Riwayat pendidikan di career section.",
    href: "/admin/dashboard/education",
    icon: BookOpen,
    color: "green" as const,
  },
];
