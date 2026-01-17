import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputManager } from '../../../src/input/InputManager';
import { InputAction } from '../../../src/core/types';

describe('InputManager', () => {
  let inputManager: InputManager;
  let receivedActions: InputAction[];

  beforeEach(() => {
    inputManager = new InputManager();
    receivedActions = [];
  });

  afterEach(() => {
    inputManager.detach();
  });

  describe('attach()', () => {
    it('should register callback for input events', () => {
      const callback = vi.fn();
      inputManager.attach(callback);

      // Simulate keydown
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith({ type: 'jump_start' });
    });
  });

  describe('detach()', () => {
    it('should stop receiving events after detach', () => {
      const callback = vi.fn();
      inputManager.attach(callback);
      inputManager.detach();

      const event = new KeyboardEvent('keydown', { code: 'Space' });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('keyboard input', () => {
    beforeEach(() => {
      inputManager.attach((action) => receivedActions.push(action));
    });

    it('should emit jump_start on Space keydown', () => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      document.dispatchEvent(event);

      expect(receivedActions).toEqual([{ type: 'jump_start' }]);
    });

    it('should emit jump_end on Space keyup', () => {
      // First press down
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      // Then release
      document.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));

      expect(receivedActions).toEqual([
        { type: 'jump_start' },
        { type: 'jump_end' },
      ]);
    });

    it('should not emit multiple jump_start for held key', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Space', repeat: true })
      );
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Space', repeat: true })
      );

      expect(receivedActions).toEqual([{ type: 'jump_start' }]);
    });

    it('should ignore non-Space keys', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));

      expect(receivedActions).toEqual([]);
    });
  });

  describe('mouse input', () => {
    beforeEach(() => {
      inputManager.attach((action) => receivedActions.push(action));
    });

    it('should emit jump_start on left mouse button down', () => {
      const event = new MouseEvent('mousedown', { button: 0 });
      document.dispatchEvent(event);

      expect(receivedActions).toEqual([{ type: 'jump_start' }]);
    });

    it('should emit jump_end on left mouse button up', () => {
      document.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));

      expect(receivedActions).toEqual([
        { type: 'jump_start' },
        { type: 'jump_end' },
      ]);
    });

    it('should ignore right mouse button', () => {
      document.dispatchEvent(new MouseEvent('mousedown', { button: 2 }));

      expect(receivedActions).toEqual([]);
    });
  });

  describe('isJumpHeld()', () => {
    it('should return false initially', () => {
      expect(inputManager.isJumpHeld()).toBe(false);
    });

    it('should return true when jump key is held', () => {
      inputManager.attach(() => {});
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));

      expect(inputManager.isJumpHeld()).toBe(true);
    });

    it('should return false after key release', () => {
      inputManager.attach(() => {});
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      document.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));

      expect(inputManager.isJumpHeld()).toBe(false);
    });
  });

  describe('reset()', () => {
    it('should reset jump state', () => {
      inputManager.attach(() => {});
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(inputManager.isJumpHeld()).toBe(true);

      inputManager.reset();

      expect(inputManager.isJumpHeld()).toBe(false);
    });
  });
});
