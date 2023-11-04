<script lang="ts">
	import { clipboard, getToastStore } from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment';

	export let slug: string;
	export let userName: string;

	const toastStore = getToastStore();

	const shareable = browser ? navigator.canShare?.() : false;

	function shareSlug() {
		navigator.share({
			title: `Partie de ${userName}`,
			text: 'Rejoignez la partie',
			url: window.location.href
		});
	}

	function displayCopyToast() {
		toastStore.trigger({
			message: 'Code copié dans le presse papier. Partagez le à vos amis !'
		});
	}
</script>

<div class="flex items-center justify-end gap-2">
	<button
		class="btn-icon variant-ghost-tertiary"
		use:clipboard={slug}
		on:click={displayCopyToast}
		title="Copier le code de la partie"
	>
		<i class="fa-regular fa-clipboard"></i>
	</button>
	{#if shareable}
		<button
			class="btn-icon variant-ghost-tertiary"
			on:click={shareSlug}
			title="Partager le lien de la partie"
		>
			<i class="fa-regular fa-share-from-square"></i>
		</button>
	{/if}
</div>
