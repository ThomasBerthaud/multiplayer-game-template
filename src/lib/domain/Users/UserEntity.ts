import type { User } from './User';
import { Entity } from '$lib/domain/Entity';

export class UserEntity extends Entity {
	userId: string;
	insertedAt: string;
	userName: string;

	constructor(dto: User) {
		super(dto.id);
		this.userId = dto.user_id;
		this.insertedAt = dto.inserted_at;
		this.userName = dto.user_name;
	}

	toJSON() {
		return {
			id: this.id,
			userId: this.userId,
			insertedAt: this.insertedAt,
			userName: this.userName
		};
	}
}
