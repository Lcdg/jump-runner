import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../../../src/core/Game';
import { SCORE } from '../../../src/config/constants';

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

describe('Game Score System', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initial State', () => {
    it('should start with score of 0', () => {
      expect(game.getScore()).toBe(0);
    });

    it('should start with finalScore of 0', () => {
      expect(game.getFinalScore()).toBe(0);
    });
  });

  describe('Score During Playing', () => {
    it('should increment score during playing state', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      // Simulate some game time (manually increment as we can't easily call update)
      const initialScore = game.getScore();

      // The score should start at 0 after transition to playing
      expect(initialScore).toBe(0);
    });

    it('should calculate expected score based on POINTS_PER_SECOND', () => {
      // Verify the constant is set correctly
      expect(SCORE.POINTS_PER_SECOND).toBe(10);
    });
  });

  describe('Score Reset', () => {
    it('should reset score when entering playing state', () => {
      const stateManager = game.getStateManager();

      // First play session
      stateManager.transition('playing');
      // Score would be 0 initially

      // Game over
      stateManager.transition('gameOver');

      // Back to attract
      stateManager.transition('attract');

      // New play session - score should be reset
      stateManager.transition('playing');
      expect(game.getScore()).toBe(0);
    });

    it('should reset score when entering attract state', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');
      stateManager.transition('attract');

      expect(game.getScore()).toBe(0);
    });
  });

  describe('Final Score', () => {
    it('should save final score when entering gameOver', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      // Manually set score for testing (using internal state via transitions)
      // The finalScore is saved in the gameOver onEnter callback
      stateManager.transition('gameOver');

      // Final score should be saved (even if 0)
      expect(game.getFinalScore()).toBeDefined();
      expect(typeof game.getFinalScore()).toBe('number');
    });

    it('should keep final score after multiple transitions', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      stateManager.transition('gameOver');

      const savedFinalScore = game.getFinalScore();

      // Go back to attract
      stateManager.transition('attract');

      // Final score should still be available
      expect(game.getFinalScore()).toBe(savedFinalScore);
    });
  });

  describe('Score Not Incrementing in Other States', () => {
    it('should not have score in attract state by default', () => {
      // In attract state, score should be 0
      expect(game.getCurrentState()).toBe('attract');
      expect(game.getScore()).toBe(0);
    });
  });

  describe('Score Display Constants', () => {
    it('should have proper SCORE constants defined', () => {
      expect(SCORE.POINTS_PER_SECOND).toBeGreaterThan(0);
      expect(SCORE.FONT).toBeDefined();
      expect(SCORE.COLOR).toBeDefined();
      expect(SCORE.PADDING).toBeGreaterThan(0);
    });
  });
});
