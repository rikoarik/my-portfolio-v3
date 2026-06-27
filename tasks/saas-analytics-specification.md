# 24. Analytics Specification

## MVP Scope

- Page views per site
- Unique visitors (hashed fingerprint or session cookie)
- Top referrers
- 7-day / 30-day dashboard in admin

## Out of Scope (MVP)

- Heatmaps
- Funnel analysis
- Real-time websocket dashboard
- GDPR self-serve export UI

## Event Model

### `page_view`

| Property | Type | Notes |
|----------|------|-------|
| `site_id` | uuid | required |
| `path` | string | `/` MVP |
| `referrer` | string | nullable |
| `user_agent` | string | truncated |
| `country` | string | from Vercel geo header |
| `created_at` | timestamptz | |

### Future Events

- `project_modal_open`
- `guestbook_submit`
- `outbound_click` (github, linkedin)

## Collection

**Option A (MVP):** Extend existing `/api/track`

```typescript
POST /api/track
{
  "siteId": "uuid",
  "event": "page_view",
  "path": "/"
}
```

- Rate limit: 60 req/min per IP per site
- No raw IP stored — hash + salt, rotate salt monthly
- Bot filter: basic UA blocklist

**Option B (post-MVP):** Plausible/Posthog embed per paid tier

## Storage

```sql
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id),
  event_type text NOT NULL,
  path text,
  referrer text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_site_created
  ON analytics_events(site_id, created_at DESC);
```

RLS: insert via service role API route; select only for site owners.

## Dashboard Widgets

| Widget | Query |
|--------|-------|
| Views (7d) | COUNT page_view last 7 days |
| Unique (7d) | COUNT DISTINCT session hash |
| Views chart | GROUP BY date |
| Top referrers | GROUP BY referrer LIMIT 5 |

## Privacy

- No PII in events
- Cookie: `_pv_sid` session-only for uniqueness (optional)
- Privacy policy discloses analytics
- Paid tier: option to disable platform analytics (P2)

## Performance

- Fire-and-forget client beacon (`navigator.sendBeacon`)
- Async insert; no blocking render

## Acceptance

- [ ] Page view recorded on public site load
- [ ] Dashboard shows non-zero after test traffic
- [ ] Tenant A cannot query Tenant B stats
- [ ] Rate limit returns 429

---

## Detail v0.3 — Analytics Events

MVP:

- `page_view`

V1:

- `project_click`
- `social_click`
- `resume_click`
- `contact_click`
- `guestbook_submit`

### Privacy Rule

Analytics boleh membantu user, tapi jangan menyimpan data sensitif yang tidak perlu.

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
