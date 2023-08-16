import type { Result } from '$lib/application/Result';
import { Err } from '$lib/application/Result';
import type { UserRepositoryInterface, UserSseEvents } from '$lib/domain/Users';
import { userSsePool } from '$lib/domain/Users';
import { UserEntity } from './UserEntity';
import type { NumberLike } from '$lib/application/Hashid';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { GamesRepositoryInterface } from '$lib/domain/Games';
import type { AddGameError } from './errors';
import { GameAlreadyStartedError, MaxPlayersError } from './errors';

export class UserService {
	constructor(
		private repository: UserRepositoryInterface,
		private gameRepository: GamesRepositoryInterface
	) {}

	async addToGame(gameId: number): Promise<Result<UserEntity, AddGameError>> {
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
		const userDTO = await this.repository.addToGame(gameId);
		return UserEntity.buildFromDTO(userDTO);
	}

	async leaveGame(gameId: NumberLike): Promise<Result<UserEntity, AuthError | PostgrestError>> {
		const userDTO = await this.repository.leaveGame(gameId);
		return UserEntity.buildFromDTO(userDTO);
	}

	async getPlayers(gameId: number): Promise<Result<UserEntity[]>> {
		const response = await this.repository.getPlayers(gameId);
		return UserEntity.buildFromDTO(response);
	}

	async notifyLobbyPlayers(gameId: number, event: UserSseEvents) {
		const players = await this.getPlayers(gameId);
		if (players.error) {
			console.error(players.error);
			return;
		}
		userSsePool.sendLobbyEvent(players.data, event);
	}
}
