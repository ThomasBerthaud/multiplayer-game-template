import type { Result } from '$lib/application/Result';
import type { UserDTO } from '$lib/infrastructure/Users/UserDTO';

export class UserEntity {
	readonly id: number;
	user_id: string;
	insertedAt: string;
	userName: string;

	protected constructor(dto: UserDTO) {
		this.id = dto.id;
		this.user_id = dto.user_id;
		this.insertedAt = dto.inserted_at;
		this.userName = dto.user_name;
	}

	toJSON() {
		return {
			id: this.id,
			userId: this.user_id,
			insertedAt: this.insertedAt,
			userName: this.userName
		};
	}

	static buildFromDTO(result: Result<UserDTO[]>): Result<UserEntity[]> {
		if (result.error) {
			return result;
		}
		return { ...result, data: result.data.map((dto) => new this(dto)) };
	}
}
