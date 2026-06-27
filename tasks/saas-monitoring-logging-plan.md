# 27. Monitoring & Logging Plan

## Objectives

- Detect outages before users report
- Trace publish failures and webhook errors
- Monitor Supabase health and RLS denials
- No PII in logs

## Tooling

| Concern | Tool |
|---------|------|
| APM / errors | Sentry |
| Uptime | Better Uptime or Vercel Analytics |
| Logs | Vercel Log Drain → Axiom/Datadog (optional) |
| DB metrics | Supabase Dashboard |
| Stripe | Payment provider dashboard + webhook logs |

## Sentry Setup

- `@sentry/nextjs` in app + edge
- Source maps uploaded on deploy
- Tags: `site_id`, `org_id`, `route` (no emails)

### Alert Rules

| Condition | Severity |
|-----------|----------|
| Error rate > 1% / 5min | P1 |
| Publish action failure spike | P1 |
| Middleware resolve failure > 10/min | P2 |
| New error type | P3 |

## Structured Logging

```typescript
logger.info('publish.completed', {
  siteId,
  version: snapshotVersion,
  durationMs,
});
```

**Never log:** passwords, tokens, full request bodies with PII.

## Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | App alive |
| Supabase `select 1` | DB connectivity |

Uptime ping every 1 min from 2 regions.

## Supabase Monitoring

- Connection pool usage
- Slow queries (> 500ms)
- RLS policy failures (log in app when Supabase returns 42501)
- Storage bandwidth

## Dashboards

1. **Ops:** error rate, p95 latency, deploy markers
2. **Product:** daily signups, publishes, active sites
3. **Billing:** MRR, failed payments (provider)

## On-Call (Solo MVP)

- Email/SMS alert for P1
- Response SLA: best effort 4h awake hours
- Runbook link in alert message

## Retention

| Data | Retention |
|------|-----------|
| Sentry events | 30 days |
| Vercel logs | 7 days (free) / 30 paid |
| Analytics events | 13 months |

## Acceptance

- [ ] Sentry captures staging error test
- [ ] Uptime alert fires on deliberate downtime test
- [ ] Publish logs include version + duration

---

## Detail v0.3 — Minimum Logs

- publish started
- publish success
- publish failed
- forbidden access
- domain not found
- domain resolved
- template apply failed
- analytics insert failed

Never log secrets.

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
