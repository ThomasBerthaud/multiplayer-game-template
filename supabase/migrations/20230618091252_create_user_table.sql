create table users (
  id serial primary key,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users (id) on delete cascade unique not null,
  user_name text not null
);

alter table users enable row level security;

create policy "users can see all players"
  on users for select
  using (true);

create policy "users can join games"
  on users for insert
  to authenticated
  with check (true);

-- To see players joining a game in real-time.
alter publication supabase_realtime add table public.users;

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabaseClient.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (user_id, user_name)
  values (new.id, new.raw_user_meta_data->>'user_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();