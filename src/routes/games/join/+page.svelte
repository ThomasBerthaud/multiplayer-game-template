<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/join" use:enhance>
	<label for="game-code">Identifiant de la partie</label>
	<input type="text" id="game-code" name="game-code" />
	<button type="submit">rejoindre</button>
</form>
