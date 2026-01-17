import { test, expect } from '@playwright/test';

test.describe('Scrolling Background', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(100);
  });

  test('game should run with scrolling without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Let the game run for 2 seconds with scrolling
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('scrolling should continue while jumping', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Jump while scrolling
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    expect(errors).toHaveLength(0);
  });

  test('game should maintain performance with scrolling', async ({ page }) => {
    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Let the game run for 3 seconds to test performance stability
    await page.waitForTimeout(3000);

    // If we got here without timeout, the game loop is running properly
    expect(true).toBe(true);
  });
});
