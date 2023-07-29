<script lang="ts">
	import { page } from '$app/stores';
	import type { UserEntity } from '$lib/domain/Users/UserEntity';
	import type { PageData } from './$types';

	export let data: PageData;

	function isYou(player: UserEntity): boolean {
		return player.user_id === data.user.id;
	}
</script>

<h1>Partie n° {$page.params.slug}</h1>
<section>
	<h3>Joueurs dans la partie ({data.players.length}/{data.game.totalPlayers})</h3>
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
	<form method="POST" action="?/start">
		<button type="submit">Demarrer la partie</button>
	</form>
</section>
