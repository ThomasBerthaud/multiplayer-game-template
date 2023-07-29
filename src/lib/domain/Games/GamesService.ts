import type { Result } from '$lib/application/Result';
import type { GamesRepositoryInterface } from '$lib/infrastructure/Games/GamesRepository';
import type { NewGameDTO } from '$lib/infrastructure/Games/NewGameDTO';
import { GameEntity } from './GameEntity';

export class GamesService {
	constructor(private repository: GamesRepositoryInterface) {}

	async getGame(gameCode: string) {
		const gameId = GameEntity.getGameId(gameCode);
		const result = await this.repository.getGame(gameId);
		return GameEntity.buildFromDTO(result);
	}

	async createGame(newGame: NewGameDTO): Promise<Result<GameEntity>> {
		const result = await this.repository.createGame(newGame);
		return GameEntity.buildFromDTO(result);
	}
}
