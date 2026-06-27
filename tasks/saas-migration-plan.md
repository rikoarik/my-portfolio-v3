# 21. Migration Plan

## Principles

- **Incremental** — no big-bang rewrite
- **Backward compatible** — existing single-tenant portfolio works until cutover
- **Reversible** — each phase has rollback steps
- **Data first** — schema before app logic

## Phase 0 — Baseline

| Step | Action |
|------|--------|
| 0.1 | Tag release `pre-saas-baseline` |
| 0.2 | Export current Supabase schema + seed |
| 0.3 | Document current env vars |

## Phase 1 — Schema Additive

```sql
-- New tables only — no breaking changes
CREATE TABLE organizations (...);
CREATE TABLE sites (...);
CREATE TABLE site_domains (...);
CREATE TABLE site_sections (...);
CREATE TABLE site_publish_snapshots (...);
```

| Step | Action |
|------|--------|
| 1.1 | Apply migration via Supabase CLI |
| 1.2 | Create default org + site for existing data |
| 1.3 | Add nullable `site_id` to content tables |

**Rollback:** Drop new tables; ignore nullable columns.

## Phase 2 — Backfill

| Step | Action |
|------|--------|
| 2.1 | Script: assign all rows to default `site_id` |
| 2.2 | Set `site_id NOT NULL` |
| 2.3 | Add FK constraints |
| 2.4 | Verify row counts match |

**Rollback:** Restore DB snapshot from Phase 0.

## Phase 3 — RLS Enable

| Step | Action |
|------|--------|
| 3.1 | Deploy `user_site_ids()` function |
| 3.2 | Enable RLS table-by-table (dev first) |
| 3.3 | Run cross-tenant test suite |
| 3.4 | Enable in staging → prod |

**Rollback:** Disable RLS per table; revert to service-role-only admin (temporary).

## Phase 4 — Renderer Cutover

| Step | Action |
|------|--------|
| 4.1 | Ship `SiteRenderer` behind feature flag |
| 4.2 | A/B: static config vs DB sections |
| 4.3 | Remove flag when parity confirmed |

**Rollback:** Flag off → `PortfolioClient` hardcoded path.

## Phase 5 — Publish Model

| Step | Action |
|------|--------|
| 5.1 | Build initial snapshot from live data |
| 5.2 | Switch public reads to snapshot RPC |
| 5.3 | Admin writes stay draft until publish |

**Rollback:** Public reads direct tables again (document inconsistency window).

## Phase 6 — Multi-Tenant Routing

| Step | Action |
|------|--------|
| 6.1 | DNS wildcard `*.platform.com` → Vercel |
| 6.2 | Deploy middleware |
| 6.3 | Migrate personal site to subdomain |

**Rollback:** Keep apex domain serving default site.

## Data Migration Script Outline

```typescript
// scripts/migrate-to-multi-tenant.ts
// 1. Create org for owner
// 2. Create site with slug from env
// 3. UPDATE all content SET site_id = $siteId
// 4. INSERT site_sections from current section order
// 5. INSERT site_publish_snapshots v1 from buildPublishPayload
```

## Downtime

- **Target:** zero downtime for MVP migrations
- **Exception:** RLS enable may need brief read-only window if issues found (avoid if possible)

## Related

- [saas-database-design-erd.md](./saas-database-design-erd.md)
- [saas-supabase-rls-policies.md](./saas-supabase-rls-policies.md)

---

## Detail v0.3 — Migration Guardrails

Do:

- backup first
- additive migration
- nullable first
- backfill
- validate
- enforce
- RLS last

Do not:

- enable RLS before app queries fixed
- delete old data before validation
- run untested migration in production
- assume current user is owner without mapping

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
