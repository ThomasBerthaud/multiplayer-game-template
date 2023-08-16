import { SsePool } from '$lib/application/SsePool';
import type { GameEntity } from '$lib/domain/Games';
import type { UserEntity } from '$lib/domain/Users/UserEntity';
import { SseEventSource } from '$lib/application/SseEventSource';
import type { User } from '@supabase/supabase-js';
import { onDestroy, onMount } from 'svelte';
import { invalidateAll } from '$app/navigation';

export type UserSseEvents =
	| { event: 'join-lobby'; data: { game: GameEntity; player: UserEntity } }
	| { event: 'leave-lobby'; data: { player: UserEntity } };

// Server side
export class UserSsePool extends SsePool {
	private encoder: TextEncoder;
	constructor() {
		super(new Map());
		this.encoder = new TextEncoder();
	}

	sendLobbyEvent(players: UserEntity[], { event, data }: UserSseEvents) {
		for (const player of players) {
			const client = this.getClient(player.userId.toString());
			if (client) {
				client.enqueue(this.encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
			}
		}
	}
}

// Client side
export class UserSseSource extends SseEventSource<UserSseEvents> {
	constructor(userId: string) {
		super(`/api/sse/user/${userId}`);
	}
}

export const userSsePool = new UserSsePool();

export const initUserSseSource = (user: User, players: UserEntity[]) => {
	let userEventSource: UserSseSource | undefined;
	onMount(() => {
		userEventSource = new UserSseSource(user.id);
		userEventSource.addEventListener('join-lobby', (message) => {
			console.log('join lobby', message);
			// TODO fix not reactive
			// players.push(message.data.player);
			invalidateAll();
		});
		userEventSource.addEventListener('leave-lobby', (message) => {
			console.log('leave lobby', message);
			// TODO fix not reactive
			// const findIndex = players.findIndex((player) => player.userId === message.data.player.userId);
			// if (findIndex !== -1) {
			// 	players.splice(findIndex, 1);
			// }
			invalidateAll();
		});
	});
	onDestroy(() => {
		userEventSource?.close();
	});
};
