import { test, expect } from '@playwright/test';

test.describe('Variable Jump Height', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(100);
  });

  test('short press (tap) should work without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Short tap - press and release quickly
    await page.keyboard.down('Space');
    await page.waitForTimeout(30);
    await page.keyboard.up('Space');

    // Wait for jump to complete
    await page.waitForTimeout(800);

    expect(errors).toHaveLength(0);
  });

  test('long press (hold) should work without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Long hold - press and hold for 200ms
    await page.keyboard.down('Space');
    await page.waitForTimeout(200);
    await page.keyboard.up('Space');

    // Wait for jump to complete
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });

  test('releasing mid-jump should work without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Press, hold briefly, release while still going up
    await page.keyboard.down('Space');
    await page.waitForTimeout(80);
    await page.keyboard.up('Space');

    // Wait for jump to complete
    await page.waitForTimeout(800);

    expect(errors).toHaveLength(0);
  });

  test('mouse click hold should also trigger variable jump', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Mouse hold
    await page.mouse.down();
    await page.waitForTimeout(150);
    await page.mouse.up();

    // Wait for jump to complete
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });

  test('alternating short and long presses should work', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const canvas = page.locator('#game');
    await expect(canvas).toBeVisible();

    // Short press
    await page.keyboard.down('Space');
    await page.waitForTimeout(30);
    await page.keyboard.up('Space');
    await page.waitForTimeout(1000);

    // Long press
    await page.keyboard.down('Space');
    await page.waitForTimeout(200);
    await page.keyboard.up('Space');
    await page.waitForTimeout(1000);

    // Short press again
    await page.keyboard.down('Space');
    await page.waitForTimeout(30);
    await page.keyboard.up('Space');
    await page.waitForTimeout(800);

    expect(errors).toHaveLength(0);
  });
});
