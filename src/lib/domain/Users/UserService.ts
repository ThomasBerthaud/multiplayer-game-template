import type { Result } from '$lib/application/Result';
import type { UserRepositoryInterface } from '$lib/infrastructure/Users/UserRepository';
import { UserEntity } from './UserEntity';

export class UserService {
	constructor(private repository: UserRepositoryInterface) {}

	async addToGame(gameId: number): Promise<Result<null>> {
		return await this.repository.addToGame(gameId);
	}

	async getPlayers(gameId: number): Promise<Result<UserEntity[]>> {
		const response = await this.repository.getPlayers(gameId);
		return UserEntity.buildFromDTO(response);
	}
}
