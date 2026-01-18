import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../../../src/core/Game';

// Mock canvas for tests
const mockCanvas = {
  width: 800,
  height: 600,
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

describe('Game Over Screen', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('State Transition', () => {
    it('should transition to gameOver from playing', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      expect(game.getCurrentState()).toBe('gameOver');
    });
  });

  describe('Player Visibility', () => {
    it('should have player inactive in gameOver state', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      expect(game.getPlayer().isActive()).toBe(false);
    });
  });

  describe('Final Score', () => {
    it('should have finalScore available in gameOver', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      expect(game.getFinalScore()).toBeDefined();
      expect(typeof game.getFinalScore()).toBe('number');
    });

    it('should preserve finalScore value', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      // Score is 0 initially, so finalScore will be 0
      stateManager.transition('gameOver');
      const finalScore = game.getFinalScore();

      expect(finalScore).toBe(0);
    });
  });

  describe('Restart Flow', () => {
    it('should allow transition from gameOver to attract', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      const result = stateManager.transition('attract');

      expect(result).toBe(true);
      expect(game.getCurrentState()).toBe('attract');
    });

    it('should reset player state after restart', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getPlayer().isActive()).toBe(true);
    });
  });

  describe('Obstacles Behavior', () => {
    it('should still have obstacles array in gameOver', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      expect(game.getObstacles()).toBeDefined();
      expect(Array.isArray(game.getObstacles())).toBe(true);
    });
  });
});
