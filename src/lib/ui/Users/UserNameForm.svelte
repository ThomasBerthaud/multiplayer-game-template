<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/$types';

	export let form: ActionData;
</script>

<form method="POST" action="?/login" use:enhance>
	<label for="user-name">Nom d'utilisateur :</label>
	<input type="text" name="user-name" id="user-name" />
	<button type="submit">Valider</button>
	{#if form?.unknownError}
		<div>Une erreur est survenue, réessayez plus tard</div>
	{/if}
</form>
