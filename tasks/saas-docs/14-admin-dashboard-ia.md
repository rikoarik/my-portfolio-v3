# 14. Admin Dashboard IA / UX Flow

## Information Architecture

```txt
/admin
├─ /login
└─ /dashboard
   ├─ Overview (KPI, publish status, quick actions)
   ├─ Site Settings (slug, template, theme, domains)
   ├─ Content
   │  ├─ Profile
   │  ├─ Projects (+ new/edit)
   │  ├─ Experiences
   │  ├─ Education
   │  ├─ Skills
   │  ├─ Sections
   │  └─ Guestbook
   ├─ Design
   │  ├─ Template gallery
   │  ├─ Section order
   │  └─ Theme / fonts
   ├─ SEO
   ├─ Analytics
   └─ Account (plan, billing post-MVP)
```

## Primary Navigation

- **Sidebar** (desktop): grouped Content / Design / Insights / Settings
- **Mobile**: bottom nav or drawer — reuse `AdminMobileNav`

## Key UX Flows

### First-time onboarding

```txt
Sign up → Welcome → Pick template → Auto-create site
→ Checklist (profile, 1 project, publish) → CMS dashboard
```

### Daily edit

```txt
Dashboard → Projects → Edit → Save (draft)
→ Preview → Publish → Toast success + live URL link
```

### Template change

```txt
Design → Gallery → Preview modal → Apply
→ Confirm section changes → Review content → Publish
```

## Dashboard Overview Widgets

- Publish status badge (draft / live)
- Public URL + copy button
- Last published timestamp
- Page views (7d)
- Checklist progress (MVP onboarding)
- Shortcuts: Add project, Edit SEO, Publish

## Empty States

- No projects → CTA "Add first project"
- Unpublished → CTA "Publish your site"
- Free plan → subtle upgrade hint (post-MVP)

## Existing Assets to Reuse

- `AdminShell`, `AdminSidebar`, `AdminPageHeader`
- `AdminFormCard`, `AdminListCard`
- Toast provider, status banners

## Related

- [17-wireframe-screen-list.md](./17-wireframe-screen-list.md)
- [16-user-flows.md](./16-user-flows.md)
