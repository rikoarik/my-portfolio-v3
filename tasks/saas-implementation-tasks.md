# 20. Implementation Task Breakdown

> Epic → tasks. Track in GitHub Issues / project board.

## Epic 1 — Renderer Refactor (Phase 1)

- [ ] `SiteRenderer.tsx` + `SectionRenderer.tsx`
- [ ] `sectionRegistry.ts` — register IF sections
- [ ] `templateRegistry.ts` — 3 manifests
- [ ] Static config parity with current `PortfolioClient`
- [ ] `TemplateProvider` + theme binding
- [ ] Feature flag rollback path
- [ ] Visual regression baseline

## Epic 2 — Site & Tenant Model (Phase 2)

- [ ] SQL migration: org, sites, domains, sections, snapshots
- [ ] Add `site_id` columns + backfill script
- [ ] Update `src/lib/portfolio.ts` queries
- [ ] Update `src/types/portfolio.ts`
- [ ] Admin: active site context
- [ ] Onboarding create site action

## Epic 3 — RLS Security (Phase 3)

- [ ] `user_site_ids()` helper
- [ ] Policies per table
- [ ] `get_published_site` RPC
- [ ] Cross-tenant integration tests
- [ ] Audit all server actions for `siteId` validation

## Epic 4 — Publish Flow (Phase 4)

- [ ] `buildPublishPayload(siteId)`
- [ ] `publishSiteAction`
- [ ] Snapshot version increment
- [ ] Cache revalidation
- [ ] Preview route (draft render)
- [ ] Rollback action (P2)

## Epic 5 — Routing (Phase 4)

- [ ] `src/middleware.ts` tenant resolver
- [ ] `resolveSiteByDomain` lib
- [ ] `site_domains` CRUD in admin
- [ ] 404 / suspended pages
- [ ] Env config `APP_DOMAIN`

## Epic 6 — Template & Design UI (Phase 5)

- [ ] Template gallery page
- [ ] Preview modal component
- [ ] `applyTemplateAction`
- [ ] Section reorder drag UI
- [ ] Theme/font picker (P1)

## Epic 7 — SEO & Analytics (Phase 5–6)

- [ ] Per-site metadata in snapshot
- [ ] Dynamic `generateMetadata` from snapshot
- [ ] Sitemap route per tenant (P1)
- [ ] Extend `/api/track` with site_id
- [ ] Analytics dashboard widgets

## Epic 8 — Billing (Phase 7)

- [ ] Payment provider products/prices
- [ ] Checkout + webhook
- [ ] `subscriptions` table sync
- [ ] Plan limit middleware
- [ ] Custom domain flow

## Estimate Summary

| Epic | Days (est.) |
|------|-------------|
| 1 Renderer | 7–10 |
| 2 Site model | 7–10 |
| 3 RLS | 7–10 |
| 4 Publish | 5–7 |
| 5 Routing | 5–7 |
| 6 Template UI | 10–14 |
| 7 SEO/Analytics | 3–5 |
| 8 Billing | 10–15 |

**Total MVP (Epic 1–7):** ~40–55 dev-days

## Related

- [saas-roadmap.md](./saas-roadmap.md)
- [saas-migration-plan.md](./saas-migration-plan.md)

---

## Detail v0.3 — Recommended Sprint Order

### Sprint 1

- SiteRenderer
- SectionRenderer
- Registries
- Existing section wrapper

### Sprint 2

- DB migrations
- `site_id`
- data layer scoped query

### Sprint 3

- RLS
- ownership guard
- cross-tenant tests

### Sprint 4

- publish snapshot
- subdomain resolver
- preview

### Sprint 5

- template gallery
- theme picker
- QA polish

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
