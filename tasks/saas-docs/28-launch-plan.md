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

- [ ] All [19-acceptance-criteria.md](./19-acceptance-criteria.md) MVP items checked
- [ ] 3+ beta users published live sites
- [ ] No open P0 bugs
- [ ] Support channel ready (Discord or email)

## Launch Day Checklist

### T-24h

- [ ] Prod deploy from release tag
- [ ] DB migrations applied
- [ ] DNS wildcard verified
- [ ] Stripe live mode configured (if billing day-1)
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

Action: Vercel rollback + disable signups + post incident notice.

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
