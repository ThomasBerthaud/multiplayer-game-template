<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { initUserSseSource } from '$lib/domain/Users';

	export let data: PageData;
	export let form: ActionData;

	initUserSseSource(data.user, data.players);

	function isYou(player: PageData['players'][0]): boolean {
		return player.userId === data.user.id;
	}

	let you = data.players.find((player) => isYou(player));
	let isOwner = you?.userId === data.game.ownerId;
	let isInParty =
		data.game.status === 'pending' && data.players.some((p) => p.userId === you?.userId);
</script>

<h1>Partie n° {$page.params.gameCode}</h1>
<section>
	<h3>Joueurs dans la partie ({data.players.length}/{data.game.totalPlayers})</h3>
	{#if form?.partyIsFull}
		<div>Impossible de rejoindre la partie. Plus de place</div>
	{/if}
	<ul>
		{#each data.players as player}
			<li>
				{player.userName}
				{#if isYou(player)}
					(Vous)
				{/if}
			</li>
		{/each}
	</ul>
	{#if isOwner}
		<form method="POST" action="?/start">
			<button type="submit">Demarrer la partie</button>
		</form>
	{:else if isInParty}
		<p>En attente du lancement de la partie</p>
	{:else}
		<!--TODO make reusable component ?-->
		<form method="POST" action="?/join" use:enhance>
			<button type="submit">Rejoindre la partie</button>
		</form>
	{/if}
	<form method="POST" action="?/leave" use:enhance>
		<button type="submit">Quitter la partie</button>
	</form>
</section>
