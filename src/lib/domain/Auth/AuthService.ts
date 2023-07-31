import type { AuthRepositoryInterface } from '$lib/infrastructure/Auth/AuthRepository';
import { Err, Ok, type Result } from '$lib/application/Result';
import type { AuthError, AuthResponse } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

export class AuthService {
	constructor(private repository: AuthRepositoryInterface) {}

	async authenticateUser(
		userId: string | undefined,
		userName: string
	): Promise<Result<{ userId: string }, AuthError>> {
		// TODO refactor authentication
		let response: AuthResponse;
		if (userId) {
			response = await this.repository.logIn(userId, userName);
		} else {
			userId = uuid();
			response = await this.repository.signUp(userId, userName);
		}
		if (response.error) {
			return Err(response.error);
		}

		return Ok({ userId });
	}
}
