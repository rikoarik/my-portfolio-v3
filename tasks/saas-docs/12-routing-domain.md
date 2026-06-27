# 12. Routing & Domain Specification

## Hostname Types

| Type | Example | MVP |
|------|---------|-----|
| Marketing | `app.com` | Landing + auth |
| App dashboard | `app.com/admin` | CMS |
| Subdomain tenant | `arik.app.com` | Yes |
| Custom domain | `arikriko.com` | Post-MVP |

## Middleware Logic

```ts
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  
  if (isAppHost(host)) {
    return NextResponse.next(); // marketing + admin
  }

  const site = await resolveSiteByDomain(host);
  if (!site) return NextResponse.rewrite(new URL('/404-site', request.url));
  if (site.status === 'suspended') return NextResponse.rewrite(new URL('/suspended', request.url));

  const headers = new Headers(request.headers);
  headers.set('x-site-id', site.id);
  headers.set('x-site-domain', host);
  return NextResponse.next({ request: { headers } });
}
```

## `site_domains` Table

| column | notes |
|--------|-------|
| `domain` | Full hostname, unique |
| `type` | `subdomain` \| `custom` |
| `status` | `pending` → `verified` |
| `verification_token` | DNS TXT for custom |

## Subdomain Rules

- Slug: `[a-z0-9-]`, 3–32 chars
- Reserved: `www`, `admin`, `api`, `app`, `staging`
- Auto-create on site creation: `{slug}.{APP_DOMAIN}`

## Custom Domain (Post-MVP)

1. User adds domain in admin
2. Show DNS instructions (CNAME → `cname.app.com`)
3. Verification job checks DNS
4. Set `status = verified`
5. Canonical URL = custom domain when active

## Canonical / SEO

When both subdomain + custom active:

```txt
canonical = https://custom-domain.com
```

Subdomain redirects 301 or serves with canonical tag.

## Error Pages

| Route | When |
|-------|------|
| `/404-site` | Unknown domain |
| `/suspended` | Site suspended |
| `/coming-soon` | Published but empty snapshot |

## Env Vars

```env
APP_DOMAIN=yourapp.com
NEXT_PUBLIC_APP_URL=https://yourapp.com
```
