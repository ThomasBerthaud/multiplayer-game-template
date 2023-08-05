import type { Result } from '$lib/application/Result';
import type { GamesRepositoryInterface } from './GamesRepository';
import type { NewGameDTO } from './NewGameDTO';
import { GameEntity } from './GameEntity';
import type { NumberLike } from '$lib/application/Hashid';

export class GamesService {
	constructor(private repository: GamesRepositoryInterface) {}

	async getGame(gameId: NumberLike) {
		const result = await this.repository.getGame(gameId);
		return GameEntity.buildFromDTO(result);
	}

	async createGame(newGame: NewGameDTO): Promise<Result<GameEntity>> {
		const result = await this.repository.createGame(newGame);
		return GameEntity.buildFromDTO(result);
	}
}
