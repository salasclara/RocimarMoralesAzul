-- Execute in Supabase SQL editor. Service-role only access; no public policies.
create table if not exists public.rocimar_ad_campaigns (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 1 and 100),
 slot text not null check (slot in ('home-top','news-inline','news-sidebar','news-between','cabimas')),
 url text not null, image text not null, alt text not null default '',
 status text not null default 'draft' check (status in ('draft','approved','paused')),
 start_at timestamptz, end_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (end_at is null or start_at is null or end_at > start_at)
);
create table if not exists public.rocimar_ad_events (
 id bigint generated always as identity primary key,
 campaign_id uuid not null references public.rocimar_ad_campaigns(id) on delete cascade,
 event_type text not null check(event_type in ('impression','click')),
 occurred_at timestamptz not null default now()
);
create index if not exists rocimar_ad_events_lookup on public.rocimar_ad_events(campaign_id,event_type,occurred_at);
alter table public.rocimar_ad_campaigns enable row level security;
alter table public.rocimar_ad_events enable row level security;
-- No anon/authenticated policies: only service_role via backend can access.
