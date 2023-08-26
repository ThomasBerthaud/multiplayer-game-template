<script lang="ts">
	export let title: string;
	export let message = '';
</script>

<aside class="alert variant-filled-error">
	<!-- TODO Warning icon -->
	<div>(TODO icon)</div>
	<!-- Message -->
	<div class="alert-message">
		<h3 class="h3">{title}</h3>
		<p>{message}</p>
	</div>
</aside>
