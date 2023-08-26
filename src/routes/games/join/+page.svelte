<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Alert from '$lib/ui/Alert.svelte';

	export let form: ActionData;
</script>

<div class="card p-4">
	<form method="POST" action="?/join" use:enhance>
		{#if form?.partyIsFull}
			<Alert title="Impossible de rejoindre la partie. Plus de place" />
		{/if}
		<label for="game-code" class="label">
			<span>Identifiant de la partie</span>
			<input class="input" type="text" id="game-code" name="game-code" />
		</label>
		<div class="text-center">
			<button type="submit" class="btn btn-xl variant-filled-primary my-2">rejoindre</button>
		</div>
	</form>
</div>
