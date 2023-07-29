import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	const title = page.getByRole('heading', { name: 'Le jeu des cacahuetes' });
	await expect(title).toBeVisible();
});
