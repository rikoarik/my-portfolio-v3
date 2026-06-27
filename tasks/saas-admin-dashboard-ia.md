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

- [saas-wireframe-screen-list.md](./saas-wireframe-screen-list.md)
- [saas-user-flows.md](./saas-user-flows.md)

---

## Detail v0.3 — Dashboard Status Model

Dashboard harus selalu menunjukkan:

- Current site status.
- Public URL.
- Last published time.
- Unpublished changes.
- Preview button.
- Publish button.

### Publish Banner

Jika ada draft change:

```txt
You have unpublished changes.
```

Jika sudah live:

```txt
Published at 2026-06-27 10:00
```

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
