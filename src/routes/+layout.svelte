<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';

	export let data: LayoutData;

	$: ({ supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});

	// Vercel analytics
	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Multiplayer game</title>
</svelte:head>

<div class="flex h-screen flex-col justify-between">
	<div class="container mx-auto flex-1 p-4">
		<slot />
	</div>
</div>
