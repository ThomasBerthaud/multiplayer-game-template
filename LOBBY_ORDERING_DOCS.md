# Lobby User Ordering and Auto-Leave Functionality

This document describes the implementation of lobby user ordering by arrival time and automatic user removal functionality.

## Features Implemented

### 1. Lobby User Ordering
Users in the game lobby are now displayed in order of their arrival time (first joined = first displayed).

**Changes:**
- Added `inserted_at` timestamp to `games_users` table to track when users join games
- Modified `getGameLobby()` function to sort users by arrival time
- Users are now displayed in ascending order of `games_users.inserted_at`

### 2. Activity Tracking
User activity is now tracked to support auto-removal of inactive users.

**Changes:**
- Added `last_active_at` timestamp to `games_users` table
- User activity is updated when:
  - User joins a game
  - User accesses the lobby (existing users)
- Activity timestamp can be updated via `updateUserActivity()` function

### 3. Auto-Remove Functionality
Inactive users can be automatically removed from games.

**Features:**
- `removeInactiveUsers()` function removes users inactive for specified time (default: 15 minutes)
- `/admin/cleanup` endpoint for manual cleanup operations
- Supports both game-specific and global cleanup

### 4. Force-Remove Feature (Testing)
Game owners can manually remove other players for testing purposes.

**Features:**
- Red "❌" button appears next to each player (visible only to game owner)
- `/games/{gameCode}/force-remove` endpoint for force removal
- Only game owners can force-remove other players
- Owners cannot force-remove themselves

## Database Changes

### Migration: `20241207202500_add_games_users_timestamps.sql`

```sql
-- Add timestamps to games_users table
ALTER TABLE games_users 
ADD COLUMN inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN last_active_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Update existing records
UPDATE games_users SET 
  inserted_at = timezone('utc'::text, now()),
  last_active_at = timezone('utc'::text, now());

-- Create indexes for efficient queries
CREATE INDEX idx_games_users_inserted_at ON games_users(game_id, inserted_at);
CREATE INDEX idx_games_users_last_active ON games_users(last_active_at);
```

## API Changes

### Modified Functions

#### `getGameLobby(request, gameId)`
- Now sorts users by `games_users.inserted_at ASC`
- Gracefully handles cases where migration hasn't been applied yet
- Returns users in order of arrival

#### `addToGame(request, gameId)`
- Now sets both `inserted_at` and `last_active_at` when users join
- Maintains backward compatibility

#### `tryAddToGame(request, gameId)`
- Updates `last_active_at` if user is already in the game
- Ensures activity tracking for existing users

### New Functions

#### `updateUserActivity(request, gameId)`
Updates the `last_active_at` timestamp for a user in a specific game.

#### `removeInactiveUsers(request, gameId?, inactiveMinutes = 15)`
Removes users who haven't been active for the specified time period.

#### `forceRemoveUser(request, gameId, targetUserId)`
Allows game owners to manually remove specific users.

## New Routes

### `/admin/cleanup`
- **Method:** POST
- **Purpose:** Manual cleanup of inactive users
- **Parameters:**
  - `gameCode` (optional): Specific game to clean up
  - `inactiveMinutes` (optional): Inactivity threshold (default: 15)

### `/games/{gameCode}/force-remove`
- **Method:** POST
- **Purpose:** Force remove a specific user from a game
- **Parameters:**
  - `targetUserId`: ID of user to remove
- **Authorization:** Only game owners

## UI Changes

### Player Component
- Added force-remove button (❌) for game owners
- Button only visible to owners and only for other players
- Uses red ghost styling to indicate destructive action
- Includes confirmation aria-label and title

## Implementation Notes

### Type Safety
- Used TypeScript casting (`as any`) for new database columns until types are regenerated
- Added ESLint exceptions for necessary type casting
- Maintained type safety where possible

### Error Handling
- Graceful fallback if database migration hasn't been applied
- Proper error messages for authorization failures
- Console warnings for non-critical failures

### Performance
- Added database indexes for efficient ordering and cleanup queries
- Minimal impact on existing functionality
- Optimized query structure for sorting

### Backward Compatibility
- Existing games continue to work without issues
- Migration updates existing records with current timestamps
- Sorting gracefully falls back to default order if new columns unavailable

## Testing

### Manual Testing Steps
1. Apply the database migration
2. Start the application and create a game
3. Have multiple users join the game in sequence
4. Verify users appear in order of arrival
5. As game owner, test the force-remove button on other players
6. Test the `/admin/cleanup` endpoint for removing inactive users

### Automated Testing
- TypeScript compilation passes
- Build process completes successfully
- Code follows project linting standards (with documented exceptions)

## Future Enhancements

1. **Real-time Updates:** Implement real-time activity tracking for more responsive auto-removal
2. **Configurable Timeouts:** Allow game owners to configure inactivity timeouts
3. **Activity Indicators:** Show last activity time in the UI
4. **Batch Operations:** Add bulk user management features
5. **Audit Logging:** Track user removal events for debugging

## Migration Instructions

1. Apply the database migration: `20241207202500_add_games_users_timestamps.sql`
2. Deploy the updated application code
3. No additional configuration required - features work immediately after deployment