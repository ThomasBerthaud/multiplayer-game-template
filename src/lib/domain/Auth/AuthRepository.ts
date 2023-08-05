import { DEFAULT_USER_PASSWORD } from '$env/static/private';
import type { AuthError, AuthResponse, PostgrestError } from '@supabase/supabase-js';
import type { UserDTO } from '$lib/domain/Users';
import type { Result } from '$lib/application/Result';
import { Err, Ok } from '$lib/application/Result';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';

export interface AuthRepositoryInterface {
	logIn(userId: string, userName: string): Promise<AuthResponse>;
	signUp(userId: string, userName: string): Promise<AuthResponse>;

	getCurrentUser(): Promise<Result<UserDTO, AuthError | PostgrestError>>;
}

export class AuthRepository implements AuthRepositoryInterface {
	constructor(private supabase: AppSupabaseClient) {}

	logIn(userId: string, userName: string): Promise<AuthResponse> {
		// TODO update userName
		return this.supabase.auth.signInWithPassword({
			email: `${userId}@yopmail.com`,
			password: DEFAULT_USER_PASSWORD
		});
	}

	signUp(userId: string, userName: string): Promise<AuthResponse> {
		return this.supabase.auth.signUp({
			email: `${userId}@yopmail.com`,
			password: DEFAULT_USER_PASSWORD,
			options: {
				data: {
					user_name: userName
				}
			}
		});
	}

	async getCurrentUser(): Promise<Result<UserDTO, AuthError | PostgrestError>> {
		const auth = await this.supabase.auth.getUser();
		if (auth.error) {
			return Err(auth.error);
		}
		const user = await this.supabase
			.from('users')
			.select()
			.eq('user_id', auth.data.user.id)
			.single();
		if (user.error) {
			return Err(user.error);
		}

		return Ok(user.data);
	}
}
