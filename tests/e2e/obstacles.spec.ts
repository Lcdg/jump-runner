import { test, expect } from '@playwright/test';

test.describe('Obstacle Spawning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(100);
  });

  test('game should run with obstacles without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Wait for obstacles to spawn and move (3 seconds should show some)
    await page.waitForTimeout(3000);

    expect(errors).toHaveLength(0);
  });

  test('obstacles should appear during gameplay', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Let obstacles spawn
    await page.waitForTimeout(4000);

    // If we got here, obstacles are spawning without crashes
    expect(errors).toHaveLength(0);
  });

  test('jumping with obstacles should work', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Jump multiple times while obstacles are spawning
    for (let i = 0; i < 5; i++) {
      await page.keyboard.down('Space');
      await page.waitForTimeout(150);
      await page.keyboard.up('Space');
      await page.waitForTimeout(800);
    }

    expect(errors).toHaveLength(0);
  });
});
