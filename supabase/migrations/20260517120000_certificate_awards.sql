-- Certificate awards: issued after learner passes the final practical test.

create table if not exists public.certificate_awards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  track_slug text not null,
  learner_name text not null,
  certificate_title text not null,
  track_title text not null,
  certificate_id text not null,
  issued_at timestamptz not null default now(),
  unique (user_id, track_slug)
);

alter table public.certificate_awards enable row level security;

create policy "certificate_awards_select_own"
  on public.certificate_awards for select
  using (auth.uid() = user_id);

create policy "certificate_awards_insert_own"
  on public.certificate_awards for insert
  with check (auth.uid() = user_id);
