-- Add timestamps to games_users table for ordering and activity tracking
ALTER TABLE games_users 
ADD COLUMN inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN last_active_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Update existing records to have current timestamp
UPDATE games_users SET 
  inserted_at = timezone('utc'::text, now()),
  last_active_at = timezone('utc'::text, now());

-- Create index for efficient ordering by insertion time
CREATE INDEX idx_games_users_inserted_at ON games_users(game_id, inserted_at);

-- Create index for efficient cleanup of inactive users
CREATE INDEX idx_games_users_last_active ON games_users(last_active_at);