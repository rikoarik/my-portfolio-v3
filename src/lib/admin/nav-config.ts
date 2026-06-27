export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", exact: true }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/dashboard/projects", label: "Projects" },
      { href: "/admin/dashboard/experiences", label: "Experiences" },
      { href: "/admin/dashboard/skills", label: "Skills" },
      { href: "/admin/dashboard/education", label: "Education" },
      { href: "/admin/dashboard/sections", label: "Sections" },
      { href: "/admin/dashboard/guestbook", label: "Guestbook" },
    ],
  },
  {
    title: "Assets",
    items: [{ href: "/admin/dashboard/media", label: "Media" }],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/dashboard/profile", label: "Profil situs" },
      { href: "/admin/dashboard/seo", label: "SEO" },
      { href: "/admin/dashboard/loader", label: "Loader" },
    ],
  },
];

export function getAdminPageTitle(pathname: string): string {
  if (pathname === "/admin/dashboard") return "Dashboard";
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.label;
      }
    }
  }
  return "CMS";
}
