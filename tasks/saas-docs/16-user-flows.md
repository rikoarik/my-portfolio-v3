# 16. User Flow Document

## Flow 1 — Sign up & first publish (happy path)

```mermaid
flowchart TD
  A[Landing page] --> B[Sign up]
  B --> C[Email verify optional]
  C --> D[Pick template]
  D --> E[Auto-create site + subdomain]
  E --> F[CMS dashboard checklist]
  F --> G[Fill profile]
  G --> H[Add 1+ project]
  H --> I[Preview optional]
  I --> J[Publish]
  J --> K[Visit subdomain live]
```

**Goal:** < 30 minutes to live site.

## Flow 2 — Returning user edit

```mermaid
flowchart TD
  A[Login] --> B[Dashboard]
  B --> C[Edit content module]
  C --> D[Save draft auto]
  D --> E{Ready?}
  E -->|Yes| F[Publish]
  E -->|No| B
  F --> G[Public site updated]
```

## Flow 3 — Template switch

```mermaid
flowchart TD
  A[Design tab] --> B[Browse gallery]
  B --> C[Preview template]
  C --> D{Apply?}
  D -->|Yes| E[Confirm section diff]
  E --> F[Apply to draft]
  F --> G[Review content]
  G --> H[Publish]
  D -->|No| B
```

## Flow 4 — Visitor

```mermaid
flowchart TD
  A[Open subdomain URL] --> B[Middleware resolve site]
  B --> C{Published?}
  C -->|Yes| D[Load snapshot]
  D --> E[Render SiteRenderer]
  E --> F[Optional: guestbook submit]
  C -->|No| G[404 / coming soon]
```

## Flow 5 — Guestbook submit (visitor)

```mermaid
flowchart TD
  A[Guestbook section] --> B[Click Write Message]
  B --> C[Modal form]
  C --> D[Submit API]
  D --> E{Rate limit OK?}
  E -->|Yes| F[Insert pending/visible per config]
  E -->|No| G[Error toast]
```

## Flow 6 — Admin moderate guestbook

```mermaid
flowchart TD
  A[Guestbook admin] --> B[See pending messages]
  B --> C[Approve or delete]
  C --> D[Republish if needed for snapshot mode]
```

## Personas

See PRD §5 — primary: developer job seeker; secondary: freelancer/designer.

## Related

- [17-wireframe-screen-list.md](./17-wireframe-screen-list.md)
- [14-admin-dashboard-ia.md](./14-admin-dashboard-ia.md)
