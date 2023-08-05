import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { GameAlreadyStartedError } from './GameAlreadyStartedError';
import type { MaxPlayersError } from './MaxPlayersError';

// Domain errors
export * from './GameAlreadyStartedError';
export * from './MaxPlayersError';

// Composite errors
export type AddGameError = GameAlreadyStartedError | MaxPlayersError | AuthError | PostgrestError;
