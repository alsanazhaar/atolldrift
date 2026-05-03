-- ═══════════════════════════════════════════════════════════════════
-- AtollDrift — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── ATOLLS ──────────────────────────────────────────────────────────
create table if not exists atolls (
  id              text primary key,
  number          text not null,
  hemisphere      text not null check (hemisphere in ('north', 'south')),
  badge           text not null,
  coord           text not null,
  name            text not null,
  italic          text not null,
  body            text not null,
  why_this_atoll  text,
  tinted          boolean not null default false,
  flip            boolean not null default false,
  is_active       boolean not null default true,
  sort_order      int  not null default 0,
  created_at      timestamptz default now()
);

-- ── ATOLL TRUTHS (bullet points per atoll) ───────────────────────────
create table if not exists atoll_truths (
  id          bigserial primary key,
  atoll_id    text not null references atolls(id) on delete cascade,
  text        text not null,             -- HTML allowed: <strong>...</strong>
  variant     text check (variant in ('gold', null)),
  sort_order  int  not null default 0
);

-- ── ATOLL PHOTOS ─────────────────────────────────────────────────────
create table if not exists atoll_photos (
  id           bigserial primary key,
  atoll_id     text not null references atolls(id) on delete cascade,
  main_src     text not null,
  main_alt     text not null,
  main_title   text not null,
  main_sub     text not null,
  strip1_src   text not null,
  strip1_alt   text not null,
  strip1_label text not null,
  strip2_src   text not null,
  strip2_alt   text not null,
  strip2_label text not null
);

-- ── JOURNEYS ─────────────────────────────────────────────────────────
create table if not exists journeys (
  id           text primary key,
  atoll_id     text not null references atolls(id) on delete cascade,
  title        text not null,
  price        int  not null,
  duration     text not null,
  group_size   text not null,
  tagline      text not null,
  description  text not null,
  hemisphere   text not null check (hemisphere in ('north', 'south')),
  coord        text not null,
  gold_accent  boolean not null default false,
  banner_src   text,
  created_at   timestamptz default now()
);

-- ── JOURNEY INCLUDED ITEMS ───────────────────────────────────────────
create table if not exists journey_included (
  id          bigserial primary key,
  journey_id  text not null references journeys(id) on delete cascade,
  item        text not null,
  sort_order  int  not null default 0
);

-- ── JOURNEY ITINERARY DAYS ───────────────────────────────────────────
create table if not exists journey_days (
  id          bigserial primary key,
  journey_id  text not null references journeys(id) on delete cascade,
  label       text not null,             -- 'Day 1', 'Day 2–3'
  title       text not null,
  description text not null,
  sort_order  int  not null default 0
);

-- ── DEPARTURES ───────────────────────────────────────────────────────
create table if not exists departures (
  id          bigserial primary key,
  journey_id  text not null references journeys(id) on delete cascade,
  date        text not null,             -- '14 Feb 2025'
  spots       int  not null,
  spots_label text not null,             -- '4 spots remaining'
  kind        text not null default 'Group',
  status      text not null check (status in ('hot', 'open', 'soldout')) default 'open',
  price       int  not null,
  created_at  timestamptz default now()
);

-- ── EXPERIENCES ──────────────────────────────────────────────────────
create table if not exists experiences (
  id           text primary key,
  category     text not null check (category in ('ocean','surf','food','craft','culture','freedive')),
  cat_label    text not null,
  cat_class    text not null,
  atoll        text not null,
  title        text not null,
  host_name    text not null,
  host_initial text not null,
  host_location text not null,
  duration     text not null,
  group_size   text not null,
  price        int  not null,
  price_label  text not null default 'per person',
  rating       numeric(3,1) not null default 5.0,
  rating_count int  not null default 0,
  description  text not null,
  banner_src   text,
  created_at   timestamptz default now()
);

-- ── EXPERIENCE INCLUDED ITEMS ────────────────────────────────────────
create table if not exists experience_included (
  id            bigserial primary key,
  experience_id text not null references experiences(id) on delete cascade,
  item          text not null,
  sort_order    int  not null default 0
);

-- ── EXPERIENCE RULES ─────────────────────────────────────────────────
create table if not exists experience_rules (
  id            bigserial primary key,
  experience_id text not null references experiences(id) on delete cascade,
  rule          text not null,
  sort_order    int  not null default 0
);

-- ── HOST APPLICATIONS ────────────────────────────────────────────────
create table if not exists host_applications (
  id            bigserial primary key,
  full_name     text not null,
  atoll         text not null,
  island        text,
  years_here    text,
  contact       text not null,
  category      text,
  xp_title      text,
  xp_description text,
  duration      text,
  group_size    text,
  price         int,
  included      text,
  notes         text,
  status        text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  created_at    timestamptz default now()
);

-- ── BOOKING REQUESTS ─────────────────────────────────────────────────
create table if not exists booking_requests (
  id            bigserial primary key,
  type          text not null check (type in ('journey','experience')),
  item_id       text not null,             -- journey_id or experience_id
  departure_id  bigint references departures(id),
  guest_name    text not null,
  guest_email   text not null,
  guest_count   int  not null default 1,
  preferred_date text,
  notes         text,
  status        text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at    timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════
create index if not exists idx_atoll_truths_atoll    on atoll_truths(atoll_id, sort_order);
create index if not exists idx_atoll_photos_atoll    on atoll_photos(atoll_id);
create index if not exists idx_journeys_atoll        on journeys(atoll_id);
create index if not exists idx_journey_included      on journey_included(journey_id, sort_order);
create index if not exists idx_journey_days          on journey_days(journey_id, sort_order);
create index if not exists idx_departures_journey    on departures(journey_id);
create index if not exists idx_departures_status     on departures(status);
create index if not exists idx_experiences_category  on experiences(category);
create index if not exists idx_exp_included          on experience_included(experience_id, sort_order);
create index if not exists idx_exp_rules             on experience_rules(experience_id, sort_order);

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table atolls               enable row level security;
alter table atoll_truths         enable row level security;
alter table atoll_photos         enable row level security;
alter table journeys             enable row level security;
alter table journey_included     enable row level security;
alter table journey_days         enable row level security;
alter table departures           enable row level security;
alter table experiences          enable row level security;
alter table experience_included  enable row level security;
alter table experience_rules     enable row level security;
alter table host_applications    enable row level security;
alter table booking_requests     enable row level security;

-- Public read access on content tables (anon key can read)
create policy "Public read atolls"              on atolls              for select using (true);
create policy "Public read atoll_truths"        on atoll_truths        for select using (true);
create policy "Public read atoll_photos"        on atoll_photos        for select using (true);
create policy "Public read journeys"            on journeys            for select using (true);
create policy "Public read journey_included"    on journey_included    for select using (true);
create policy "Public read journey_days"        on journey_days        for select using (true);
create policy "Public read departures"          on departures          for select using (true);
create policy "Public read experiences"         on experiences         for select using (true);
create policy "Public read experience_included" on experience_included for select using (true);
create policy "Public read experience_rules"    on experience_rules    for select using (true);

-- Anyone can submit a host application or booking request
create policy "Anyone can submit host application" on host_applications
  for insert with check (true);

create policy "Anyone can submit booking request" on booking_requests
  for insert with check (true);

-- Only authenticated users (your admin) can read/update submissions
create policy "Auth users read host applications" on host_applications
  for select using (auth.role() = 'authenticated');

create policy "Auth users update host applications" on host_applications
  for update using (auth.role() = 'authenticated');

create policy "Auth users read booking requests" on booking_requests
  for select using (auth.role() = 'authenticated');

create policy "Auth users update booking requests" on booking_requests
  for update using (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════
-- ALTER STATEMENTS
-- Run these if you applied the original schema.sql before these
-- fields were added. Safe to run multiple times (IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════════════
alter table atolls      add column if not exists why_this_atoll text;
alter table atolls      add column if not exists is_active boolean not null default true;
alter table journeys    add column if not exists banner_src text;
alter table experiences add column if not exists banner_src text;

-- ═══════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- Run this in: Supabase Dashboard → SQL Editor
-- OR create the bucket manually in: Dashboard → Storage → New bucket
-- ═══════════════════════════════════════════════════════════════════

-- Create the atoll-photos bucket (public)
insert into storage.buckets (id, name, public)
values ('atoll-photos', 'atoll-photos', true)
on conflict (id) do nothing;

-- Storage RLS policies
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
