# 13. CMS Feature Specification

## Scope

Shared admin at `/admin/dashboard` — existing CMS extended for multi-site.

## Feature List

### Site Management

| Feature | MVP | Notes |
|---------|-----|-------|
| Create site | Yes | On signup |
| Switch active site | P1 | Multi-site plans |
| Site settings (name, slug) | Yes | Slug lock after publish |
| Delete/archive site | P2 | Soft delete |

### Content Modules (existing + scoped)

| Module | CRUD | Publish impact |
|--------|------|----------------|
| Profile | Yes | Snapshot |
| Projects | Yes | Snapshot |
| Experiences | Yes | Snapshot |
| Education | Yes | Snapshot |
| Skills | Yes | Snapshot |
| Sections (CMS) | Yes | Snapshot |
| Guestbook | Yes + moderate | Snapshot (approved) |
| SEO | Yes | Snapshot |
| Media | Yes | URLs in content |

### Template & Layout

| Feature | MVP |
|---------|-----|
| Template gallery + preview | Yes |
| Apply template | Yes |
| Section reorder (drag) | Yes |
| Section enable/disable | Yes |
| Theme preset picker | P1 |
| Font picker | P1 |

### Publish

| Feature | MVP |
|---------|-----|
| Save draft (auto) | Yes |
| Preview draft | P1 |
| Publish button | Yes |
| Publish history | P2 |
| Rollback | P2 |

### Settings

| Feature | MVP |
|---------|-----|
| Subdomain display | Yes |
| Custom domain | Post-MVP |
| Analytics dashboard | P1 |
| Plan/usage | P1 stub |

## Permissions Matrix

| Role | View | Edit content | Publish | Billing |
|------|------|--------------|---------|---------|
| owner | Yes | Yes | Yes | Yes |
| admin | Yes | Yes | Yes | No |
| editor | Yes | Yes | Yes | No |
| viewer | Yes | No | No | No |

## Non-Goals (CMS)

- WYSIWYG full page editor
- Code injection panel
- Plugin marketplace

## Related

- [saas-admin-dashboard-ia.md](./saas-admin-dashboard-ia.md)
- [saas-api-server-actions.md](./saas-api-server-actions.md)

---

## Detail v0.3 — CMS Minimum Fields

### Profile

- display name
- headline
- bio
- avatar
- location
- email
- social links

### Project

- title
- summary
- image
- live URL
- repo URL
- tags
- role
- year
- featured flag

### Experience

- company
- role
- start date
- end date
- highlights
- tech stack

### Draft Rule

Save draft tidak sama dengan publish.

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
