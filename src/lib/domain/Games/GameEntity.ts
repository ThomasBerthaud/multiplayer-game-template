import type { Game, GameStatus } from './Game';
import { decodeHash, encodeHash, type NumberLike } from '$lib/application/Hashid';
import { Entity } from '$lib/domain/Entity';

export class GameEntity extends Entity {
	gameCode: string;
	insertedAt: string;
	ownerId: string;
	status: GameStatus;
	totalPlayers: number;

	constructor(dto: Game) {
		super(dto.id);
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
}
