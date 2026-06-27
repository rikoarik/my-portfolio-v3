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

See [saas-supabase-rls-policies.md](./saas-supabase-rls-policies.md).

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
| `PAYMENT_SECRET_KEY` | Vercel env |
| `PAYMENT_WEBHOOK_SECRET` | Vercel env |

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
5. Post-mortem in [saas-changelog-decision-log.md](./saas-changelog-decision-log.md)

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
- [ ] Payment webhook signature verified

---

## Detail v0.3 — Security Release Blockers

Release blocked if:

- RLS not enabled.
- Cross-tenant test not written.
- Cross-tenant test failing.
- Public reads draft.
- Service role exposed.
- Arbitrary HTML/JS allowed.
- Guestbook not rate-limited.

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
