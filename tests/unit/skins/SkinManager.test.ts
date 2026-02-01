import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('SkinManager', () => {
  describe('register', () => {
    it('should register a skin', () => {
      const manager = new SkinManager();
      const skin = createMockSkin('TestSkin');

      manager.register(skin);

      expect(manager.has('TestSkin')).toBe(true);
    });

    it('should set the first registered skin as active', () => {
      const manager = new SkinManager();
      const skin = createMockSkin('First');

      manager.register(skin);

      expect(manager.getActiveName()).toBe('First');
    });

    it('should not change active skin when registering additional skins', () => {
      const manager = new SkinManager();
      manager.register(createMockSkin('First'));
      manager.register(createMockSkin('Second'));

      expect(manager.getActiveName()).toBe('First');
    });
  });

  describe('setActive', () => {
    it('should set a registered skin as active', () => {
      const manager = new SkinManager();
      manager.register(createMockSkin('A'));
      manager.register(createMockSkin('B'));

      manager.setActive('B');

      expect(manager.getActiveName()).toBe('B');
    });

    it('should throw when setting an unregistered skin', () => {
      const manager = new SkinManager();

      expect(() => manager.setActive('NonExistent')).toThrow(
        'Skin "NonExistent" not found',
      );
    });
  });

  describe('getActive', () => {
    it('should return the active skin', () => {
      const manager = new SkinManager();
      const skin = createMockSkin('MySkin');
      manager.register(skin);

      expect(manager.getActive()).toBe(skin);
    });

    it('should throw when no skin is registered', () => {
      const manager = new SkinManager();

      expect(() => manager.getActive()).toThrow('No active skin set');
    });
  });

  describe('getAll', () => {
    it('should return all registered skins', () => {
      const manager = new SkinManager();
      const a = createMockSkin('A');
      const b = createMockSkin('B');
      manager.register(a);
      manager.register(b);

      const all = manager.getAll();

      expect(all).toHaveLength(2);
      expect(all).toContain(a);
      expect(all).toContain(b);
    });

    it('should return empty array when no skins registered', () => {
      const manager = new SkinManager();

      expect(manager.getAll()).toHaveLength(0);
    });
  });

  describe('getAllNames', () => {
    it('should return names of all registered skins', () => {
      const manager = new SkinManager();
      manager.register(createMockSkin('Alpha'));
      manager.register(createMockSkin('Beta'));

      expect(manager.getAllNames()).toEqual(['Alpha', 'Beta']);
    });
  });

  describe('has', () => {
    it('should return true for registered skin', () => {
      const manager = new SkinManager();
      manager.register(createMockSkin('Exists'));

      expect(manager.has('Exists')).toBe(true);
    });

    it('should return false for unregistered skin', () => {
      const manager = new SkinManager();

      expect(manager.has('Ghost')).toBe(false);
    });
  });

  describe('persistence', () => {
    let mockStorage: Record<string, string>;

    beforeEach(() => {
      mockStorage = {};
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((key: string) => mockStorage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should save skin preference on setActive', () => {
      const manager = new SkinManager();
      manager.register(createMockSkin('A'));
      manager.register(createMockSkin('B'));

      manager.setActive('B');

      expect(localStorage.setItem).toHaveBeenCalledWith('jumprunner-skin', 'B');
    });

    it('should load saved preference with loadPref', () => {
      mockStorage['jumprunner-skin'] = 'B';
      const manager = new SkinManager();
      manager.register(createMockSkin('A'));
      manager.register(createMockSkin('B'));

      manager.loadPref();

      expect(manager.getActiveName()).toBe('B');
    });

    it('should ignore invalid saved preference', () => {
      mockStorage['jumprunner-skin'] = 'NonExistent';
      const manager = new SkinManager();
      manager.register(createMockSkin('A'));

      manager.loadPref();

      expect(manager.getActiveName()).toBe('A');
    });

    it('should handle missing localStorage gracefully', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new Error('not available');
        },
        setItem: () => {
          throw new Error('not available');
        },
      });

      const manager = new SkinManager();
      manager.register(createMockSkin('A'));

      expect(() => manager.loadPref()).not.toThrow();
    });
  });
});
