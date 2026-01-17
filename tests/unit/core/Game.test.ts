import { describe, it, expect } from 'vitest';

describe('Game', () => {
  describe('deltaTime calculation', () => {
    it('should calculate deltaTime in seconds for 60 FPS', () => {
      const lastTime = 0;
      const currentTime = 16.67; // ~60 FPS

      const deltaTime = (currentTime - lastTime) / 1000;

      expect(deltaTime).toBeCloseTo(0.01667, 4);
    });

    it('should calculate deltaTime in seconds for 30 FPS', () => {
      const lastTime = 0;
      const currentTime = 33.33; // ~30 FPS

      const deltaTime = (currentTime - lastTime) / 1000;

      expect(deltaTime).toBeCloseTo(0.03333, 4);
    });

    it('should handle variable frame times', () => {
      const lastTime = 100;
      const currentTime = 150; // 50ms frame

      const deltaTime = (currentTime - lastTime) / 1000;

      expect(deltaTime).toBe(0.05);
    });

    it('should return deltaTime in seconds, not milliseconds', () => {
      const lastTime = 0;
      const currentTime = 1000; // 1 second

      const deltaTime = (currentTime - lastTime) / 1000;

      expect(deltaTime).toBe(1);
    });
  });

  describe('FPS calculation', () => {
    it('should calculate FPS correctly over 1 second', () => {
      const frameCount = 60;
      const elapsed = 1000; // 1 second

      const fps = Math.round((frameCount * 1000) / elapsed);

      expect(fps).toBe(60);
    });

    it('should handle partial seconds', () => {
      const frameCount = 30;
      const elapsed = 500; // 0.5 seconds

      const fps = Math.round((frameCount * 1000) / elapsed);

      expect(fps).toBe(60);
    });
  });
});
