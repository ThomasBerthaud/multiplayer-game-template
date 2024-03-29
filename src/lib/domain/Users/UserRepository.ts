import { Err, mapToResult, type Result } from '$lib/application/Result';
import type { User } from './User';
import { AuthRepository } from '$lib/domain/Auth/AuthRepository';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { NumberLike } from '$lib/application/Hashid';

export class UserRepository {
	constructor(
		private supabase: AppSupabaseClient,
		private authRepository: AuthRepository
	) {}

	async addToGame(gameId: number): Promise<Result<null, AuthError | PostgrestError>> {
		const user = await this.authRepository.getCurrentUser();
		if (user.error) {
			return Err(user.error);
		}
		const response = await this.supabase
			.from('games_users')
			.insert({ game_id: gameId, user_id: user.data.id });

		return mapToResult(response);
	}

	async leaveGame(gameId: NumberLike): Promise<Result<null, AuthError | PostgrestError>> {
		const user = await this.authRepository.getCurrentUser();
		if (user.error) {
			return Err(user.error);
		}
		const response = await this.supabase
			.from('games_users')
			.delete()
			.match({ game_id: gameId, user_id: user.data.id });

		return mapToResult(response);
	}

	async getPlayers(gameId: number): Promise<Result<User[]>> {
		const response = await this.supabase
			.from('users')
			.select(`*, games_users!inner(game_id)`)
			.eq('games_users.game_id', gameId);

		return mapToResult(response);
	}
}
