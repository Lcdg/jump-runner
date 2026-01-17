import { describe, it, expect } from 'vitest';
import { CANVAS } from '../../../src/config/constants';

describe('Renderer calculations', () => {
  describe('getGroundY', () => {
    it('should calculate ground Y as 80% of height for 1080p', () => {
      const height = 1080;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(864);
    });

    it('should calculate ground Y as 80% of height for 720p', () => {
      const height = 720;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(576);
    });

    it('should floor the result to avoid subpixel rendering', () => {
      const height = 1079;
      const groundY = Math.floor(height * CANVAS.GROUND_Y_PERCENT);

      expect(groundY).toBe(863);
      expect(Number.isInteger(groundY)).toBe(true);
    });
  });

  describe('getPlayerX', () => {
    it('should calculate player X as 15% of width for 1920p', () => {
      const width = 1920;
      const playerX = Math.floor(width * CANVAS.PLAYER_X_PERCENT);

      expect(playerX).toBe(288);
    });

    it('should calculate player X as 15% of width for 1280p', () => {
      const width = 1280;
      const playerX = Math.floor(width * CANVAS.PLAYER_X_PERCENT);

      expect(playerX).toBe(192);
    });
  });

  describe('CANVAS constants', () => {
    it('should have GROUND_Y_PERCENT set to 0.8', () => {
      expect(CANVAS.GROUND_Y_PERCENT).toBe(0.8);
    });

    it('should have PLAYER_X_PERCENT set to 0.15', () => {
      expect(CANVAS.PLAYER_X_PERCENT).toBe(0.15);
    });
  });
});
