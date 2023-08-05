import { Err, mapToResult, type Result } from '$lib/application/Result';
import type { UserDTO } from './UserDTO';
import type { AuthRepositoryInterface } from '$lib/domain/Auth';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';
import type { NumberLike } from '$lib/application/Hashid';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';

export interface UserRepositoryInterface {
	addToGame(gameId: number): Promise<Result<null, AuthError | PostgrestError>>;

	leaveGame(gameId: NumberLike): Promise<Result<null, AuthError | PostgrestError>>;
	getPlayers(gameId: number): Promise<Result<UserDTO[]>>;
}

export class UserRepository implements UserRepositoryInterface {
	constructor(
		private supabase: AppSupabaseClient,
		private authRepository: AuthRepositoryInterface
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

	async leaveGame(gameId: number): Promise<Result<null, AuthError | PostgrestError>> {
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

	async getPlayers(gameId: number): Promise<Result<UserDTO[]>> {
		const response = await this.supabase
			.from('users')
			.select(`*, games_users!inner(game_id)`)
			.eq('games_users.game_id', gameId);

		return mapToResult(response);
	}
}
