<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="POST" action="?/join" use:enhance>
	{#if form?.partyIsFull}
		<div>Impossible de rejoindre la partie. Plus de place</div>
	{/if}
	<label for="game-code">Identifiant de la partie</label>
	<input type="text" id="game-code" name="game-code" />
	<button type="submit">rejoindre</button>
</form>
