create table games_users (
  game_id int references games,
  user_id int references users,
  primary key (game_id, user_id)
);


-- create table users (
--   "id" serial primary key,
--   "name" text
-- );
--
-- create table teams (
--   "id" serial primary key,
--   "team_name" text
-- );
--
-- create table members (
--   "user_id" int references users,
--   "team_id" int references teams,
--   primary key (user_id, team_id)
-- );