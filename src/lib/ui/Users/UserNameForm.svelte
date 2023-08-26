<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/$types';

	export let form: ActionData;
</script>

<div class="card p-4">
	<form method="POST" action="?/login" use:enhance>
		<label class="label my-2" for="user-name">
			<span>Nom d'utilisateur :</span>
			<input class="input" type="text" name="user-name" id="user-name" />
		</label>
		<div class="text-center">
			<button type="submit" class="btn btn-xl variant-filled-primary my-2">Valider</button>
		</div>
		{#if form?.unknownError}
			<div>Une erreur est survenue, réessayez plus tard</div>
		{/if}
	</form>
</div>
