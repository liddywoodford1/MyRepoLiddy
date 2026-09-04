-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  option text not null check (option in ('Saj', 'Manoushe', 'Falafel', 'Foul')),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.votes enable row level security;

-- Anyone can vote (insert a row)
create policy "Public can insert votes"
  on public.votes
  for insert
  to anon
  with check (true);

-- Anyone can read results
create policy "Public can read votes"
  on public.votes
  for select
  to anon
  using (true);

-- No update or delete policies are created, so the anon role
-- (and any role without an explicit policy) cannot update or delete rows.

-- Enable Realtime on this table so the results page gets live updates.
-- Dashboard -> Database -> Replication -> add "votes" to the supabase_realtime publication,
-- or run:
alter publication supabase_realtime add table public.votes;
