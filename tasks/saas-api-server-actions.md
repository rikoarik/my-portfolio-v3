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

---

## Detail v0.3 — Server Action Contract

### Standard Result

```ts
type ActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; code: string; fieldErrors?: Record<string, string[]> };
```

### Standard Guard

```txt
1. require user
2. validate payload
3. resolve site
4. check membership
5. check role
6. execute mutation
7. return typed result
```

### Required Error Codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `PLAN_LIMIT`
- `PUBLISH_FAILED`
- `RATE_LIMITED`

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
