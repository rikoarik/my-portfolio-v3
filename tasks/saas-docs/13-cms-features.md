# 13. CMS Feature Specification

## Scope

Shared admin at `/admin/dashboard` — existing CMS extended for multi-site.

## Feature List

### Site Management

| Feature | MVP | Notes |
|---------|-----|-------|
| Create site | Yes | On signup |
| Switch active site | P1 | Multi-site plans |
| Site settings (name, slug) | Yes | Slug lock after publish |
| Delete/archive site | P2 | Soft delete |

### Content Modules (existing + scoped)

| Module | CRUD | Publish impact |
|--------|------|----------------|
| Profile | Yes | Snapshot |
| Projects | Yes | Snapshot |
| Experiences | Yes | Snapshot |
| Education | Yes | Snapshot |
| Skills | Yes | Snapshot |
| Sections (CMS) | Yes | Snapshot |
| Guestbook | Yes + moderate | Snapshot (approved) |
| SEO | Yes | Snapshot |
| Media | Yes | URLs in content |

### Template & Layout

| Feature | MVP |
|---------|-----|
| Template gallery + preview | Yes |
| Apply template | Yes |
| Section reorder (drag) | Yes |
| Section enable/disable | Yes |
| Theme preset picker | P1 |
| Font picker | P1 |

### Publish

| Feature | MVP |
|---------|-----|
| Save draft (auto) | Yes |
| Preview draft | P1 |
| Publish button | Yes |
| Publish history | P2 |
| Rollback | P2 |

### Settings

| Feature | MVP |
|---------|-----|
| Subdomain display | Yes |
| Custom domain | Post-MVP |
| Analytics dashboard | P1 |
| Plan/usage | P1 stub |

## Permissions Matrix

| Role | View | Edit content | Publish | Billing |
|------|------|--------------|---------|---------|
| owner | Yes | Yes | Yes | Yes |
| admin | Yes | Yes | Yes | No |
| editor | Yes | Yes | Yes | No |
| viewer | Yes | No | No | No |

## Non-Goals (CMS)

- WYSIWYG full page editor
- Code injection panel
- Plugin marketplace

## Related

- [14-admin-dashboard-ia.md](./14-admin-dashboard-ia.md)
- [07-api-server-actions.md](./07-api-server-actions.md)
