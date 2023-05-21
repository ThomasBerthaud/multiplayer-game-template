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

<div class="flex flex-col justify-between h-screen">
	<header class="bg-slate-700 h-10 w-full" />
	<div class="container mx-auto p-4 flex-1">
		<slot />
	</div>
	<footer class="bg-slate-700 h-10 w-full" />
</div>
