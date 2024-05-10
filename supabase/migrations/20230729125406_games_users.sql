create table games_users (
  game_id int references games,
  user_id int references users,
  primary key (game_id, user_id)
);

CREATE OR REPLACE FUNCTION get_user_id() RETURNS int AS $$
DECLARE
  _user_id int;
BEGIN
  SELECT id INTO _user_id FROM users WHERE user_id = auth.uid();
  RETURN _user_id;
END;
$$ LANGUAGE plpgsql;

alter table games_users enable row level security;

create policy "authenticated Users can see games"
  on games_users for select
  to authenticated
  using (true);

create policy "authenticated Users can join games"
  on games_users for insert
  to authenticated
  with check (true);

create policy "Users can leave their own games"
  on games_users for delete
  to authenticated
  using (get_user_id() = user_id);