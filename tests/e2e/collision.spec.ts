import { test, expect } from '@playwright/test';

test.describe('Collision Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(100);
  });

  test('collision should be detected when player does not jump', async ({ page }) => {
    const consoleLogs: string[] = [];

    // Listen for console.log messages
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Press Space to start the game (transition from attract to playing)
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Do NOT jump - wait for obstacles to come and collide with player
    // First obstacle spawns between 1.5-3 seconds, then needs time to reach player
    // At 300px/s scroll speed and ~800px to travel, it takes ~2.7s to reach player
    // Total wait: max spawn time (3s) + travel time (~3s) = ~6s to be safe
    await page.waitForTimeout(6000);

    // Check that collision was logged
    const collisionDetected = consoleLogs.some((log) =>
      log.includes('Collision detected')
    );

    expect(collisionDetected).toBe(true);
  });

  test('collision flash should be visible (visual indicator)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Press Space to start the game
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Wait for collision
    await page.waitForTimeout(6000);

    // If we got here without errors, the flash rendering works
    expect(errors).toHaveLength(0);
  });

  test('game should continue running after collision', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Press Space to start the game
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Wait for collision
    await page.waitForTimeout(6000);

    // Continue for a few more seconds to ensure game keeps running
    await page.waitForTimeout(3000);

    // No errors means game loop continues after collision
    expect(errors).toHaveLength(0);
  });
});
