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
- **Staging**: Separate Supabase project, `staging.app.com`
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

- [19-acceptance-criteria.md](./19-acceptance-criteria.md)
- Existing: `src/lib/admin/actions.integration.test.ts`, `admin-ui.test.tsx`
