create table users (
  id serial primary key,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users (id) on delete cascade unique not null,
  user_name text not null
);

alter table users enable row level security;

create policy "authenticated users can see all players"
  on users for select
  to authenticated, authenticator
  using (true);

create policy "only authenticator can insert users"
  on users for insert
  to authenticator
  with check (true);

create policy "only own user can update himself"
  on users for update
  to authenticated
  using (auth.uid() = user_id);

-- To see players joining a game in real-time.
alter publication supabase_realtime add table public.users;

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabaseClient.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (user_id, user_name)
  values (new.id, new.raw_user_meta_data->>'user_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure handle_new_user();