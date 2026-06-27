# 9. Template System Specification

## Definition

**Template** = manifest (JSON/config) describing:

- Allowed section types + default order
- Default theme tokens (color, font, radius, motion)
- Layout constraints (max width, density)
- NOT a separate React codebase per template

## Template Manifest

```ts
type TemplateManifest = {
  id: string;
  label: string;
  category: 'developer' | 'creative' | 'formal';
  sections: SectionSlot[];
  defaultTheme: ThemeConfig;
  layout: {
    maxWidth: '960px' | '1120px' | '1280px';
    spacing: 'compact' | 'comfortable' | 'spacious';
    radius: 'sm' | 'md' | 'lg';
  };
};

type SectionSlot = {
  type: SectionType;
  variant: string;
  enabled: boolean;
};
```

## MVP Base Templates

| ID | Target | Sections default |
|----|--------|------------------|
| `infinite-field-v1` | Developer (current) | hero, proof, projects, about, career, guestbook, contact |
| `minimal-grid-v1` | Job seeker | hero, projects, about, contact |
| `creative-bento-v1` | Designer | hero, projects, about, contact |

## Variation Dimensions (catalog math)

```txt
template (3) × color (6) × font (4) × density (3) × motion (2) = 432 combinations
```

UI shows as "templates" — backend stores as `template_id` + `theme_config`.

## Theme Config (per site)

```json
{
  "preset": "forest-hearth",
  "fontDisplay": "syne",
  "fontBody": "geist",
  "radius": "lg",
  "motion": "subtle",
  "density": "comfortable"
}
```

Maps to existing `data-landing-theme` + CSS variables.

## Apply Template Action

1. Validate template exists in registry
2. Merge user content into new section slots (preserve matching types)
3. Warn if sections removed (projects data kept in DB, just hidden)
4. Update `sites.template_id` + `theme_config`
5. Does **not** auto-publish

## Registry Location

```txt
src/lib/templates/
├─ registry.ts
├─ manifests/
│  ├─ infinite-field-v1.ts
│  ├─ minimal-grid-v1.ts
│  └─ creative-bento-v1.ts
└─ presets/
   ├─ colors.ts
   └─ fonts.ts
```

## Out of Scope

- User-uploaded template packages
- Runtime eval of user code
- Marketplace versioning (Phase 8)
