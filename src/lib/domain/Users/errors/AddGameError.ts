import type { GameAlreadyStartedError } from '$lib/domain/Users/errors/GameAlreadyStartedError';
import type { MaxPlayersError } from '$lib/domain/Users/errors/MaxPlayersError';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';

export type AddGameError = GameAlreadyStartedError | MaxPlayersError | AuthError | PostgrestError;
