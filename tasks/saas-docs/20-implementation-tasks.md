# 20. Implementation Task Breakdown

> Epic → tasks. Track in GitHub Issues / project board.

## Epic 1 — Renderer Refactor (Phase 1)

- [ ] `SiteRenderer.tsx` + `SectionRenderer.tsx`
- [ ] `sectionRegistry.ts` — register IF sections
- [ ] `templateRegistry.ts` — 3 manifests
- [ ] Static config parity with current `PortfolioClient`
- [ ] `TemplateProvider` + theme binding
- [ ] Feature flag rollback path
- [ ] Visual regression baseline

## Epic 2 — Site & Tenant Model (Phase 2)

- [ ] SQL migration: org, sites, domains, sections, snapshots
- [ ] Add `site_id` columns + backfill script
- [ ] Update `src/lib/portfolio.ts` queries
- [ ] Update `src/types/portfolio.ts`
- [ ] Admin: active site context
- [ ] Onboarding create site action

## Epic 3 — RLS Security (Phase 3)

- [ ] `user_site_ids()` helper
- [ ] Policies per table
- [ ] `get_published_site` RPC
- [ ] Cross-tenant integration tests
- [ ] Audit all server actions for `siteId` validation

## Epic 4 — Publish Flow (Phase 4)

- [ ] `buildPublishPayload(siteId)`
- [ ] `publishSiteAction`
- [ ] Snapshot version increment
- [ ] Cache revalidation
- [ ] Preview route (draft render)
- [ ] Rollback action (P2)

## Epic 5 — Routing (Phase 4)

- [ ] `src/middleware.ts` tenant resolver
- [ ] `resolveSiteByDomain` lib
- [ ] `site_domains` CRUD in admin
- [ ] 404 / suspended pages
- [ ] Env config `APP_DOMAIN`

## Epic 6 — Template & Design UI (Phase 5)

- [ ] Template gallery page
- [ ] Preview modal component
- [ ] `applyTemplateAction`
- [ ] Section reorder drag UI
- [ ] Theme/font picker (P1)

## Epic 7 — SEO & Analytics (Phase 5–6)

- [ ] Per-site metadata in snapshot
- [ ] Dynamic `generateMetadata` from snapshot
- [ ] Sitemap route per tenant (P1)
- [ ] Extend `/api/track` with site_id
- [ ] Analytics dashboard widgets

## Epic 8 — Billing (Phase 7)

- [ ] Stripe products/prices
- [ ] Checkout + webhook
- [ ] `subscriptions` table sync
- [ ] Plan limit middleware
- [ ] Custom domain flow

## Estimate Summary

| Epic | Days (est.) |
|------|-------------|
| 1 Renderer | 7–10 |
| 2 Site model | 7–10 |
| 3 RLS | 7–10 |
| 4 Publish | 5–7 |
| 5 Routing | 5–7 |
| 6 Template UI | 10–14 |
| 7 SEO/Analytics | 3–5 |
| 8 Billing | 10–15 |

**Total MVP (Epic 1–7):** ~40–55 dev-days

## Related

- [01-roadmap.md](./01-roadmap.md)
- [21-migration-plan.md](./21-migration-plan.md)
