import type { Result } from '$lib/application/Result';
import { Err } from '$lib/application/Result';
import type { UserRepositoryInterface } from '$lib/infrastructure/Users/UserRepository';
import { UserEntity } from './UserEntity';
import type { NumberLike } from '$lib/infrastructure/Hashid';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { GamesRepositoryInterface } from '$lib/infrastructure/Games/GamesRepository';
import type { AddGameError } from '$lib/domain/Users/errors';
import { GameAlreadyStartedError, MaxPlayersError } from '$lib/domain/Users/errors';

export class UserService {
	constructor(
		private repository: UserRepositoryInterface,
		private gameRepository: GamesRepositoryInterface
	) {}

	async addToGame(gameId: number): Promise<Result<null, AddGameError>> {
		const game = await this.gameRepository.getGame(gameId);
		if (game.error) {
			return Err(game.error);
		}
		if (game.data.status !== 'pending') {
			return Err(new GameAlreadyStartedError());
		}
		const players = await this.getPlayers(gameId);
		if (players.error) {
			return Err(players.error);
		}
		if (players.data.length >= game.data.total_players) {
			return Err(new MaxPlayersError());
		}
		return await this.repository.addToGame(gameId);
	}

	async leaveGame(gameId: NumberLike): Promise<Result<null, AuthError | PostgrestError>> {
		return await this.repository.leaveGame(gameId);
	}

	async getPlayers(gameId: number): Promise<Result<UserEntity[], AuthError | PostgrestError>> {
		const response = await this.repository.getPlayers(gameId);
		return UserEntity.buildFromDTO(response);
	}
}
