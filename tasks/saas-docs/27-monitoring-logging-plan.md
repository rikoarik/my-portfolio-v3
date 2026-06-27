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
| Stripe | Stripe Dashboard + webhook logs |

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
3. **Billing:** MRR, failed payments (Stripe)

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
