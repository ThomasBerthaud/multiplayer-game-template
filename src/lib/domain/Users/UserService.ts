import type { Result } from '$lib/application/Result';
import { Err } from '$lib/application/Result';
import { UserEntity } from './UserEntity';
import type { NumberLike } from '$lib/application/Hashid';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import { GamesRepository } from '$lib/domain/Games/GamesRepository';
import { UserRepository } from '$lib/domain/Users/UserRepository';
import { GameAlreadyStartedError } from '$lib/domain/Users/errors/GameAlreadyStartedError';
import { MaxPlayersError } from '$lib/domain/Users/errors/MaxPlayersError';
import type { AddGameError } from '$lib/domain/Users/errors/AddGameError';

export class UserService {
	constructor(
		private repository: UserRepository,
		private gameRepository: GamesRepository
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
		return UserEntity.build(response);
	}
}
