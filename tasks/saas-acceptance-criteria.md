# 19. Acceptance Criteria Checklist

## MVP Release Gate

### Renderer

- [ ] `SiteRenderer` replaces hardcoded section list
- [ ] Section order driven by config/DB
- [ ] 2–3 templates selectable and render correctly
- [ ] Unknown section type fails gracefully
- [ ] Existing portfolio visual parity (no broken layouts)

### Multi-Tenant

- [ ] `organizations`, `sites`, `site_id` migrated
- [ ] All content queries filter by `site_id`
- [ ] Two test users fully isolated
- [ ] RLS enabled on all tenant tables
- [ ] No cross-tenant read/write in automated tests

### Publish

- [ ] Draft edits do not affect live site
- [ ] Publish creates versioned snapshot
- [ ] Public reads latest snapshot only
- [ ] `revalidateTag` updates live site within 60s

### Routing

- [ ] `{slug}.platform.com` resolves correct site
- [ ] Invalid subdomain → 404
- [ ] Suspended site → blocked

### CMS

- [ ] Full CRUD for profile, projects, experiences, education, skills
- [ ] Template apply + section reorder works
- [ ] SEO fields persist and appear in HTML head

### Analytics

- [ ] Page views recorded with `site_id`
- [ ] Dashboard shows 7d summary
- [ ] No raw IP stored long-term

### Security

- [ ] Service role not exposed client-side
- [ ] Guestbook rate limited
- [ ] Preview `noindex`
- [ ] Input sanitized (XSS)

### Non-Functional

- [ ] LCP p75 < 2.5s (staging sample)
- [ ] Publish < 5s typical site
- [ ] Zero P0 bugs open

### Documentation

- [ ] Runbook for deploy
- [ ] Migration rollback documented

## Phase 2 Gate (Billing)

- [ ] Payment checkout works
- [ ] Plan limits enforced
- [ ] Custom domain verified + SSL
- [ ] Watermark removed on paid plan

## Sign-off

| Role | Name | Date |
|------|------|------|
| Product | | |
| Engineering | | |
| QA | | |

---

## Detail v0.3 — Final Acceptance Gate

MVP accepted only when:

```txt
P0 auth pass
P0 renderer pass
P0 multi-tenant pass
P0 RLS pass
P0 publish pass
P0 routing pass
P0 CMS pass
P0 security pass
```

No exception for tenant security.

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
