# 2. MVP Scope Document

> Scope boundary launch MVP · v0.1

## Definition of MVP

User dapat **sign up → pilih template → isi CMS → publish subdomain** dengan data terisolasi antar tenant dan public site render dari **published snapshot**.

## Must Have (P0)

| Area | Item |
|------|------|
| Renderer | `SiteRenderer`, `SectionRenderer`, `sectionRegistry`, `templateRegistry` |
| Templates | 2–3 base template + apply dari admin |
| Tenancy | `organizations`, `sites`, `site_id` on content tables |
| Security | RLS policies + server action ownership checks |
| Routing | Subdomain resolve via middleware |
| Publish | `site_publish_snapshots`, publish action, public reads snapshot |
| CMS | CRUD existing entities scoped by site |
| Admin | Choose template, reorder sections |
| SEO | Per-site title, description, OG, robots |
| Analytics | Basic page views per site |

## Should Have (P1)

- Theme / font / density pickers
- Draft preview (auth-only)
- Guestbook moderation
- Free tier watermark + plan limit stub
- Sitemap per subdomain
- OG image per site

## Nice to Have (P2, post-MVP launch)

- Custom domain + SSL
- Stripe billing
- Static export
- Advanced analytics
- Team members
- Template marketplace

## Explicitly Out of Scope

- User-uploaded React templates
- Arbitrary HTML embed
- Enterprise schema-per-tenant
- Visual page builder
- Animation editor
- E-commerce checkout
- Multi-page blog CMS

## Success = MVP Done When

See [19-acceptance-criteria.md](./19-acceptance-criteria.md)
