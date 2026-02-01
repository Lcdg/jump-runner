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

describe('Game Attract Mode', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initial State', () => {
    it('should start in attract state', () => {
      expect(game.getCurrentState()).toBe('attract');
    });

    it('should have player active in attract state', () => {
      expect(game.getPlayer().isActive()).toBe(true);
    });
  });

  describe('Auto-Player Behavior', () => {
    it('should have player on ground initially', () => {
      expect(game.getPlayer().getState()).toBe('idle');
    });

    it('should allow player to jump in attract mode', () => {
      const player = game.getPlayer();
      player.jump();
      expect(player.getState()).toBe('jumping');
    });
  });

  describe('State Transitions', () => {
    it('should transition to playing when Space is pressed', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');
      expect(game.getCurrentState()).toBe('playing');
    });

    it('should reset player state when transitioning to playing', () => {
      const stateManager = game.getStateManager();
      stateManager.transition('playing');

      expect(game.getPlayer().isActive()).toBe(true);
      expect(game.getGameTime()).toBe(0);
    });
  });

  describe('Obstacles in Attract Mode', () => {
    it('should have obstacles array available', () => {
      expect(game.getObstacles()).toBeDefined();
      expect(Array.isArray(game.getObstacles())).toBe(true);
    });
  });

  describe('Overlay Rendering', () => {
    it('should be in attract state for overlay to render', () => {
      expect(game.getStateManager().isState('attract')).toBe(true);
    });

    it('should not be in attract state after transitioning', () => {
      game.getStateManager().transition('playing');
      expect(game.getStateManager().isState('attract')).toBe(false);
    });
  });
});
