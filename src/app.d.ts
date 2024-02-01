import type { AuthService } from '$lib/domain/Auth/AuthService';
import type { GamesService } from '$lib/domain/Games/GamesService';
import type { UserService } from '$lib/domain/Users/UserService';
import type { Session } from '@supabase/supabase-js';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';

declare global {
	namespace App {
		interface Locals {
			supabase: AppSupabaseClient;
			supabaseAdmin: AppSupabaseClient;
			gamesService: GamesService;
			userService: UserService;
			authService: AuthService;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
