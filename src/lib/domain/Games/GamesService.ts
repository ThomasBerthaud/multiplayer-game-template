import type { Result } from '$lib/application/Result';
import { GamesRepository } from './GamesRepository';
import type { NewGameDTO } from './NewGameDTO';
import { GameEntity } from './GameEntity';
import type { NumberLike } from '$lib/application/Hashid';

export class GamesService {
	constructor(private repository: GamesRepository) {}

	async getGame(gameId: NumberLike) {
		const result = await this.repository.getGame(gameId);
		return GameEntity.buildOne(result);
	}

	async createGame(newGame: NewGameDTO): Promise<Result<GameEntity>> {
		const result = await this.repository.createGame(newGame);
		return GameEntity.buildOne(result);
	}
}
