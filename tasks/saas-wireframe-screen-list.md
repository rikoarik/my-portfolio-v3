# 17. Wireframe / Screen List

> Screen inventory — low-fi reference for design/dev alignment.

## Marketing (platform.com)

| ID | Screen | Route |
|----|--------|-------|
| M1 | Landing hero + CTA | `/` |
| M2 | Pricing (post-MVP) | `/pricing` |
| M3 | Login | `/admin/login` |
| M4 | Sign up | `/signup` |

## Onboarding

| ID | Screen | Notes |
|----|--------|-------|
| O1 | Welcome | Post-auth |
| O2 | Template gallery grid | Thumbnail + name |
| O3 | Template preview modal | Desktop/mobile toggle |
| O4 | Setup checklist | Profile, project, publish |

## Admin Dashboard

| ID | Screen | Route |
|----|--------|-------|
| A1 | Overview | `/admin/dashboard` |
| A2 | Profile editor | `/admin/dashboard/profile` |
| A3 | Projects list | `/admin/dashboard/projects` |
| A4 | Project new/edit | `.../projects/new`, `.../[id]` |
| A5 | Experiences list + edit | `/admin/dashboard/experiences` |
| A6 | Education | `/admin/dashboard/education` |
| A7 | Skills | `/admin/dashboard/skills` |
| A8 | Sections | `/admin/dashboard/sections` |
| A9 | Guestbook moderation | `/admin/dashboard/guestbook` |
| A10 | SEO settings | `/admin/dashboard/seo` |
| A11 | Media library | `/admin/dashboard/media` |
| A12 | Template gallery | `/admin/dashboard/design/templates` |
| A13 | Section order | `/admin/dashboard/design/sections` |
| A14 | Theme picker | `/admin/dashboard/design/theme` |
| A15 | Site settings | `/admin/dashboard/settings` |
| A16 | Domains | `/admin/dashboard/settings/domains` |
| A17 | Analytics | `/admin/dashboard/analytics` |
| A18 | Plan & billing | `/admin/dashboard/billing` |
| A19 | Preview draft | `/admin/preview` or modal |

## Public (tenant subdomain)

| ID | Screen | Route |
|----|--------|-------|
| P1 | One-page portfolio | `/` |
| P2 | Project detail modal | in-page |
| P3 | 404 site not found | `/404-site` |
| P4 | Site suspended | `/suspended` |

## Wireframe Notes

- **A1 Overview**: left sidebar, top bar with site switcher (future), KPI row, publish CTA sticky
- **O2 Gallery**: 3-col grid cards, filter by category
- **P1**: full bleed sections per template; nav pill sticky top (existing IFNav)

## Fidelity

MVP wireframes can live in Figma later — this list is source of truth for routes/screens.

---

## Detail v0.3 — P0 Screens

- Login
- Register
- Onboarding site setup
- Template picker
- Profile form
- Project CRUD
- Dashboard overview
- Preview draft
- Publish success
- Public portfolio
- 404
- Not published
- Suspended

P1 screens:

- Analytics
- SEO
- Sections manager
- Theme picker
- Guestbook moderation

---

## Appendix v0.3 — Detail Implementasi Tambahan

### Tujuan Operasional

Dokumen ini tidak hanya menjadi catatan konsep, tapi juga menjadi pegangan saat implementasi. Setiap keputusan di dalam dokumen harus bisa diturunkan menjadi task engineering, skenario QA, dan acceptance criteria.

### Prinsip Umum

- Gunakan pendekatan incremental, bukan rewrite total.
- Semua fitur yang menyentuh data user wajib scoped by `site_id`.
- Semua akses admin wajib melewati auth dan ownership guard.
- Public site hanya membaca data published, bukan draft.
- Jika ada konflik antara kecepatan rilis dan keamanan tenant, keamanan tenant harus diprioritaskan.
- Setiap perubahan besar harus bisa dirollback.

### Checklist Review

- [ ] Scope dokumen sudah jelas.
- [ ] Out of scope sudah ditulis agar tidak melebar.
- [ ] Dependency dengan dokumen lain sudah jelas.
- [ ] Ada acceptance criteria.
- [ ] Ada risiko dan mitigasi.
- [ ] Ada checklist QA atau validasi.
- [ ] Naming konsisten: `platform.com`, `site_id`, `organization_id`, `site_publish_snapshots`.
- [ ] Tidak ada keputusan yang bertentangan dengan PRD.

### Definition of Done

Dokumen dianggap siap dipakai jika engineer bisa membaca dokumen ini dan tahu:

1. Apa yang harus dibuat.
2. File/area mana yang kemungkinan berubah.
3. Data apa yang dibutuhkan.
4. Risiko apa yang harus dijaga.
5. Bagaimana cara mengetes hasilnya.
