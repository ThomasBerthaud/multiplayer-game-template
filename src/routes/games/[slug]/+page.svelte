<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Share from '$lib/ui/Share.svelte';
	import type { UserEntity } from '$lib/domain/Users/UserEntity';
	import type { DTO } from '$lib/domain/DTO';
	import { onDestroy, onMount } from 'svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	export let data: PageData;
	export let form: ActionData;

	let partyChannel: RealtimeChannel;

	onMount(() => {
		// Join a room/topic. Can be anything except for 'realtime'.
		partyChannel = data.supabase.channel('room-1');

		// Simple function to log any messages we receive
		function messageReceived(payload) {
			console.log(payload);
		}

		// Subscribe to the Channel
		partyChannel
			.on('broadcast', { event: 'test' }, (payload) => messageReceived(payload))
			.subscribe();
	});

	onDestroy(() => {
		partyChannel?.unsubscribe();
	});

	function isYou(player: DTO<UserEntity>): boolean {
		return player.userId === data.user.id;
	}

	const you = data.players.find((player) => isYou(player));
	const isOwner = you?.userId === data.game.ownerId;
	const isInParty =
		data.game.status === 'pending' && data.players.some((p) => p.userId === you?.userId);
</script>

<div class="card">
	<header class="card-header flex items-center justify-between gap-5">
		<h1 class="h1">Partie n° {$page.params.slug}</h1>
		<Share slug={$page.params.slug} userName={data.user.user_metadata.user_name} />
	</header>
	<section class="p-4">
		<h3>Joueurs dans la partie ({data.players.length}/{data.game.totalPlayers})</h3>
		{#if form?.partyIsFull}
			<div>Impossible de rejoindre la partie. Plus de place</div>
		{/if}
		<ul>
			{#each data.players as player}
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
