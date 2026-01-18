import { describe, it, expect, vi } from 'vitest';
import { GameStateManager } from '../../../src/core/GameStateManager';

describe('GameStateManager', () => {
  describe('Initial State', () => {
    it('should start in attract state', () => {
      const manager = new GameStateManager();
      expect(manager.getState()).toBe('attract');
    });

    it('isState should return true for attract initially', () => {
      const manager = new GameStateManager();
      expect(manager.isState('attract')).toBe(true);
      expect(manager.isState('playing')).toBe(false);
      expect(manager.isState('gameOver')).toBe(false);
    });
  });

  describe('Valid Transitions', () => {
    it('should allow attract → playing', () => {
      const manager = new GameStateManager();
      const result = manager.transition('playing');
      expect(result).toBe(true);
      expect(manager.getState()).toBe('playing');
    });

    it('should allow playing → gameOver', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      const result = manager.transition('gameOver');
      expect(result).toBe(true);
      expect(manager.getState()).toBe('gameOver');
    });

    it('should allow gameOver → attract', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      manager.transition('gameOver');
      const result = manager.transition('attract');
      expect(result).toBe(true);
      expect(manager.getState()).toBe('attract');
    });
  });

  describe('Invalid Transitions', () => {
    it('should reject attract → gameOver', () => {
      const manager = new GameStateManager();
      const result = manager.transition('gameOver');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('attract');
    });

    it('should reject playing → attract', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      const result = manager.transition('attract');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('playing');
    });

    it('should reject gameOver → playing', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      manager.transition('gameOver');
      const result = manager.transition('playing');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('gameOver');
    });

    it('should reject self-transition attract → attract', () => {
      const manager = new GameStateManager();
      const result = manager.transition('attract');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('attract');
    });

    it('should reject self-transition playing → playing', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      const result = manager.transition('playing');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('playing');
    });

    it('should reject self-transition gameOver → gameOver', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      manager.transition('gameOver');
      const result = manager.transition('gameOver');
      expect(result).toBe(false);
      expect(manager.getState()).toBe('gameOver');
    });
  });

  describe('State Callbacks', () => {
    it('should call onEnter when entering a state', () => {
      const manager = new GameStateManager();
      const onEnter = vi.fn();
      manager.registerCallbacks('playing', { onEnter });

      manager.transition('playing');

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should call onExit when leaving a state', () => {
      const manager = new GameStateManager();
      const onExit = vi.fn();
      manager.registerCallbacks('attract', { onExit });

      manager.transition('playing');

      expect(onExit).toHaveBeenCalledTimes(1);
    });

    it('should call onExit before onEnter', () => {
      const manager = new GameStateManager();
      const callOrder: string[] = [];

      manager.registerCallbacks('attract', {
        onExit: () => callOrder.push('exit_attract'),
      });
      manager.registerCallbacks('playing', {
        onEnter: () => callOrder.push('enter_playing'),
      });

      manager.transition('playing');

      expect(callOrder).toEqual(['exit_attract', 'enter_playing']);
    });

    it('should not call callbacks on invalid transition', () => {
      const manager = new GameStateManager();
      const onEnter = vi.fn();
      const onExit = vi.fn();

      manager.registerCallbacks('attract', { onExit });
      manager.registerCallbacks('gameOver', { onEnter });

      // This transition is invalid (attract → gameOver)
      manager.transition('gameOver');

      expect(onExit).not.toHaveBeenCalled();
      expect(onEnter).not.toHaveBeenCalled();
    });

    it('should handle multiple transitions with callbacks', () => {
      const manager = new GameStateManager();
      const playingEnter = vi.fn();
      const playingExit = vi.fn();
      const gameOverEnter = vi.fn();

      manager.registerCallbacks('playing', {
        onEnter: playingEnter,
        onExit: playingExit,
      });
      manager.registerCallbacks('gameOver', { onEnter: gameOverEnter });

      manager.transition('playing');
      expect(playingEnter).toHaveBeenCalledTimes(1);

      manager.transition('gameOver');
      expect(playingExit).toHaveBeenCalledTimes(1);
      expect(gameOverEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset', () => {
    it('should reset to attract state', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      manager.transition('gameOver');

      manager.reset();

      expect(manager.getState()).toBe('attract');
    });

    it('should work after reset and allow new transitions', () => {
      const manager = new GameStateManager();
      manager.transition('playing');
      manager.transition('gameOver');
      manager.reset();

      const result = manager.transition('playing');

      expect(result).toBe(true);
      expect(manager.getState()).toBe('playing');
    });
  });
});
