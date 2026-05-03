-- ═══════════════════════════════════════════════════════════════════
-- AtollDrift — Stories
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

create table if not exists stories (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text not null,
  content       text not null,
  cover_image_url text,
  atoll_id      text references atolls(id) on delete set null,
  author_name   text,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz default now()
);

create index if not exists idx_stories_slug        on stories(slug);
create index if not exists idx_stories_published   on stories(is_published, published_at desc);
create index if not exists idx_stories_atoll       on stories(atoll_id);

alter table stories enable row level security;

-- Public can read published stories only
create policy "Public read published stories"
  on stories for select
  using (is_published = true);

-- Authenticated admin can do everything
create policy "Auth users manage stories"
  on stories for all
  using (auth.role() = 'authenticated');

-- ── story_images ──────────────────────────────────────────────────────
create table if not exists story_images (
  id          uuid primary key default gen_random_uuid(),
  story_id    uuid not null references stories(id) on delete cascade,
  image_url   text not null,
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_story_images_story on story_images(story_id, sort_order);

alter table story_images enable row level security;

create policy "Public read story images"
  on story_images for select using (true);

create policy "Auth users manage story images"
  on story_images for all using (auth.role() = 'authenticated');
