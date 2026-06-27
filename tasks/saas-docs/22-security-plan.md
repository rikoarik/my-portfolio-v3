# 22. Security Plan

## Threat Model (STRIDE-lite)

| Threat | Mitigation |
|--------|------------|
| Cross-tenant data leak | RLS + server-side `siteId` validation |
| Privilege escalation | Org membership checks on every action |
| XSS via CMS content | Sanitize HTML; CSP headers |
| CSRF on mutations | Next.js Server Actions + SameSite cookies |
| Guestbook spam/abuse | Rate limit, honeypot, optional moderation |
| Service role exposure | Server-only; never in client bundle |
| Subdomain takeover | Slug reservation; org ownership on delete |
| Snapshot tampering | Write via publish action only; version audit |

## Authentication

- Supabase Auth (email/password MVP)
- Session via `@supabase/ssr` cookies
- Admin routes protected in middleware + layout
- MFA: post-MVP

## Authorization Layers

```
1. Middleware — session exists?
2. Layout — user belongs to org?
3. Server Action — siteId in user's sites?
4. Supabase RLS — row-level site_id match
```

## RLS Summary

See [06-supabase-rls-policies.md](./06-supabase-rls-policies.md).

- **Public read:** snapshots + published guestbook via RPC
- **Authenticated write:** `site_id IN user_site_ids()`
- **Service role:** migrations, webhooks, cron only

## Input Validation

- Zod schemas in `src/lib/admin/validation.ts`
- Max lengths on text fields
- URL validation for links
- File upload: MIME whitelist, size cap, Supabase Storage policies

## Headers (Vercel / Next.js)

```
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Secrets Management

| Secret | Storage |
|--------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (server only) |
| `STRIPE_SECRET_KEY` | Vercel env |
| `STRIPE_WEBHOOK_SECRET` | Vercel env |

Never commit `.env.local`. Rotate on team member offboarding.

## Dependency Security

- `npm audit` in CI
- Dependabot enabled
- Pin major Supabase/Next versions

## Incident Response

1. Identify scope (which tenants affected)
2. Disable affected feature flag / route
3. Rotate compromised secrets
4. Notify affected users within 72h (GDPR if EU users)
5. Post-mortem in [30-changelog-decision-log.md](./30-changelog-decision-log.md)

## Compliance (MVP)

- Privacy policy + ToS on marketing site
- Cookie consent if analytics cookies used (EU)
- Data export/delete: manual request → post-MVP self-serve

## Security Checklist (Pre-Launch)

- [ ] RLS enabled all tenant tables
- [ ] Cross-tenant tests pass
- [ ] No service role in client
- [ ] Rate limits on guestbook + auth
- [ ] Preview routes `noindex`
- [ ] HTTPS enforced
- [ ] Stripe webhook signature verified
