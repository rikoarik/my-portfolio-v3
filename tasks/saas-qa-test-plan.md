# 18. QA Test Plan

## Test Levels

| Level | Scope | Tool |
|-------|-------|------|
| Unit | Registry, validators, payload builder | Vitest |
| Integration | Server actions + Supabase (local) | Vitest + test DB |
| E2E | Critical user journeys | Playwright (recommended) |
| Security | RLS cross-tenant | SQL + automated scripts |
| Manual | Visual, UX, edge cases | Checklist |

## Test Environments

- **Local**: Supabase local + `npm run dev`
- **Staging**: Separate Supabase project, `staging.platform.com`
- **Prod**: Pre-launch smoke only

## E2E Scenarios (P0)

| ID | Scenario |
|----|----------|
| E1 | Sign up → create site → see dashboard |
| E2 | Add project → publish → visible on subdomain |
| E3 | Edit project draft → not public until publish |
| E4 | Apply template → layout changes after publish |
| E5 | Reorder sections → order reflected public |
| E6 | Unknown subdomain → 404 |
| E7 | User A cannot open User B admin URL with site id |
| E8 | Guestbook submit → appears after moderation + publish |
| E9 | SEO title visible in `<title>` and OG tags |
| E10 | Analytics records page view |

## Integration Tests (P0)

| ID | Scenario |
|----|----------|
| I1 | `publishSiteAction` creates snapshot version+1 |
| I2 | `sectionRegistry` resolves all MVP types |
| I3 | `templateRegistry` validates config schema |
| I4 | Plan limit blocks 2nd site on free tier |
| I5 | RLS: cross-tenant SELECT fails |

## Regression — Renderer

- Screenshot diff portfolio before/after `SiteRenderer` migration
- All landing theme presets render without console errors
- Reduced motion: no GSAP scroll traps

## Browser Matrix

| Browser | Priority |
|---------|----------|
| Chrome desktop | P0 |
| Safari desktop | P0 |
| Chrome mobile | P0 |
| Safari iOS | P1 |
| Firefox | P2 |

## Performance Checks

- Lighthouse LCP < 2.5s on published site (sample)
- Publish action < 5s
- TTI admin dashboard acceptable on 3G throttled (P1)

## Related

- [saas-acceptance-criteria.md](./saas-acceptance-criteria.md)
- Existing: `src/lib/admin/actions.integration.test.ts`, `admin-ui.test.tsx`

---

## Detail v0.3 — Release Blocking Tests

Blocking tests:

- Cross-tenant read blocked.
- Cross-tenant update blocked.
- Draft not visible public.
- Publish failure keeps old live.
- Unknown domain returns 404.
- Service role not exposed.
- Unknown section does not crash.

If any blocking test fails, do not launch beta.

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
