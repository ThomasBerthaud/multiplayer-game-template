import { describe, it, expect } from 'vitest';
import { Entity } from '$lib/domain/Entity';
import { Err, Ok } from '$lib/application/Result';
import type { PostgrestError } from '@supabase/supabase-js';

class TestEntity extends Entity {
	constructor(dto: { id: number }) {
		super(dto.id);
	}

	toJSON() {
		return { id: this.id };
	}
}

describe('Entity', () => {
	it('should build a list of entities from a list of DTOs', () => {
		const instance = TestEntity.build(Ok([{ id: 1 }, { id: 2 }]));
		expect(instance).toEqual(Ok([new TestEntity({ id: 1 }), new TestEntity({ id: 2 })]));
	});

	it('should return an error if the result is an error', () => {
		const instance = TestEntity.build(Err({ message: 'some error' } as PostgrestError));
		expect(instance).toEqual(Err({ message: 'some error' }));
	});

	it('should build an entity from a DTO', () => {
		const instance = TestEntity.buildOne(Ok({ id: 1 }));
		expect(instance).toEqual(Ok(new TestEntity({ id: 1 })));
	});

	it('should return an error if the result is an error', () => {
		const instance = TestEntity.buildOne(Err({ message: 'some error' } as PostgrestError));
		expect(instance).toEqual(Err({ message: 'some error' }));
	});
});
