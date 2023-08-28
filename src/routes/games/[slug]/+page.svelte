<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { UserEntity } from '$lib/domain/Users/UserEntity';
	import type { PageData, ActionData } from './$types';
	import Share from '$lib/ui/Share.svelte';

	export let data: PageData;
	export let form: ActionData;

	function isYou(player: UserEntity): boolean {
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
