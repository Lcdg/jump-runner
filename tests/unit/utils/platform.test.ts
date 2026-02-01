import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('isTouchDevice', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return true when ontouchstart is in window', async () => {
    vi.stubGlobal('ontouchstart', null);
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    const { isTouchDevice } = await import('../../../src/utils/platform');
    expect(isTouchDevice()).toBe(true);

    vi.unstubAllGlobals();
  });

  it('should return true when navigator.maxTouchPoints > 0', async () => {
    // Ensure ontouchstart is NOT on window
    const hasIt = 'ontouchstart' in window;
    if (hasIt) {
      delete (window as Record<string, unknown>)['ontouchstart'];
    }

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });

    const { isTouchDevice } = await import('../../../src/utils/platform');
    expect(isTouchDevice()).toBe(true);

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });
  });

  it('should return false on desktop without touch support', async () => {
    const hasIt = 'ontouchstart' in window;
    if (hasIt) {
      delete (window as Record<string, unknown>)['ontouchstart'];
    }

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    const { isTouchDevice } = await import('../../../src/utils/platform');
    expect(isTouchDevice()).toBe(false);
  });
});
