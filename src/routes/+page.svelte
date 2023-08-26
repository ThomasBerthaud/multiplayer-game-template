<script lang="ts">
	import UserNameForm from '$lib/ui/Users/UserNameForm.svelte';
	import Home from '$lib/ui/Home.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: ({ user } = data);
</script>

<!--TODO : faire plutot un guard au lieu d'un if/else-->
{#if user}
	<Home {user} />
{:else}
	<UserNameForm {form} />
{/if}
