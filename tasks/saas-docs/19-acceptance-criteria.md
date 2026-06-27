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

- [ ] `{slug}.app.com` resolves correct site
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

- [ ] Stripe checkout works
- [ ] Plan limits enforced
- [ ] Custom domain verified + SSL
- [ ] Watermark removed on paid plan

## Sign-off

| Role | Name | Date |
|------|------|------|
| Product | | |
| Engineering | | |
| QA | | |
