import { expect, test } from '@playwright/test';

test('index page has login form', async ({ page }) => {
	await page.goto('/');
	const userName = page.getByText("Nom d'utilisateur :");
	await expect(userName).toBeVisible();
});
