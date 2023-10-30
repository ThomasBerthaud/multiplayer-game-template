import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { AuthRepository } from '$lib/domain/Auth/AuthRepository';
import { AuthService } from '$lib/domain/Auth/AuthService';
import type { Database } from '$lib/application/database.types';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { GamesRepository } from '$lib/domain/Games/GamesRepository';
import { UserRepository } from '$lib/domain/Users/UserRepository';
import { UserService } from '$lib/domain/Users/UserService';
import { GamesService } from '$lib/domain/Games/GamesService';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// Define all repositories
	const authRepository = new AuthRepository(event.locals.supabase);
	const gamesRepository = new GamesRepository(event.locals.supabase);
	const userRepository = new UserRepository(event.locals.supabase, authRepository);

	// Define all services
	event.locals.authService = new AuthService(authRepository);
	event.locals.userService = new UserService(userRepository, gamesRepository);
	event.locals.gamesService = new GamesService(gamesRepository);

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
