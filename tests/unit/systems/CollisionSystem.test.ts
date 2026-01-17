import { describe, it, expect } from 'vitest';
import { checkAABBCollision } from '../../../src/systems/CollisionSystem';
import { Hitbox } from '../../../src/core/types';

describe('CollisionSystem', () => {
  describe('checkAABBCollision', () => {
    // Base hitbox for player at position (100, 100) with size 30x60
    const playerHitbox: Hitbox = { x: 100, y: 100, width: 30, height: 60 };

    describe('No collision cases', () => {
      it('should return false when obstacle is to the right of player', () => {
        const obstacleHitbox: Hitbox = { x: 200, y: 100, width: 40, height: 50 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });

      it('should return false when obstacle is to the left of player', () => {
        const obstacleHitbox: Hitbox = { x: 10, y: 100, width: 40, height: 50 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });

      it('should return false when obstacle is above player', () => {
        const obstacleHitbox: Hitbox = { x: 100, y: 10, width: 40, height: 50 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });

      it('should return false when obstacle is below player', () => {
        const obstacleHitbox: Hitbox = { x: 100, y: 200, width: 40, height: 50 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });

      it('should return false when hitboxes are adjacent horizontally (edge to edge)', () => {
        // Obstacle starts exactly where player ends (x: 130)
        const obstacleHitbox: Hitbox = { x: 130, y: 100, width: 40, height: 60 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });

      it('should return false when hitboxes are adjacent vertically (edge to edge)', () => {
        // Obstacle starts exactly where player ends (y: 160)
        const obstacleHitbox: Hitbox = { x: 100, y: 160, width: 30, height: 40 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
      });
    });

    describe('Collision cases', () => {
      it('should return true when hitboxes overlap completely', () => {
        // Obstacle completely inside player area
        const obstacleHitbox: Hitbox = { x: 105, y: 110, width: 20, height: 40 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true when hitboxes overlap at top-left corner', () => {
        const obstacleHitbox: Hitbox = { x: 80, y: 80, width: 30, height: 30 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true when hitboxes overlap at top-right corner', () => {
        const obstacleHitbox: Hitbox = { x: 120, y: 80, width: 30, height: 30 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true when hitboxes overlap at bottom-left corner', () => {
        const obstacleHitbox: Hitbox = { x: 80, y: 150, width: 30, height: 30 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true when hitboxes overlap at bottom-right corner', () => {
        const obstacleHitbox: Hitbox = { x: 120, y: 150, width: 30, height: 30 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true with 1 pixel overlap horizontally', () => {
        // Obstacle starts 1 pixel before player ends (x: 129)
        const obstacleHitbox: Hitbox = { x: 129, y: 100, width: 40, height: 60 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });

      it('should return true with 1 pixel overlap vertically', () => {
        // Obstacle starts 1 pixel before player ends (y: 159)
        const obstacleHitbox: Hitbox = { x: 100, y: 159, width: 30, height: 40 };
        expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
      });
    });

    describe('Symmetry', () => {
      it('should return same result regardless of argument order', () => {
        const hitboxA: Hitbox = { x: 100, y: 100, width: 30, height: 60 };
        const hitboxB: Hitbox = { x: 110, y: 110, width: 40, height: 50 };

        expect(checkAABBCollision(hitboxA, hitboxB)).toBe(
          checkAABBCollision(hitboxB, hitboxA)
        );
      });
    });

    describe('Edge cases', () => {
      it('should return true for zero-size hitbox inside another (point inside rectangle)', () => {
        // A zero-size hitbox at (110, 110) is effectively a point
        // AABB considers a point inside a rectangle as overlapping
        const zeroHitbox: Hitbox = { x: 110, y: 110, width: 0, height: 0 };
        expect(checkAABBCollision(playerHitbox, zeroHitbox)).toBe(true);
      });

      it('should return false for zero-size hitbox outside another', () => {
        const zeroHitbox: Hitbox = { x: 200, y: 200, width: 0, height: 0 };
        expect(checkAABBCollision(playerHitbox, zeroHitbox)).toBe(false);
      });

      it('should handle identical hitboxes (collision)', () => {
        expect(checkAABBCollision(playerHitbox, playerHitbox)).toBe(true);
      });
    });
  });
});
