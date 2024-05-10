create type game_status as enum ('pending', 'started', 'complete');

create table games (
  id serial primary key,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references public.users (user_id) default auth.uid() not null,
  status game_status default 'pending' not null
);

alter table games enable row level security;

create policy "Anyone authenticated can create a game"
  on games for insert
  to authenticated
  with check (true);

create policy "Games can only be updated by their hosts"
  on games for update
  to authenticated
  with check (auth.uid() = owner_id);

create policy "User can see all games"
  on games for select
  to authenticated
  using (true);

create policy "User can delete his own game"
  on games for delete
  to authenticated
  using (auth.uid() = owner_id);

-- To see games in real-time.
alter publication supabase_realtime add table public.games;