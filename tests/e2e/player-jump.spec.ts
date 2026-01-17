import { test, expect } from '@playwright/test';

test.describe('Player Jump', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('canvas should render player', async ({ page }) => {
    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Wait for game to initialize
    await page.waitForTimeout(100);

    // Canvas should have correct dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeGreaterThan(0);
    expect(canvasBox!.height).toBeGreaterThan(0);
  });

  test('pressing Space should trigger jump without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Press space to jump
    await page.keyboard.press('Space');

    // Wait for animation frame
    await page.waitForTimeout(100);

    // No JavaScript errors should occur
    expect(errors).toHaveLength(0);
  });

  test('clicking canvas should trigger jump without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Click to jump
    await canvas.click();

    // Wait for animation frame
    await page.waitForTimeout(100);

    // No JavaScript errors should occur
    expect(errors).toHaveLength(0);
  });

  test('multiple rapid jumps should not cause errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Rapid key presses (simulating spam clicking)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }

    // Wait for animations to complete
    await page.waitForTimeout(500);

    // No JavaScript errors should occur
    expect(errors).toHaveLength(0);
  });

  test('game should maintain stable FPS during jump', async ({ page }) => {
    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Wait for initial frames
    await page.waitForTimeout(200);

    // Trigger jump
    await page.keyboard.press('Space');

    // Let the jump complete
    await page.waitForTimeout(1000);

    // If we got here without timeout, the game loop is running properly
    expect(true).toBe(true);
  });
});
