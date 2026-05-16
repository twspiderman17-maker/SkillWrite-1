-- SkillWrite production schema (applied to project sntvbkvxniwmbwobbuwn, us-east-1)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  track_slug text not null,
  tier text not null check (tier in ('graduate', 'masters', 'certificate')),
  stripe_session_id text,
  org_name text,
  team_plan_id text,
  created_at timestamptz not null default now(),
  unique (user_id, track_slug, tier)
);

alter table public.entitlements enable row level security;

create policy "entitlements_select_own"
  on public.entitlements for select
  using (auth.uid() = user_id);
