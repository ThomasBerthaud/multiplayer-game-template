import type { Result } from '$lib/application/Result';

export abstract class Entity {
	readonly id: number;

	protected constructor(id: number) {
		this.id = id;
	}

	abstract toJSON(): unknown;

	static build<DB, T extends Entity>(this: new (db: DB) => T, result: Result<DB[]>): Result<T[]> {
		if (result.error) {
			return result;
		}
		return { ...result, data: result.data.map((d) => new this(d)) };
	}

	static buildOne<DB, T extends Entity>(this: new (db: DB) => T, result: Result<DB>): Result<T> {
		if (result.error) {
			return result;
		}
		return { ...result, data: new this(result.data) };
	}
}
