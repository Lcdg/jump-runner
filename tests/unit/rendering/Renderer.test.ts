import { describe, it, expect } from 'vitest';
import { CANVAS } from '../../../src/config/constants';

describe('Renderer calculations', () => {
  describe('getGroundY', () => {
    it('should calculate ground Y as 85% of height for 1080p', () => {
      const height = 1080;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(918); // 1080 * 0.85 = 918
    });

    it('should calculate ground Y as 85% of height for 720p', () => {
      const height = 720;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(612); // 720 * 0.85 = 612
    });

    it('should floor the result to avoid subpixel rendering', () => {
      const height = 1079;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(917); // 1079 * 0.85 = 917.15 → 917
      expect(Number.isInteger(groundY)).toBe(true);
    });
  });

  describe('getPlayerX', () => {
    it('should calculate player X as 20% of width for 1920p', () => {
      const width = 1920;
      const playerX = Math.floor(width * CANVAS.PLAYER_X_PERCENT);

      expect(playerX).toBe(384); // 1920 * 0.2 = 384
    });

    it('should calculate player X as 20% of width for 1280p', () => {
      const width = 1280;
      const playerX = Math.floor(width * CANVAS.PLAYER_X_PERCENT);

      expect(playerX).toBe(256); // 1280 * 0.2 = 256
    });
  });

  describe('CANVAS constants', () => {
    it('should have GROUND_Y_PERCENT set to 0.85 (per front-end-spec)', () => {
      expect(CANVAS.GROUND_Y_PERCENT).toBe(0.85);
    });

    it('should have PLAYER_X_PERCENT set to 0.2 (per front-end-spec)', () => {
      expect(CANVAS.PLAYER_X_PERCENT).toBe(0.2);
    });
  });
});
