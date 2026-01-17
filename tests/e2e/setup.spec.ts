import { test, expect } from '@playwright/test';

test('canvas should be visible', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toBeVisible();
});
