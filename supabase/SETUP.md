# AtollDrift — Supabase Setup Checklist

## 1. Run schema.sql
Supabase Dashboard → SQL Editor → New query → paste `supabase/schema.sql` → Run.

## 2. Run seed.sql
Same SQL Editor → New query → paste `supabase/seed.sql` → Run.

## 3. Run ALTER statements (existing databases only)
If you ran an older version of schema.sql, run these to add missing fields:

```sql
alter table atolls      add column if not exists why_this_atoll text;
alter table atolls      add column if not exists is_active boolean not null default true;
alter table journeys    add column if not exists banner_src text;
alter table experiences add column if not exists banner_src text;
```

## 4. Create Storage Bucket
Dashboard → **Storage** → **New bucket**

| Setting | Value |
|---|---|
| Name | `atoll-photos` |
| Public | ✅ Yes |

Then run these storage policies in SQL Editor:

```sql
create policy "Public read atoll photos storage"
  on storage.objects for select
  using (bucket_id = 'atoll-photos');

create policy "Auth users upload to atoll photos"
  on storage.objects for insert
  with check (bucket_id = 'atoll-photos' and auth.role() = 'authenticated');

create policy "Auth users update atoll photos"
  on storage.objects for update
  using (bucket_id = 'atoll-photos' and auth.role() = 'authenticated');

create policy "Auth users delete atoll photos"
  on storage.objects for delete
  using (bucket_id = 'atoll-photos' and auth.role() = 'authenticated');
```

## 5. Create Admin User
Dashboard → **Authentication** → **Users** → **Add user**
Enter your email and password. This is used to log into `/admin`.

## 6. Environment Variables
Add to `.env.local` (local) and Vercel → Settings → Environment Variables (production):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_your-resend-key
CONTACT_EMAIL=your@email.com
ANTHROPIC_API_KEY=sk-ant-your-key
```

## 7. Supabase Auth URL (production only)
Dashboard → **Authentication** → **URL Configuration** → add your Vercel URL to **Allowed Origins**:
```
https://your-app.vercel.app
```

## Field Reference

### atolls
| Field | Type | Notes |
|---|---|---|
| `id` | text | slug: huvadhu, fuvahmulah, addu |
| `name` | text | Display name |
| `coord` | text | e.g. 0° 30′ N · 73° 18′ E |
| `hemisphere` | text | north or south |
| `badge` | text | e.g. Northern Hemisphere |
| `italic` | text | Hero tagline (italic) |
| `body` | text | About section paragraph |
| `why_this_atoll` | text | Optional editorial block on atoll page |
| `is_active` | boolean | false = hidden from site |
| `sort_order` | int | Display order |

### journeys
| Field | Type | Notes |
|---|---|---|
| `banner_src` | text | URL of hero background photo |

### experiences
| Field | Type | Notes |
|---|---|---|
| `banner_src` | text | URL of hero background photo |

### Storage bucket: `atoll-photos`
All uploaded images are stored here. Organised by folder:
- `huvadhu/main-{timestamp}.jpg`
- `huvadhu/strip1-{timestamp}.jpg`
- `banners/journeys/{id}-{timestamp}.jpg`
- `banners/experiences/{id}-{timestamp}.jpg`
- `hero/{timestamp}.jpg`
