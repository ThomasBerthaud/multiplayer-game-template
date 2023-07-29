<script lang="ts">
	import type { User } from '@supabase/supabase-js';

	export let user: User;
</script>

<h2 class="pt-3 text-center text-xl">Bienvenue {user.user_metadata.user_name}</h2>
<section class="mt-8 flex flex-col items-center justify-center">
	<a
		href="/games/create"
		class="rounded border border-red-700 bg-red-600 px-4 py-2 text-2xl font-bold text-slate-200 transition-colors hover:border-red-600 hover:bg-red-500"
	>
		Jouer
	</a>
	<div class="py-4">OU</div>
	<a
		href="/games/join"
		class="rounded border border-slate-700 bg-slate-600 px-4 py-2 text-2xl font-bold text-zinc-200 transition-colors hover:border-slate-600 hover:bg-slate-500"
	>
		Rejoindre une partie
	</a>
</section>
