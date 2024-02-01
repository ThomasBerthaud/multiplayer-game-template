import { DEFAULT_USER_PASSWORD } from '$env/static/private';
import type { AuthError, AuthResponse, PostgrestError } from '@supabase/supabase-js';
import type { Result } from '$lib/application/Result';
import { Err, Ok } from '$lib/application/Result';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';
import type { User } from '$lib/domain/Users/User';
import type { SignInWithPasswordCredentials } from '@supabase/gotrue-js/src/lib/types';

export class AuthRepository {
	constructor(private supabase: AppSupabaseClient) {}

	async signUp(userId: string, userName: string): Promise<AuthResponse> {
		const credentials = this.getCredentials(userId);
		await this.supabase.auth.admin.createUser({
			...credentials,
			email_confirm: true,
			user_metadata: {
				user_name: userName
			}
		});

		return await this.supabase.auth.signInWithPassword(credentials);
	}

	async logIn(userId: string, userName: string): Promise<AuthResponse> {
		const credentials = this.getCredentials(userId);
		const response = await this.supabase.auth.signInWithPassword(credentials);
		if (response.error) {
			return response;
		}
		const uid = response.data.user.id;
		await this.supabase.auth.admin.updateUserById(uid, {
			user_metadata: {
				user_name: userName
			}
		});
		return response;
	}

	async getCurrentUser(): Promise<Result<User, AuthError | PostgrestError>> {
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

	private getCredentials(userId: string): SignInWithPasswordCredentials {
		return {
			email: `${userId}@tberthaud.com`,
			password: DEFAULT_USER_PASSWORD
		};
	}
}
