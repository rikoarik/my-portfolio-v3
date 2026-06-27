# 30. Changelog / Decision Log

> Living document — append new entries at top.

## Format

```
### YYYY-MM-DD — Title
**Status:** Accepted | Superseded | Proposed
**Context:** ...
**Decision:** ...
**Consequences:** ...
```

---

### 2026-06-27 — SaaS doc package (30 docs)

**Status:** Accepted  
**Context:** R&D complete in `saas-rnd.md`; need structured doc set for implementation.  
**Decision:** Create `tasks/saas-docs/` with 30 linked documents covering product, tech, ops, GTM.  
**Consequences:** Single source of truth per topic; PRD remains executive summary.

---

### 2026-06-27 — Incremental refactor over rewrite

**Status:** Accepted  
**Context:** Existing portfolio works; full rewrite risky.  
**Decision:** Evolve `PortfolioClient` → `SiteRenderer`; add multi-tenant layer incrementally.  
**Consequences:** Feature flags needed; longer migration but lower risk.

---

### 2026-06-27 — Shared schema multi-tenancy

**Status:** Accepted  
**Context:** Row-level isolation vs schema-per-tenant vs DB-per-tenant.  
**Decision:** Shared Postgres schema + `site_id` column + Supabase RLS.  
**Consequences:** Simpler ops; RLS complexity; must audit all queries.

---

### 2026-06-27 — Published snapshots for public reads

**Status:** Accepted  
**Context:** Draft/live separation requirement.  
**Decision:** Public site reads immutable `site_publish_snapshots`; admin writes draft tables until publish.  
**Consequences:** Publish action builds JSON payload; cache by snapshot version.

---

### 2026-06-27 — Config-driven template registry

**Status:** Accepted  
**Context:** User-uploaded themes = security nightmare.  
**Decision:** Curated template manifests in codebase; user picks + configures sections.  
**Consequences:** New templates require deploy; safe and predictable.

---

### 2026-06-27 — MVP hosting: subdomain on shared Next.js

**Status:** Accepted  
**Context:** Custom domain + SSL adds complexity.  
**Decision:** MVP uses `{slug}.platform.com`; custom domain in Pro phase.  
**Consequences:** Middleware tenant resolution required; wildcard DNS.

---

### 2026-06-27 — Payment provider for billing (Phase 7)

**Status:** Accepted  
**Context:** Need subscriptions for Pro tier.  
**Decision:** Payment provider + webhooks; defer to post-MVP core. Candidate: Stripe, Midtrans, or Xendit.  
**Consequences:** Free tier fully functional without Stripe at beta.

---

### 2026-06-27 — Projects section: Fluid Accordion UI

**Status:** Accepted  
**Context:** Sticky stacking cards had scroll/clipping issues.  
**Decision:** Replace with horizontal/vertical accordion in `IFProjectsSection`.  
**Consequences:** Removed GSAP stacking; simpler scroll behavior.

---

### 2026-06-27 — Global padding via CSS vars

**Status:** Accepted  
**Context:** Inconsistent horizontal gutters across sections.  
**Decision:** `--ifs-section-px` on `#main`; inner `.ifs-content-pad` wrappers; sections except home/footer use wrap pattern.  
**Consequences:** Home/footer unchanged; tighter mobile gutters (0.75rem).

---

## Superseded Decisions

*(none yet)*

---

## Open Questions

| ID | Question | Owner |
|----|----------|-------|
| Q1 | Exact Pro pricing? | Product |
| Q2 | Self-serve data export GDPR? | Legal/Eng |
| Q3 | Open-source renderer partial? | Product |
| Q4 | Blog section in MVP or P2? | Product |

---

## References

- [saas-rnd.md](../saas-rnd.md) — original R&D
- [saas-prd.md](../saas-prd.md) — product requirements
- [saas-roadmap.md](../saas-roadmap.md) — phase timeline

---

## Detail v0.3 — Decision Quality

Setiap keputusan baru harus menjawab:

- Apa yang diputuskan?
- Kenapa?
- Alternatif apa yang ditolak?
- Dampaknya ke roadmap?
- Apakah reversible?

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
