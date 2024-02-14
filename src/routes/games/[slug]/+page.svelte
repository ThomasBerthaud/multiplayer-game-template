<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Share from '$lib/ui/Share.svelte';
	import { UserEntity } from '$lib/domain/Users/UserEntity';
	import type { DTO } from '$lib/domain/DTO';
	import { onDestroy, onMount } from 'svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	export let data: PageData;
	export let form: ActionData;

	const { supabase, you, game } = data;

	let { players } = data;
	let roomOne: RealtimeChannel;

	onMount(() => {
		roomOne = supabase.channel('room_01');

		roomOne
			.on('presence', { event: 'sync' }, () => {
				const newState = roomOne.presenceState<DTO<UserEntity>>();
				players = Object.values(newState).map((p) => p[0]);
			})
			.subscribe(async (status) => {
				if (status !== 'SUBSCRIBED') return;
				roomOne.track(you);
			});
	});

	onDestroy(() => {
		roomOne.untrack();
		roomOne.unsubscribe();
	});

	function isYou(player: DTO<UserEntity>): boolean {
		return player.userId === you.userId;
	}

	const isOwner = you?.userId === game.ownerId;
	const isInParty = game.status === 'pending' && players.some((p) => p.userId === you?.userId);
</script>

<div class="card">
	<header class="card-header flex items-center justify-between gap-5">
		<h1 class="h1">Partie n° {$page.params.slug}</h1>
		<Share slug={$page.params.slug} userName={you.userName} />
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
