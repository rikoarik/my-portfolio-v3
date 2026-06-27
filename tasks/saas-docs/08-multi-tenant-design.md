# 8. Multi-Tenant Design Document

## Tenant Model

```txt
User (auth.users)
  └── Organization (billing + team boundary)
        └── Site (portfolio instance)
              └── Content (projects, sections, …)
```

- **Organization** = account / billing unit.
- **Site** = one published portfolio (MVP: 1 site per free user).
- **Slug** unique per org; **subdomain** = `{slug}.{APP_DOMAIN}`.

## Isolation Layers

| Layer | Mechanism |
|-------|-----------|
| Database | `site_id` FK + RLS |
| Application | Server action ownership check |
| Cache | Keys prefixed `site:{id}:` |
| Routing | Hostname → single `site_id` |
| Storage | Path prefix `sites/{site_id}/` |

## Tenant Resolution

```ts
// middleware.ts
const hostname = request.headers.get('host');
const site = await resolveSiteByDomain(hostname);
// Attach x-site-id header for downstream OR redirect to 404
```

Resolution order:

1. Exact match `site_domains.domain` where `status = verified`
2. Subdomain extract `{slug}.app.com` → lookup `sites.slug`
3. Apex `app.com` → marketing app (no tenant)

## Data Scoping Rules

- **Every** content query MUST filter `site_id`.
- No global `select * from projects` in app code.
- Admin session stores **activeSiteId** (cookie/context).
- Switch site UI (post-MVP multi-site plans).

## Onboarding Flow

1. Sign up → create `organization` + default `site`
2. Pick template → set `sites.template_id`
3. Seed default `site_sections` from template manifest
4. Create `site_domains` row: `{slug}.app.com`
5. Redirect to CMS dashboard

## Existing Data Migration

- Current single portfolio → `organizations` row + `sites` row + backfill all `site_id`.

## Anti-Patterns (forbidden)

- Service role on public page without domain validation
- Passing `site_id` from client without server verification
- Shared cache entry across tenants without site key
- Storing tenant secrets in client bundle

## Related

- [05-database-design-erd.md](./05-database-design-erd.md)
- [06-supabase-rls-policies.md](./06-supabase-rls-policies.md)
- [12-routing-domain.md](./12-routing-domain.md)
