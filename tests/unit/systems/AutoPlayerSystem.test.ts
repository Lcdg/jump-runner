import { describe, it, expect } from 'vitest';
import {
  shouldAutoJump,
  getDistanceToNearestObstacle,
  AutoPlayerInput,
} from '../../../src/systems/AutoPlayerSystem';
import { AUTO_PLAYER, PLAYER } from '../../../src/config/constants';

describe('AutoPlayerSystem', () => {
  const createInput = (overrides: Partial<AutoPlayerInput> = {}): AutoPlayerInput => ({
    playerX: 100,
    playerY: 340, // On ground (groundY - PLAYER.HEIGHT = 400 - 60)
    playerWidth: PLAYER.WIDTH,
    playerHeight: PLAYER.HEIGHT,
    groundY: 400,
    isOnGround: true,
    obstacles: [],
    ...overrides,
  });

  describe('shouldAutoJump', () => {
    describe('when obstacle is nearby', () => {
      it('should return true when obstacle is within threshold', () => {
        const input = createInput({
          obstacles: [{ x: 200, y: 360, width: 40, height: 40 }],
        });
        // Distance = 200 - (100 + 40) = 60, which is < 150 threshold
        // Due to MISS_CHANCE randomness, we need multiple trials
        let jumpedAtLeastOnce = false;
        for (let i = 0; i < 100; i++) {
          if (shouldAutoJump(input)) {
            jumpedAtLeastOnce = true;
            break;
          }
        }
        expect(jumpedAtLeastOnce).toBe(true);
      });

      it('should return false when obstacle is beyond threshold', () => {
        const input = createInput({
          obstacles: [{ x: 400, y: 360, width: 40, height: 40 }],
        });
        // Distance = 400 - (100 + 40) = 260, which is > 150 threshold
        expect(shouldAutoJump(input)).toBe(false);
      });

      it('should return false when obstacle is behind player', () => {
        const input = createInput({
          obstacles: [{ x: 10, y: 360, width: 40, height: 40 }],
        });
        // Obstacle is behind the player (x + width < playerX + playerWidth)
        expect(shouldAutoJump(input)).toBe(false);
      });
    });

    describe('when no obstacles', () => {
      it('should return false when there are no obstacles', () => {
        const input = createInput({ obstacles: [] });
        expect(shouldAutoJump(input)).toBe(false);
      });
    });

    describe('when player is in air', () => {
      it('should return false when player is jumping', () => {
        const input = createInput({
          isOnGround: false,
          playerY: 200, // In air
          obstacles: [{ x: 200, y: 360, width: 40, height: 40 }],
        });
        expect(shouldAutoJump(input)).toBe(false);
      });

      it('should return false when player is falling', () => {
        const input = createInput({
          isOnGround: false,
          playerY: 300, // Falling
          obstacles: [{ x: 200, y: 360, width: 40, height: 40 }],
        });
        expect(shouldAutoJump(input)).toBe(false);
      });
    });

    describe('multiple obstacles', () => {
      it('should consider the nearest obstacle ahead', () => {
        const input = createInput({
          obstacles: [
            { x: 500, y: 360, width: 40, height: 40 }, // Far obstacle
            { x: 200, y: 360, width: 40, height: 40 }, // Near obstacle
            { x: 300, y: 360, width: 40, height: 40 }, // Middle obstacle
          ],
        });
        // Should react to the obstacle at x=200
        let jumpedAtLeastOnce = false;
        for (let i = 0; i < 100; i++) {
          if (shouldAutoJump(input)) {
            jumpedAtLeastOnce = true;
            break;
          }
        }
        expect(jumpedAtLeastOnce).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should return false when obstacle is at exact threshold distance', () => {
        const playerRight = 100 + PLAYER.WIDTH;
        const exactThreshold = playerRight + AUTO_PLAYER.JUMP_THRESHOLD + 1;
        const input = createInput({
          obstacles: [{ x: exactThreshold, y: 360, width: 40, height: 40 }],
        });
        expect(shouldAutoJump(input)).toBe(false);
      });

      it('should handle obstacle at distance 0 (touching)', () => {
        const input = createInput({
          obstacles: [{ x: 140, y: 360, width: 40, height: 40 }],
        });
        // Distance = 140 - 140 = 0, which is not > 0
        expect(shouldAutoJump(input)).toBe(false);
      });
    });
  });

  describe('getDistanceToNearestObstacle', () => {
    it('should return null when no obstacles', () => {
      const input = createInput({ obstacles: [] });
      expect(getDistanceToNearestObstacle(input)).toBe(null);
    });

    it('should return correct distance to nearest obstacle', () => {
      const input = createInput({
        obstacles: [{ x: 200, y: 360, width: 40, height: 40 }],
      });
      // Distance = 200 - (100 + 40) = 60
      expect(getDistanceToNearestObstacle(input)).toBe(60);
    });

    it('should return distance to nearest of multiple obstacles', () => {
      const input = createInput({
        obstacles: [
          { x: 300, y: 360, width: 40, height: 40 },
          { x: 200, y: 360, width: 40, height: 40 },
        ],
      });
      // Nearest is at x=200, distance = 200 - 140 = 60
      expect(getDistanceToNearestObstacle(input)).toBe(60);
    });

    it('should ignore obstacles behind player', () => {
      const input = createInput({
        obstacles: [
          { x: 10, y: 360, width: 40, height: 40 }, // Behind
          { x: 300, y: 360, width: 40, height: 40 }, // Ahead
        ],
      });
      // Only considers obstacle at x=300
      expect(getDistanceToNearestObstacle(input)).toBe(160);
    });
  });

  describe('imperfection mechanics', () => {
    it('should occasionally miss jumps due to MISS_CHANCE', () => {
      const input = createInput({
        obstacles: [{ x: 200, y: 360, width: 40, height: 40 }],
      });

      // Run many trials
      let jumps = 0;
      const trials = 1000;
      for (let i = 0; i < trials; i++) {
        if (shouldAutoJump(input)) {
          jumps++;
        }
      }

      // With 2% miss chance, we expect ~98% jumps
      // Allow for statistical variance
      const jumpRate = jumps / trials;
      expect(jumpRate).toBeGreaterThan(0.9);
      expect(jumpRate).toBeLessThan(1.0);
    });
  });
});
