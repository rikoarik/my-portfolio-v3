# 7. API / Server Action Specification

## Conventions

- **Server Actions** (`'use server'`) for CMS mutations — existing pattern in `src/app/admin/actions.ts`.
- **Route Handlers** for public ingest (analytics, guestbook) with rate limit.
- All mutations: validate session → resolve `site_id` → check org membership → Zod parse → DB.

## Server Actions (CMS)

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `createSite` | `{ name, slug, templateId }` | `{ siteId }` | logged in |
| `updateSiteSettings` | `{ siteId, settings }` | `{ ok }` | editor+ |
| `applyTemplate` | `{ siteId, templateId, config? }` | `{ ok }` | editor+ |
| `reorderSections` | `{ siteId, orderedIds[] }` | `{ ok }` | editor+ |
| `upsertProject` | `{ siteId, project }` | `{ id }` | editor+ |
| `deleteProject` | `{ siteId, projectId }` | `{ ok }` | editor+ |
| `upsertExperience` | … | … | editor+ |
| `updateSeo` | `{ siteId, seo }` | `{ ok }` | editor+ |
| `publishSite` | `{ siteId }` | `{ version, publishedAt }` | editor+ |
| `rollbackSite` | `{ siteId, version }` | `{ ok }` | admin+ |
| `moderateGuestbook` | `{ siteId, messageId, action }` | `{ ok }` | editor+ |

Existing actions (`updateProfile`, etc.) gain required `siteId` param.

## Route Handlers

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `POST` | `/api/track` | Page view ingest | public + rate limit |
| `POST` | `/api/guestbook` | Submit message | public + rate limit |
| `POST` | `/api/publish/revalidate` | Internal webhook (optional) | secret header |
| `GET` | `/api/health` | Health check | public |

### POST `/api/track`

```json
{
  "siteId": "uuid",
  "path": "/",
  "referrer": "https://google.com"
}
```

Response: `204`. Rate: 60/min/IP.

## Error Contract

```json
{
  "error": {
    "code": "FORBIDDEN | VALIDATION | NOT_FOUND | PLAN_LIMIT",
    "message": "Human readable"
  }
}
```

## Ownership Middleware (pseudo)

```ts
async function requireSiteAccess(siteId: string, minRole: Role) {
  const user = await getUser();
  const member = await getMembership(user.id, siteId);
  if (!member || roleRank(member.role) < roleRank(minRole)) {
    throw forbidden();
  }
  return member;
}
```

## Files to Extend

- `src/app/admin/actions.ts` — primary action surface
- `src/lib/admin/validation.ts` — Zod schemas
- `src/app/api/track/route.ts` — add `site_id`
