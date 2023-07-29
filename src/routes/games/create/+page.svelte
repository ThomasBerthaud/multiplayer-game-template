<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let nbPlayers = 3;
</script>

<h1>Créer une nouvelle partie</h1>
<form method="POST" action="?/create" use:enhance>
	{#if form?.wrongPartyName} <div>Le nom de la partie ne doit pas être vide</div> {/if}
	{#if form?.wrongNbPlayers} <div>Vous devez choisir un nombre de joueurs valide</div> {/if}
	<div>
		<label for="party-name">Nom de la salle</label>
		<input type="text" name="party-name" />
	</div>
	<div>
		<label for="nb-players">Nombre de joueurs (3 à 6)</label>
		<input type="range" name="nb-players" min="3" max="6" bind:value={nbPlayers} />
		<span>{nbPlayers}</span>
	</div>
	<button type="submit">Créer</button>
</form>
