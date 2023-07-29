import type { AuthService } from '$lib/domain/Auth/AuthService';
import type { GamesService } from '$lib/domain/Games/GamesService';
import type { UserService } from '$lib/domain/Users/UserService';
import { Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: AppSupabaseClient;
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
