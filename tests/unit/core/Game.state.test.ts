import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../../../src/core/Game';

// Mock canvas for tests
const mockCanvas = {
  width: 800,
  height: 600,
  addEventListener: vi.fn(),
  getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
  getContext: () => ({
    fillRect: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    font: '',
    globalAlpha: 1,
    clearRect: vi.fn(),
  }),
};

vi.stubGlobal('document', {
  getElementById: () => mockCanvas,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

describe('Game State Integration', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initial State', () => {
    it('should start in attract state', () => {
      expect(game.getCurrentState()).toBe('attract');
    });
  });

  describe('State Transitions via Input', () => {
    it('should transition from attract to playing on jump_start', () => {
      // Simulate the handleInput behavior
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      expect(game.getCurrentState()).toBe('playing');
    });

    it('should transition from gameOver to attract on jump_start', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      stateManager.transition('attract');

      expect(game.getCurrentState()).toBe('attract');
    });
  });

  describe('Collision Triggers GameOver', () => {
    it('should have stateManager accessible', () => {
      const stateManager = game.getStateManager();
      expect(stateManager).toBeDefined();
      expect(stateManager.getState()).toBe('attract');
    });

    it('should be able to manually transition to gameOver from playing', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      expect(game.getCurrentState()).toBe('gameOver');
    });
  });

  describe('State-Specific Behavior', () => {
    it('should reset game state when entering playing from attract', () => {
      const stateManager = game.getStateManager();

      // Transition to playing triggers resetGameplay via callback
      stateManager.transition('playing');

      expect(game.getCurrentState()).toBe('playing');
      expect(game.getGameTime()).toBe(0);
      expect(game.getObstacles()).toEqual([]);
    });

    it('should reset game state when entering attract from gameOver', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      // Transition back to attract
      stateManager.transition('attract');

      expect(game.getCurrentState()).toBe('attract');
      expect(game.getGameTime()).toBe(0);
      expect(game.getObstacles()).toEqual([]);
    });

    it('should deactivate player when entering gameOver', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      // Get player before gameOver
      const player = game.getPlayer();
      expect(player.isActive()).toBe(true);

      stateManager.transition('gameOver');

      expect(player.isActive()).toBe(false);
    });
  });

  describe('State Transitions - Full Cycle', () => {
    it('should complete full state cycle: attract → playing → gameOver → attract', () => {
      const stateManager = game.getStateManager();

      expect(game.getCurrentState()).toBe('attract');

      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');

      stateManager.transition('gameOver');
      expect(game.getCurrentState()).toBe('gameOver');

      stateManager.transition('attract');
      expect(game.getCurrentState()).toBe('attract');
    });

    it('should be able to play multiple rounds', () => {
      const stateManager = game.getStateManager();

      // Round 1
      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      // Round 2
      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');
      expect(game.getGameTime()).toBe(0); // Should be reset

      stateManager.transition('gameOver');
      stateManager.transition('attract');

      // Round 3
      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');
    });
  });

  describe('Invalid Transitions', () => {
    it('should not allow direct transition from attract to gameOver', () => {
      const stateManager = game.getStateManager();
      const result = stateManager.transition('gameOver');

      expect(result).toBe(false);
      expect(game.getCurrentState()).toBe('attract');
    });

    it('should not allow direct transition from playing to attract', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      const result = stateManager.transition('attract');

      expect(result).toBe(false);
      expect(game.getCurrentState()).toBe('playing');
    });

    it('should not allow direct transition from gameOver to playing', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      const result = stateManager.transition('playing');

      expect(result).toBe(false);
      expect(game.getCurrentState()).toBe('gameOver');
    });
  });
});
