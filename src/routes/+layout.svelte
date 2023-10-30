<script lang="ts">
	import '../app.postcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { AppBar, AppShell, autoModeWatcher, LightSwitch, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	export let data: LayoutData;

	$: ({ supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});

	// Skeleton stores
	initializeStores();
</script>

<svelte:head>
	<title>Multiplayer game</title>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar slotDefault="place-self-center">
			<svelte:fragment slot="lead">
				<div>
					<!--TODO Back button-->
				</div>
			</svelte:fragment>
			<svelte:fragment slot="default">
				<strong class="text-xl text-center uppercase">Multiplayer Game </strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="pageHeader"></svelte:fragment>
	<div class="container mx-auto my-8">
		<slot />
	</div>
</AppShell>
