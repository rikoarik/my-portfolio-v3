# 28. Launch Plan

## Launch Type

**Soft launch** → limited beta → public GA

## Timeline (Example)

| Week | Milestone |
|------|-----------|
| W-4 | Feature freeze MVP |
| W-3 | Staging QA complete |
| W-2 | Beta invite 10–20 users |
| W-1 | Fix beta feedback P0/P1 |
| W0 | Public launch |
| W+1 | Retrospective + hotfix window |

## Beta Criteria

- [ ] All [saas-acceptance-criteria.md](./saas-acceptance-criteria.md) MVP items checked
- [ ] 3+ beta users published live sites
- [ ] No open P0 bugs
- [ ] Support channel ready (Discord or email)

## Launch Day Checklist

### T-24h

- [ ] Prod deploy from release tag
- [ ] DB migrations applied
- [ ] DNS wildcard verified
- [ ] Payment provider live mode configured (if billing day-1)
- [ ] Backup snapshot of prod DB

### T-0

- [ ] Smoke tests pass
- [ ] Marketing page live with signup CTA
- [ ] Status page ready (optional)
- [ ] Monitor Sentry dashboard

### T+24h

- [ ] Review error logs
- [ ] Respond beta feedback
- [ ] Track signup → publish conversion

## Rollback Trigger

- Cross-tenant data exposure
- > 5% publish failure rate
- Auth completely broken

Action: deployment rollback + disable signups + post incident notice.

## Communication

| Audience | Channel | Message |
|----------|---------|---------|
| Beta users | Email | Thank you + what's new |
| Public | Twitter/LinkedIn | Launch announcement |
| Docs | README / help center | Getting started guide |

## Success Metrics (Week 1)

| Metric | Target |
|--------|--------|
| Signups | 50+ |
| Published sites | 30+ |
| Publish success rate | > 99% |
| Uptime | > 99.5% |
| Critical bugs | 0 |

## Post-Launch

- Week 1 daily error review
- Week 2 prioritize Phase 2 (billing/custom domain)
- Collect NPS from beta (optional survey)

---

## Detail v0.3 — Launch Gate

Private beta only if:

- 5 internal test publishes success.
- 2 test users isolated.
- Public render stable.
- No draft leak.
- No critical console/server errors.
- Backup exists.
- Feedback form ready.

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
