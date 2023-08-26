<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Alert from '$lib/ui/Alert.svelte';

	export let form: ActionData;

	let nbPlayers = 3;
</script>

<div class="card p-4">
	<h3 class="h3 mb-4">Créer une nouvelle partie</h3>
	<form method="POST" action="?/create" use:enhance>
		{#if form?.wrongPartyName}
			<Alert title="Le nom de la partie ne doit pas être vide" />
		{/if}
		{#if form?.wrongNbPlayers}
			<Alert title="Vous devez choisir un nombre de joueurs valide" />
		{/if}
		<label for="party-name" class="label my-2">
			<span>Nom de la salle</span>
			<input class="input" id="party-name" type="text" name="party-name" />
		</label>
		<label for="nb-players" class="label my-2">
			<span>Nombre de joueurs (3 à 6)</span>
			<input
				class="input"
				id="nb-players"
				type="range"
				name="nb-players"
				min="3"
				max="6"
				bind:value={nbPlayers}
			/>
			<span>{nbPlayers}</span>
		</label>
		<div class="text-center">
			<button type="submit" class="btn btn-xl variant-filled-primary my-2">Créer</button>
		</div>
	</form>
</div>
