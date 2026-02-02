import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceMonitor } from '../../../src/systems/PerformanceMonitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  describe('initial state', () => {
    it('should start in high quality mode', () => {
      expect(monitor.isLowQuality()).toBe(false);
    });

    it('should return 60 FPS with no data', () => {
      expect(monitor.getAverageFps()).toBe(60);
    });
  });

  describe('FPS tracking', () => {
    it('should calculate average FPS from frame times', () => {
      // Simulate 30 frames at 60 FPS (deltaTime = 1/60 ≈ 0.0167)
      for (let i = 0; i < 30; i++) {
        monitor.update(1 / 60);
      }
      expect(monitor.getAverageFps()).toBeCloseTo(60, 0);
    });

    it('should track low FPS correctly', () => {
      // Simulate 30 frames at 30 FPS (deltaTime = 1/30 ≈ 0.033)
      for (let i = 0; i < 30; i++) {
        monitor.update(1 / 30);
      }
      expect(monitor.getAverageFps()).toBeCloseTo(30, 0);
    });
  });

  describe('quality transitions', () => {
    it('should switch to low quality after sustained low FPS', () => {
      // Fill 30 frame buffer at low FPS
      for (let i = 0; i < 30; i++) {
        monitor.update(1 / 30);
      }

      // Need 2 seconds of sustained low FPS
      // At 30 FPS, each frame is ~0.033s, so ~60 frames = 2s
      for (let i = 0; i < 60; i++) {
        monitor.update(1 / 30);
      }

      expect(monitor.isLowQuality()).toBe(true);
    });

    it('should NOT switch to low quality before 2 second delay', () => {
      // Fill buffer
      for (let i = 0; i < 30; i++) {
        monitor.update(1 / 30);
      }

      // Only 1 second of low FPS (30 frames at 30 FPS)
      for (let i = 0; i < 30; i++) {
        monitor.update(1 / 30);
      }

      expect(monitor.isLowQuality()).toBe(false);
    });

    it('should switch back to high quality after sustained high FPS', () => {
      // First, trigger low quality
      for (let i = 0; i < 90; i++) {
        monitor.update(1 / 30);
      }
      expect(monitor.isLowQuality()).toBe(true);

      // Now sustain high FPS for 5 seconds
      // At 60 FPS, 300 frames = 5s
      for (let i = 0; i < 330; i++) {
        monitor.update(1 / 60);
      }

      expect(monitor.isLowQuality()).toBe(false);
    });

    it('should NOT switch back before 5 second delay', () => {
      // Trigger low quality
      for (let i = 0; i < 90; i++) {
        monitor.update(1 / 30);
      }
      expect(monitor.isLowQuality()).toBe(true);

      // Only 3 seconds of high FPS (180 frames at 60 FPS)
      for (let i = 0; i < 180; i++) {
        monitor.update(1 / 60);
      }

      expect(monitor.isLowQuality()).toBe(true);
    });

    it('should not downgrade if FPS is between 50-55', () => {
      // 52 FPS is in the dead zone — no transition
      for (let i = 0; i < 200; i++) {
        monitor.update(1 / 52);
      }

      expect(monitor.isLowQuality()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      // Trigger low quality
      for (let i = 0; i < 90; i++) {
        monitor.update(1 / 30);
      }
      expect(monitor.isLowQuality()).toBe(true);

      monitor.reset();

      expect(monitor.isLowQuality()).toBe(false);
      expect(monitor.getAverageFps()).toBe(60);
    });
  });
});
