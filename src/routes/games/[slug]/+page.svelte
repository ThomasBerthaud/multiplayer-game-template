<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Share from '$lib/ui/Share.svelte';
	import { UserEntity } from '$lib/domain/Users/UserEntity';
	import type { DTO } from '$lib/domain/DTO';
	import { onDestroy, onMount } from 'svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import type { RealtimePostgresChangesPayload } from '@supabase/realtime-js/src/RealtimeChannel';

	export let data: PageData;
	export let form: ActionData;

	const { supabase } = data;

	let partyChannel: RealtimeChannel;
	let { players } = data;

	onMount(() => {
		// Simple function to log any messages we receive
		async function onPartyChange(
			payload: RealtimePostgresChangesPayload<{ game_id: number; user_id: number }>
		) {
			try {
				console.log(payload);
				if (payload.eventType === 'INSERT') {
					const newPlayer = await supabase
						.from('users')
						.select('*')
						.eq('id', payload.new.user_id)
						.single();
					const dto = UserEntity.buildOne(newPlayer);
					if (dto.error) {
						console.error(dto.error);
					} else {
						if (dto.data.userId === data.user.id) {
							return;
						}
						players = [...players, dto.data];
						console.log(players);
					}
				} else if (payload.eventType === 'DELETE') {
					players = players.filter((p) => p.id !== payload.old.user_id);
				}
			} catch (e) {
				console.error(e);
			}
		}

		// Join a room/topic. Can be anything except for 'realtime'.
		partyChannel = supabase
			.channel('party-users')
			.on(
				'postgres_changes',
				{
					schema: 'public',
					table: 'games_users',
					filter: `game_id=eq.${data.game.id}`,
					event: '*'
				},
				onPartyChange
			)
			.subscribe();
	});

	onDestroy(() => {
		partyChannel?.unsubscribe();
	});

	function isYou(player: DTO<UserEntity>): boolean {
		return player.userId === data.user.id;
	}

	const you = players.find((player) => isYou(player));
	const isOwner = you?.userId === data.game.ownerId;
	const isInParty = data.game.status === 'pending' && players.some((p) => p.userId === you?.userId);
</script>

<div class="card">
	<header class="card-header flex items-center justify-between gap-5">
		<h1 class="h1">Partie n° {$page.params.slug}</h1>
		<Share slug={$page.params.slug} userName={data.user.user_metadata.user_name} />
	</header>
	<section class="p-4">
		<h3>Joueurs dans la partie ({players.length}/{data.game.totalPlayers})</h3>
		{#if form?.partyIsFull}
			<div>Impossible de rejoindre la partie. Plus de place</div>
		{/if}
		<ul>
			{#each players as player}
				<li>
					{player.userName}
					<!--TODO fix DTO on client side-->
					{#if isYou(player)}
						(Vous)
					{/if}
				</li>
			{/each}
		</ul>
	</section>
	<hr class="opacity-50 mb-4" />
	<footer class="card-footer flex gap-3">
		{#if isOwner}
			<form method="POST" action="?/start">
				<button type="submit" class="btn variant-filled-primary">Demarrer la partie</button>
			</form>
		{:else if isInParty}
			<p>En attente du lancement de la partie</p>
		{:else}
			<!--TODO make reusable component-->
			<form method="POST" action="?/join" use:enhance>
				<button type="submit" class="btn variant-filled-primary">Rejoindre la partie</button>
			</form>
		{/if}
		<form method="POST" action="?/leave" use:enhance>
			<button type="submit" class="btn variant-ringed-secondary">Quitter la partie</button>
		</form>
	</footer>
</div>
