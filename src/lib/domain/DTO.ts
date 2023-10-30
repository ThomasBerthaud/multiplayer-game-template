import type { Entity } from '$lib/domain/Entity';

export type DTO<T extends Entity> = ReturnType<T['toJSON']>;
