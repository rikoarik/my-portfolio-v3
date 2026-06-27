# SaaS Portfolio Platform — Docs Index

Dokumen sudah disesuaikan dengan format nama file `saas-*.md`.

## Master Docs

- `saas-rnd.md`
- `saas-prd.md`
- `saas-roadmap.md`

## Product & Planning

- `saas-mvp-scope.md`
- `saas-implementation-tasks.md`
- `saas-acceptance-criteria.md`
- `saas-launch-plan.md`
- `saas-gtm-mini-plan.md`
- `saas-changelog-decision-log.md`

## Engineering

- `saas-technical-design.md`
- `saas-system-architecture.md`
- `saas-database-design-erd.md`
- `saas-supabase-rls-policies.md`
- `saas-api-server-actions.md`
- `saas-multi-tenant-design.md`
- `saas-migration-plan.md`
- `saas-security-plan.md`
- `saas-deployment-plan.md`
- `saas-monitoring-logging-plan.md`

## Product Features

- `saas-template-system.md`
- `saas-renderer-refactor-plan.md`
- `saas-publish-snapshot.md`
- `saas-routing-domain.md`
- `saas-cms-features.md`
- `saas-admin-dashboard-ia.md`
- `saas-design-system.md`
- `saas-user-flows.md`
- `saas-wireframe-screen-list.md`
- `saas-seo-specification.md`
- `saas-analytics-specification.md`
- `saas-billing-plan-specification.md`
- `saas-qa-test-plan.md`

## Notes

- `saas-analisis-perbaikan.md`

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
