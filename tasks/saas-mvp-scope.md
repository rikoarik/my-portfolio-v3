# 2. MVP Scope Document

> Scope boundary launch MVP · v0.2

## Definition of MVP

User dapat **sign up → pilih template → isi CMS → publish subdomain** dengan data terisolasi antar tenant dan public site render dari **published snapshot**.

## Must Have (P0)

| Area | Item |
|------|------|
| Renderer | `SiteRenderer`, `SectionRenderer`, `sectionRegistry`, `templateRegistry` |
| Templates | 2–3 base template + apply dari admin |
| Tenancy | `organizations`, `sites`, `site_id` on content tables |
| Security | RLS policies + server action ownership checks |
| Routing | Subdomain resolve via middleware |
| Publish | `site_publish_snapshots`, publish action, public reads snapshot |
| CMS | CRUD existing entities scoped by site |
| Admin | Choose template, reorder sections |
| SEO | Per-site title, description, OG, robots |
| Analytics | Basic page views per site |

## Should Have (P1)

- Theme / font / density pickers
- Draft preview (auth-only)
- Guestbook moderation
- Free tier watermark + plan limit stub
- Sitemap per subdomain
- OG image per site

## Nice to Have (P2, post-MVP launch)

- Custom domain + SSL
- Stripe billing
- Static export
- Advanced analytics
- Team members
- Template marketplace

## Explicitly Out of Scope

- User-uploaded React templates
- Arbitrary HTML embed
- Enterprise schema-per-tenant
- Visual page builder
- Animation editor
- E-commerce checkout
- Multi-page blog CMS

## Success = MVP Done When

See [saas-acceptance-criteria.md](./saas-acceptance-criteria.md)

---

## Detail v0.3 — Batas MVP

### MVP Harus Membuktikan

1. User bisa publish sendiri.
2. Public site bisa dibuka via subdomain.
3. Draft dan published terpisah.
4. Tenant isolation aman.
5. Template bisa diganti tanpa menghapus konten.

### MVP Tidak Perlu Membuktikan

- Bisa menyaingi Webflow.
- Bisa punya ribuan handcrafted template.
- Bisa support custom domain langsung.
- Bisa ada marketplace.
- Bisa full visual editor.

### Minimal Demo MVP

Demo yang harus bisa dilakukan:

```txt
Create account
→ pilih Minimal Developer
→ isi profile
→ tambah 1 project
→ preview
→ publish
→ buka arik.platform.com
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
