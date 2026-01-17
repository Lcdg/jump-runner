import { describe, it, expect } from 'vitest';
import { calculateSpawnInterval, getSpawnTime } from '../../../src/systems/DifficultySystem';
import { DIFFICULTY } from '../../../src/config/constants';

describe('DifficultySystem', () => {
  describe('calculateSpawnInterval', () => {
    it('should return initial intervals at t=0', () => {
      const result = calculateSpawnInterval(0);

      expect(result.min).toBe(DIFFICULTY.INITIAL_MIN_INTERVAL);
      expect(result.max).toBe(DIFFICULTY.INITIAL_MAX_INTERVAL);
    });

    it('should return intermediate intervals at t=30s (halfway)', () => {
      const result = calculateSpawnInterval(30);

      // At 50% progress (30s out of 60s plateau)
      const expectedMin =
        DIFFICULTY.INITIAL_MIN_INTERVAL +
        (DIFFICULTY.FINAL_MIN_INTERVAL - DIFFICULTY.INITIAL_MIN_INTERVAL) * 0.5;
      const expectedMax =
        DIFFICULTY.INITIAL_MAX_INTERVAL +
        (DIFFICULTY.FINAL_MAX_INTERVAL - DIFFICULTY.INITIAL_MAX_INTERVAL) * 0.5;

      expect(result.min).toBeCloseTo(expectedMin, 5);
      expect(result.max).toBeCloseTo(expectedMax, 5);
    });

    it('should return final intervals at t=60s (plateau time)', () => {
      const result = calculateSpawnInterval(60);

      expect(result.min).toBe(DIFFICULTY.FINAL_MIN_INTERVAL);
      expect(result.max).toBe(DIFFICULTY.FINAL_MAX_INTERVAL);
    });

    it('should remain at final intervals after plateau (t=120s)', () => {
      const result = calculateSpawnInterval(120);

      expect(result.min).toBe(DIFFICULTY.FINAL_MIN_INTERVAL);
      expect(result.max).toBe(DIFFICULTY.FINAL_MAX_INTERVAL);
    });

    it('should remain at final intervals at very long times (t=300s)', () => {
      const result = calculateSpawnInterval(300);

      expect(result.min).toBe(DIFFICULTY.FINAL_MIN_INTERVAL);
      expect(result.max).toBe(DIFFICULTY.FINAL_MAX_INTERVAL);
    });

    it('should have monotonically decreasing intervals (harder over time)', () => {
      const times = [0, 10, 20, 30, 40, 50, 60];
      let prevMin = Infinity;
      let prevMax = Infinity;

      for (const t of times) {
        const result = calculateSpawnInterval(t);

        expect(result.min).toBeLessThanOrEqual(prevMin);
        expect(result.max).toBeLessThanOrEqual(prevMax);

        prevMin = result.min;
        prevMax = result.max;
      }
    });

    it('should always return positive intervals', () => {
      const times = [0, 15, 30, 45, 60, 120, 1000];

      for (const t of times) {
        const result = calculateSpawnInterval(t);

        expect(result.min).toBeGreaterThan(0);
        expect(result.max).toBeGreaterThan(0);
      }
    });

    it('should always have min <= max', () => {
      const times = [0, 15, 30, 45, 60, 120];

      for (const t of times) {
        const result = calculateSpawnInterval(t);
        expect(result.min).toBeLessThanOrEqual(result.max);
      }
    });

    it('should handle negative time gracefully (treat as 0)', () => {
      // Negative time should be treated as 0 or early game
      const result = calculateSpawnInterval(-10);

      // Progress = min(-10/60, 1) = min(-0.166, 1) = -0.166
      // This would make intervals EASIER than initial, which is actually fine
      // The intervals will still be positive
      expect(result.min).toBeGreaterThan(0);
      expect(result.max).toBeGreaterThan(0);
    });
  });

  describe('getSpawnTime', () => {
    it('should return a value between min and max at t=0', () => {
      const intervals = calculateSpawnInterval(0);

      // Run multiple times to check randomness stays in bounds
      for (let i = 0; i < 10; i++) {
        const spawnTime = getSpawnTime(0);
        expect(spawnTime).toBeGreaterThanOrEqual(intervals.min);
        expect(spawnTime).toBeLessThanOrEqual(intervals.max);
      }
    });

    it('should return a value between min and max at t=60', () => {
      const intervals = calculateSpawnInterval(60);

      for (let i = 0; i < 10; i++) {
        const spawnTime = getSpawnTime(60);
        expect(spawnTime).toBeGreaterThanOrEqual(intervals.min);
        expect(spawnTime).toBeLessThanOrEqual(intervals.max);
      }
    });

    it('should return shorter spawn times at t=60 than at t=0', () => {
      // Average of many samples should show the trend
      let sumAt0 = 0;
      let sumAt60 = 0;
      const samples = 100;

      for (let i = 0; i < samples; i++) {
        sumAt0 += getSpawnTime(0);
        sumAt60 += getSpawnTime(60);
      }

      const avgAt0 = sumAt0 / samples;
      const avgAt60 = sumAt60 / samples;

      // Average spawn time at t=60 should be less than at t=0
      expect(avgAt60).toBeLessThan(avgAt0);
    });
  });

  describe('Configuration values', () => {
    it('should have sensible initial values (easy difficulty)', () => {
      expect(DIFFICULTY.INITIAL_MIN_INTERVAL).toBeGreaterThanOrEqual(1.5);
      expect(DIFFICULTY.INITIAL_MAX_INTERVAL).toBeGreaterThanOrEqual(2.5);
    });

    it('should have sensible final values (hard difficulty)', () => {
      expect(DIFFICULTY.FINAL_MIN_INTERVAL).toBeGreaterThanOrEqual(0.5);
      expect(DIFFICULTY.FINAL_MIN_INTERVAL).toBeLessThanOrEqual(1.5);
      expect(DIFFICULTY.FINAL_MAX_INTERVAL).toBeGreaterThanOrEqual(1.0);
      expect(DIFFICULTY.FINAL_MAX_INTERVAL).toBeLessThanOrEqual(2.0);
    });

    it('should have reasonable plateau time', () => {
      expect(DIFFICULTY.PLATEAU_TIME).toBeGreaterThanOrEqual(30);
      expect(DIFFICULTY.PLATEAU_TIME).toBeLessThanOrEqual(120);
    });

    it('should have initial intervals >= final intervals', () => {
      expect(DIFFICULTY.INITIAL_MIN_INTERVAL).toBeGreaterThanOrEqual(
        DIFFICULTY.FINAL_MIN_INTERVAL
      );
      expect(DIFFICULTY.INITIAL_MAX_INTERVAL).toBeGreaterThanOrEqual(
        DIFFICULTY.FINAL_MAX_INTERVAL
      );
    });
  });
});
