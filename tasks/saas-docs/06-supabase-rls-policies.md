# 6. Supabase RLS Policy Document

## Principles

1. **Authenticated users** access only orgs/sites where they are members.
2. **Public (anon)** reads only **published** data via snapshot or public-safe views.
3. **Never** expose service role to client.
4. **Draft tables** not readable by anon.

## Helper Function

```sql
create or replace function public.user_site_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.id
  from sites s
  join organization_members om on om.organization_id = s.organization_id
  where om.user_id = auth.uid();
$$;
```

## Policy Matrix

| Table | SELECT (authenticated) | INSERT/UPDATE/DELETE | SELECT (anon) |
|-------|------------------------|----------------------|---------------|
| `organizations` | member of org | owner/admin | deny |
| `organization_members` | same org | owner/admin | deny |
| `sites` | member of org | owner/admin/editor | deny* |
| `site_domains` | via site access | owner/admin | deny |
| `site_sections` | `site_id in user_site_ids()` | editor+ | deny |
| `projects`, etc. | `site_id in user_site_ids()` | editor+ | deny |
| `site_publish_snapshots` | member | system/publish action | latest published only** |
| `guestbook` | member (moderation) | anon insert*** | published messages only |
| `page_views` | member (analytics) | service/API insert | deny |

\* Public site metadata resolved server-side from snapshot, not direct `sites` read.  
\** Via RPC or view `published_sites` exposing non-sensitive fields + snapshot id.  
\*** Rate-limited API route; optional RLS for insert with captcha token.

## Example — `sites`

```sql
alter table sites enable row level security;

create policy "sites_select_member"
  on sites for select
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "sites_update_editor"
  on sites for update
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner','admin','editor')
    )
  );
```

## Example — `projects`

```sql
alter table projects enable row level security;

create policy "projects_tenant_all"
  on projects for all
  using (site_id in (select public.user_site_ids()))
  with check (site_id in (select public.user_site_ids()));
```

## Public Read Pattern (recommended)

Do **not** let anon SELECT draft rows. Public page loader:

1. Server component uses **service role** OR dedicated RPC `get_published_site(domain)` that returns snapshot JSON only.
2. RPC validates `sites.status = 'published'` and domain verified.
3. Returns frozen payload — no draft leakage.

## Testing Checklist

- [ ] User A cannot SELECT User B's projects
- [ ] User A cannot UPDATE User B's site
- [ ] Anon cannot SELECT draft `site_sections`
- [ ] Publish RPC only for site members with editor+ role
- [ ] Suspended site returns empty from public RPC

## Related

- [08-multi-tenant-design.md](./08-multi-tenant-design.md)
- [22-security-plan.md](./22-security-plan.md)
