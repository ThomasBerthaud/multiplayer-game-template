<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Multiplayer game</title>
</svelte:head>

<div class="flex flex-col justify-between h-screen">
	<header class="bg-slate-700 h-10 w-full" />
	<div class="container mx-auto p-4 flex-1">
		<slot />
	</div>
	<footer class="bg-slate-700 h-10 w-full" />
</div>
