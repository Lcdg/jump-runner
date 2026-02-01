import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SkinSelector } from '../../../src/ui/SkinSelector';
import { SkinManager } from '../../../src/skins/SkinManager';
import { PlayerSkin } from '../../../src/skins/PlayerSkin';

function createMockSkin(name: string): PlayerSkin {
  return {
    init: vi.fn().mockResolvedValue(undefined),
    render: vi.fn(),
    getName: () => name,
    getThumbnail: () => null,
  };
}

function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    fillRect: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    strokeRect: vi.fn(),
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillText: vi.fn(),
    globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D;
}

describe('SkinSelector', () => {
  let manager: SkinManager;
  let selector: SkinSelector;

  beforeEach(() => {
    // Stub localStorage to prevent errors from SkinManager.setActive
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });

    manager = new SkinManager();
    manager.register(createMockSkin('Classic'));
    manager.register(createMockSkin('Detailed'));
    manager.register(createMockSkin('Extra'));
    selector = new SkinSelector(manager);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('toggle', () => {
    it('should start closed', () => {
      expect(selector.isVisible()).toBe(false);
    });

    it('should open on first toggle', () => {
      selector.toggle();
      expect(selector.isVisible()).toBe(true);
    });

    it('should close on second toggle', () => {
      selector.toggle();
      selector.toggle();
      expect(selector.isVisible()).toBe(false);
    });
  });

  describe('close', () => {
    it('should close the selector', () => {
      selector.toggle();
      selector.close();
      expect(selector.isVisible()).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should navigate to next skin', () => {
      selector.toggle();
      selector.nextSkin();
      expect(manager.getActiveName()).toBe('Detailed');
    });

    it('should navigate to previous skin', () => {
      selector.toggle();
      selector.prevSkin();
      // Wraps to last: Classic(0) -> Extra(2)
      expect(manager.getActiveName()).toBe('Extra');
    });

    it('should wrap around forward', () => {
      selector.toggle();
      selector.nextSkin(); // Detailed
      selector.nextSkin(); // Extra
      selector.nextSkin(); // Classic (wrap)
      expect(manager.getActiveName()).toBe('Classic');
    });

    it('should not navigate when closed', () => {
      selector.nextSkin();
      expect(manager.getActiveName()).toBe('Classic');
    });

    it('should sync preview index with active skin on open', () => {
      manager.setActive('Detailed');
      selector.toggle();
      selector.nextSkin(); // Should go from Detailed to Extra
      expect(manager.getActiveName()).toBe('Extra');
    });
  });

  describe('render', () => {
    it('should not render when closed', () => {
      const ctx = createMockContext();
      selector.render(ctx, 800, 600);
      expect(ctx.fillRect).not.toHaveBeenCalled();
    });

    it('should render when open', () => {
      const ctx = createMockContext();
      selector.toggle();
      selector.render(ctx, 800, 600);
      expect(ctx.fillRect).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalled();
    });

    it('should display current skin name', () => {
      const ctx = createMockContext();
      selector.toggle();
      selector.render(ctx, 800, 600);
      const fillTextCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const skinNameCall = fillTextCalls.find(
        (call: unknown[]) => call[0] === 'Classic',
      );
      expect(skinNameCall).toBeDefined();
    });
  });
});
