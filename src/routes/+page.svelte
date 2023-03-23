<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ games } = data);
</script>

<h1 class="text-5xl px-4 py-3 text-center">Bienvenue</h1>
<section class="mt-8 flex flex-col items-center justify-center">
	<a
		href="/create-game"
		class="text-2xl font-bold px-4 py-2 rounded border border-red-700 hover:border-red-600 bg-red-600 hover:bg-red-500 text-slate-200 transition-colors"
	>
		Jouer
	</a>
	<div class="py-4">OU</div>
	<a
		href="/join-game"
		class="text-2xl font-bold px-4 py-2 rounded border border-slate-700 hover:border-slate-600 bg-slate-600 hover:bg-slate-500 text-zinc-200 transition-colors"
	>
		Rejoindre une partie
	</a>
	<div>Parties en cours :</div>
	{#each games as game}
		<span>{game.room_name}</span>
	{/each}
</section>
