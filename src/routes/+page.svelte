<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ user } = data);
</script>

<header class="flex items-center justify-center gap-5">
	<h1 class="h1">Bienvenue {user.user_metadata.user_name}</h1>
	<i class="fa-regular fa-user fa-2x"></i>
</header>
<section class="mt-8 px-12 flex flex-col justify-center">
	<a href="/games/create" class="btn btn-xl variant-filled-primary"> Jouer </a>
	<div class="py-4 self-center">OU</div>
	<a href="/games/join" class="btn btn-xl variant-ringed-secondary"> Rejoindre une partie </a>
</section>
