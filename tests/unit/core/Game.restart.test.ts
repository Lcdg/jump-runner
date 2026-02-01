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
    textAlign: 'left',
    textBaseline: 'alphabetic',
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }),
};

vi.stubGlobal('document', {
  getElementById: () => mockCanvas,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

describe('Game Restart Flow', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Complete State Cycle', () => {
    it('should complete full cycle: attract → playing → gameOver → attract', () => {
      const stateManager = game.getStateManager();

      expect(game.getCurrentState()).toBe('attract');

      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');

      stateManager.transition('gameOver');
      expect(game.getCurrentState()).toBe('gameOver');

      stateManager.transition('attract');
      expect(game.getCurrentState()).toBe('attract');
    });

    it('should allow multiple complete cycles', () => {
      const stateManager = game.getStateManager();

      // Cycle 1
      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      // Cycle 2
      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      // Cycle 3
      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');
    });
  });

  describe('Score Reset', () => {
    it('should reset score to 0 after restart', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      // Score would accumulate during play
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getScore()).toBe(0);
    });

    it('should reset score when starting new game from attract', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');
      stateManager.transition('playing');

      expect(game.getScore()).toBe(0);
    });
  });

  describe('GameTime Reset', () => {
    it('should reset gameTime to 0 after restart', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getGameTime()).toBe(0);
    });

    it('should reset gameTime when starting new game', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');
      stateManager.transition('playing');

      expect(game.getGameTime()).toBe(0);
    });
  });

  describe('Obstacles Reset', () => {
    it('should clear obstacles after restart', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getObstacles()).toEqual([]);
    });

    it('should have empty obstacles when starting new game', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');
      stateManager.transition('playing');

      expect(game.getObstacles()).toEqual([]);
    });
  });

  describe('Player Reset', () => {
    it('should have active player after restart', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');

      // Player is deactivated in gameOver
      expect(game.getPlayer().isActive()).toBe(false);

      stateManager.transition('attract');

      // Player should be active again
      expect(game.getPlayer().isActive()).toBe(true);
    });

    it('should reset player to idle state after restart', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getPlayer().getState()).toBe('idle');
    });

    it('should have active player when starting new game', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');
      stateManager.transition('playing');

      expect(game.getPlayer().isActive()).toBe(true);
    });
  });

  describe('Transition from GameOver', () => {
    it('should only allow transition to attract from gameOver', () => {
      const stateManager = game.getStateManager();

      stateManager.transition('playing');
      stateManager.transition('gameOver');

      // Cannot go directly to playing
      const toPlaying = stateManager.transition('playing');
      expect(toPlaying).toBe(false);
      expect(game.getCurrentState()).toBe('gameOver');

      // Can go to attract
      const toAttract = stateManager.transition('attract');
      expect(toAttract).toBe(true);
      expect(game.getCurrentState()).toBe('attract');
    });
  });

  describe('State Consistency After Restart', () => {
    it('should maintain consistent state after multiple restarts', () => {
      const stateManager = game.getStateManager();

      for (let i = 0; i < 5; i++) {
        stateManager.transition('playing');
        expect(game.getScore()).toBe(0);
        expect(game.getGameTime()).toBe(0);
        expect(game.getObstacles()).toEqual([]);
        expect(game.getPlayer().isActive()).toBe(true);

        stateManager.transition('gameOver');
        stateManager.transition('attract');
      }
    });
  });
});
