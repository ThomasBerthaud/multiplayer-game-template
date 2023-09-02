import type { GameDTO } from './GameDTO';
import type { NewGameDTO } from './NewGameDTO';
import { mapToResult, type Result } from '$lib/application/Result';
import type { NumberLike } from '$lib/application/Hashid';
import type { AppSupabaseClient } from '$lib/application/AppSupabaseClient';

export interface GamesRepositoryInterface {
	getGame(gameId: NumberLike): Promise<Result<GameDTO>>;
	createGame(newGame: NewGameDTO): Promise<Result<GameDTO>>;
}

export class GamesRepository implements GamesRepositoryInterface {
	constructor(private supabase: AppSupabaseClient) {}

	async getGame(gameId: NumberLike): Promise<Result<GameDTO>> {
		const response = await this.supabase.from('games').select().match({ id: gameId }).single();
		return mapToResult(response);
	}

	async createGame(newGame: NewGameDTO): Promise<Result<GameDTO>> {
		const response = await this.supabase
			.from('games')
			.insert({ party_name: newGame.partyName, total_players: newGame.nbPlayers })
			.select()
			.single();
		return mapToResult(response);
	}
}