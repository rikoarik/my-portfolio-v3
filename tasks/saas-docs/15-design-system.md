# 15. Design System

## Foundation (existing)

Portfolio public UI uses CSS variables + `data-landing-theme` presets (~16 themes).

Admin uses **clean SaaS dashboard** spec in [`DESIGN.md`](../DESIGN.md) — light cards, sidebar, KPI widgets.

## Two Surfaces

| Surface | Style | Token source |
|---------|-------|--------------|
| **Published site** | Editorial / infinite-field | `--ifs-*`, landing theme presets |
| **Admin CMS** | Clean SaaS admin | `--background`, `--card`, `--border`, sidebar |

## Public Theme Tokens

```css
/* Applied via data-landing-theme on #main */
--ifs-background
--ifs-foreground
--ifs-primary
--ifs-muted-foreground
--ifs-border
--font-if-display
--font-if-body
```

Per-site `theme_config.preset` selects preset slug.

## Typography

| Role | MVP fonts |
|------|-----------|
| Display | Syne, Geist (existing) |
| Body | Geist Sans |
| Meta / labels | Geist Mono (`font-mono-meta`) |

Font picker (P1) swaps CSS variable bindings — no new font files per tenant at runtime beyond preset list.

## Spacing & Layout

| Token | Values |
|-------|--------|
| Section horizontal pad | `--ifs-section-px` (0.75rem mobile, 1.25rem sm+) |
| Content max width | `72rem` (`ifs-content-wrap`) |
| Section vertical rhythm | Per-section CSS, avoid stacked `py-40` |

## Components (shared patterns)

- **Pill buttons** — `ifs-pill-btn`, `ifs-project-glass-cta`
- **Cards** — rounded 1.25–2.5rem, subtle border
- **Badges** — mono uppercase tracking
- **Modals** — `ifs-modal` pattern (projects detail)

## Admin Components

Reuse from `src/components/admin/`:

- `AdminPageHeader`, `AdminFormCard`, `AdminListCard`
- `KpiCard`, `ShortcutCard`, `StatusBadge`

## Motion

| Mode | Behavior |
|------|----------|
| `subtle` | GSAP scroll reveals, reduced on `prefers-reduced-motion` |
| `none` | Disable non-essential animation |

Template config sets `motion` token.

## Accessibility

- Focus rings on interactive elements
- `aria-*` on accordion/tabs (projects section)
- Color contrast AA on all presets
- Skip link on public site (existing)

## Related

- `src/lib/theme/landing-theme.ts`
- `src/components/infinite-field/if-sections.css`
- `src/app/globals.css`
