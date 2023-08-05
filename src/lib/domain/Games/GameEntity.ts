import type { GameDTO, GameStatusDTO } from './GameDTO';
import { decodeHash, encodeHash, type NumberLike } from '$lib/application/Hashid';
import type { Result } from '$lib/application/Result';

export type GameStatus = GameStatusDTO;

export class GameEntity {
	readonly id: number;
	gameCode: string;
	insertedAt: string;
	ownerId: string;
	status: GameStatus;
	totalPlayers: number;

	protected constructor(dto: GameDTO) {
		this.id = dto.id;
		this.gameCode = encodeHash(this.id.toString());
		this.insertedAt = dto.inserted_at;
		this.ownerId = dto.owner_id;
		this.status = dto.status;
		this.totalPlayers = dto.total_players;
	}

	toJSON() {
		return {
			id: this.id,
			gameCode: this.gameCode,
			insertedAt: this.insertedAt,
			ownerId: this.ownerId,
			status: this.status,
			totalPlayers: this.totalPlayers
		};
	}

	static getGameId(gameCode: string): NumberLike {
		return decodeHash(gameCode)[0];
	}

	static buildFromDTO(result: Result<GameDTO>): Result<GameEntity> {
		if (result.error) {
			return result;
		}
		return { ...result, data: new this(result.data) };
	}
}
