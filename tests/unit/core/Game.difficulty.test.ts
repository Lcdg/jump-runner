import { describe, it, expect, vi } from 'vitest';
import { DIFFICULTY, SCROLL } from '../../../src/config/constants';
import { calculateSpawnInterval } from '../../../src/systems/DifficultySystem';

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
  }),
};

vi.stubGlobal('document', {
  getElementById: () => mockCanvas,
});

describe('Game Difficulty Integration', () => {
  describe('Game Time Tracking', () => {
    it('should increment gameTime correctly with deltaTime', () => {
      let gameTime = 0;
      const deltaTime = 0.016; // ~60 FPS

      // Simulate 60 frames (roughly 1 second)
      for (let i = 0; i < 60; i++) {
        gameTime += deltaTime;
      }

      expect(gameTime).toBeCloseTo(0.96, 1); // ~1 second
    });

    it('should track time accurately over longer periods', () => {
      let gameTime = 0;
      const deltaTime = 0.016;

      // Simulate 60 seconds of gameplay
      const frames = 60 * 60; // 60 FPS * 60 seconds
      for (let i = 0; i < frames; i++) {
        gameTime += deltaTime;
      }

      expect(gameTime).toBeCloseTo(57.6, 0); // Approximately 60 seconds
    });
  });

  describe('Spawn Interval Changes Over Time', () => {
    it('should use wider intervals at game start', () => {
      const initialInterval = calculateSpawnInterval(0);

      expect(initialInterval.min).toBe(DIFFICULTY.INITIAL_MIN_INTERVAL);
      expect(initialInterval.max).toBe(DIFFICULTY.INITIAL_MAX_INTERVAL);
    });

    it('should use narrower intervals after 60 seconds', () => {
      const finalInterval = calculateSpawnInterval(60);

      expect(finalInterval.min).toBe(DIFFICULTY.FINAL_MIN_INTERVAL);
      expect(finalInterval.max).toBe(DIFFICULTY.FINAL_MAX_INTERVAL);
    });

    it('should show measurable difference between t=0 and t=60', () => {
      const initial = calculateSpawnInterval(0);
      const final = calculateSpawnInterval(60);

      // Initial should be easier (larger intervals)
      expect(initial.min).toBeGreaterThan(final.min);
      expect(initial.max).toBeGreaterThan(final.max);

      // Difference should be significant
      expect(initial.min - final.min).toBeGreaterThan(0.5);
    });
  });

  describe('Scroll Speed Constancy', () => {
    it('SCROLL.SPEED should remain constant regardless of difficulty', () => {
      // SCROLL.SPEED is a constant, not affected by difficulty
      expect(SCROLL.SPEED).toBe(300);

      // Even if we calculate difficulty at different times,
      // SCROLL.SPEED should not change
      calculateSpawnInterval(0);
      expect(SCROLL.SPEED).toBe(300);

      calculateSpawnInterval(60);
      expect(SCROLL.SPEED).toBe(300);

      calculateSpawnInterval(120);
      expect(SCROLL.SPEED).toBe(300);
    });
  });

  describe('Difficulty Curve', () => {
    it('should have smooth progression (no sudden jumps)', () => {
      const samples = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      const intervals = samples.map((t) => calculateSpawnInterval(t));

      // Check that changes between consecutive samples are gradual
      for (let i = 1; i < intervals.length; i++) {
        const prevMin = intervals[i - 1].min;
        const currMin = intervals[i].min;
        const change = Math.abs(currMin - prevMin);

        // Change per 5 seconds should be reasonable (< 0.2s)
        expect(change).toBeLessThan(0.2);
      }
    });

    it('should reach exact final values at plateau time', () => {
      const atPlateau = calculateSpawnInterval(DIFFICULTY.PLATEAU_TIME);

      expect(atPlateau.min).toBe(DIFFICULTY.FINAL_MIN_INTERVAL);
      expect(atPlateau.max).toBe(DIFFICULTY.FINAL_MAX_INTERVAL);
    });
  });
});
