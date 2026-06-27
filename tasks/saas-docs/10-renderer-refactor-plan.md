# 10. Renderer Refactor Plan

## Current State

`PortfolioClient` hardcodes section order:

```tsx
<IFProofStrip />
<IFProjectsSection />
<IFAboutSection />
<IFCareerSection />
<IFGuestbookSection />
```

File: `src/components/portfolio/PortfolioClient.tsx`

## Target State

```tsx
export function SiteRenderer({ site }: { site: PublishedSitePayload }) {
  const template = getTemplate(site.templateId);
  return (
    <TemplateProvider template={template} theme={site.themeConfig}>
      <main data-template={site.templateId}>
        {site.sections
          .filter((s) => s.isEnabled)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
      </main>
    </TemplateProvider>
  );
}
```

## Migration Steps

### Step 1 — Registry scaffolding (no visual change)

- [ ] Create `src/lib/sections/registry.ts`
- [ ] Create `src/components/site-renderer/SectionRenderer.tsx`
- [ ] Register existing IF sections with type keys matching current order
- [ ] Wrap `PortfolioClient` body with `SiteRenderer` feeding **static config** mirroring today

### Step 2 — Config-driven order

- [ ] Add local `siteConfig.json` or read from `sections` table (single tenant)
- [ ] Support hide/show section via `is_enabled`
- [ ] Support reorder via `sort_order`

### Step 3 — Template provider

- [ ] Create `TemplateProvider` applying `data-landing-theme` from config
- [ ] Map `theme_config.preset` → existing landing theme presets

### Step 4 — Wire publish snapshot

- [ ] `SiteRenderer` accepts `PublishedSitePayload` from snapshot
- [ ] Remove direct `getPortfolio()` on public path (post tenant)

## Section Registry (initial)

| type | Component | Variants |
|------|-----------|----------|
| `hero` | `PastelHero` | default |
| `proof` | `IFProofStrip` | default |
| `projects` | `IFProjectsSection` | accordion, grid (later) |
| `about` | `IFAboutSection` | default |
| `career` | `IFCareerSection` | default |
| `guestbook` | `IFGuestbookSection` | default |
| `contact` | `CinematicFooter` / contact block | default |

## Risk Mitigation

- Visual regression: screenshot compare before/after Step 1
- Feature flag `USE_SITE_RENDERER` env for rollback
- Keep `PortfolioClient` as thin wrapper until stable

## Acceptance

- [ ] Existing portfolio pixel-parity (allow minor spacing diffs)
- [ ] Reorder sections via config without code deploy
- [ ] Unknown section type → skip + log (no crash)

## Timeline

1–2 weeks (Phase 1)
