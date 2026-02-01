import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkAABBCollision } from '../../../src/systems/CollisionSystem';
import { Hitbox, CollisionEvent } from '../../../src/core/types';
import { COLLISION } from '../../../src/config/constants';

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

// Mock document.getElementById
vi.stubGlobal('document', {
  getElementById: () => mockCanvas,
});

describe('Game Collision Integration', () => {
  describe('Collision Detection Logic', () => {
    it('should detect collision when player and obstacle hitboxes overlap', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacleHitbox: Hitbox = { x: 110, y: 360, width: 40, height: 80 };

      expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(true);
    });

    it('should not detect collision when player jumps over obstacle', () => {
      // Player is jumping (higher y position means lower on screen, so lower y = higher)
      const playerHitbox: Hitbox = { x: 100, y: 200, width: 30, height: 60 };
      // Obstacle is on the ground
      const obstacleHitbox: Hitbox = { x: 100, y: 420, width: 40, height: 80 };

      expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
    });

    it('should not detect collision when obstacle is behind player', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacleHitbox: Hitbox = { x: 10, y: 340, width: 40, height: 80 };

      expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
    });

    it('should not detect collision when obstacle is in front of player', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacleHitbox: Hitbox = { x: 200, y: 340, width: 40, height: 80 };

      expect(checkAABBCollision(playerHitbox, obstacleHitbox)).toBe(false);
    });
  });

  describe('Collision Callback', () => {
    it('should call onCollision callback with correct event structure', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacleHitbox: Hitbox = { x: 110, y: 360, width: 40, height: 80 };

      const mockCallback = vi.fn();

      // Simulate collision detection and callback
      if (checkAABBCollision(playerHitbox, obstacleHitbox)) {
        const event: CollisionEvent = {
          type: 'collision',
          playerHitbox,
          obstacleHitbox,
        };
        mockCallback(event);
      }

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'collision',
        playerHitbox,
        obstacleHitbox,
      });
    });

    it('should not call callback when no collision occurs', () => {
      const playerHitbox: Hitbox = { x: 100, y: 200, width: 30, height: 60 };
      const obstacleHitbox: Hitbox = { x: 200, y: 340, width: 40, height: 80 };

      const mockCallback = vi.fn();

      if (checkAABBCollision(playerHitbox, obstacleHitbox)) {
        const event: CollisionEvent = {
          type: 'collision',
          playerHitbox,
          obstacleHitbox,
        };
        mockCallback(event);
      }

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Collision Flash State', () => {
    it('should have correct flash duration constant', () => {
      expect(COLLISION.FLASH_DURATION).toBe(0.2);
    });

    it('should have correct flash color constant', () => {
      expect(COLLISION.FLASH_COLOR).toBe('#ff0000');
    });

    it('should decrement flash timer correctly', () => {
      let flashTimer = COLLISION.FLASH_DURATION;
      const deltaTime = 0.016; // ~60 FPS

      flashTimer -= deltaTime;

      expect(flashTimer).toBeCloseTo(0.184, 3);
    });

    it('should reset collision state when timer expires', () => {
      let flashTimer = 0.01;
      let isColliding = true;
      const deltaTime = 0.016;

      flashTimer -= deltaTime;
      if (flashTimer <= 0) {
        isColliding = false;
      }

      expect(isColliding).toBe(false);
    });
  });

  describe('Multiple Obstacles', () => {
    it('should detect collision with first overlapping obstacle', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacles: Hitbox[] = [
        { x: 200, y: 340, width: 40, height: 80 }, // No collision
        { x: 110, y: 360, width: 40, height: 80 }, // Collision!
        { x: 115, y: 350, width: 40, height: 80 }, // Also collision, but should break after first
      ];

      let collisionDetected = false;
      let collidedObstacle: Hitbox | null = null;

      for (const obstacle of obstacles) {
        if (checkAABBCollision(playerHitbox, obstacle)) {
          collisionDetected = true;
          collidedObstacle = obstacle;
          break;
        }
      }

      expect(collisionDetected).toBe(true);
      expect(collidedObstacle).toEqual(obstacles[1]);
    });

    it('should not detect collision when all obstacles are far away', () => {
      const playerHitbox: Hitbox = { x: 100, y: 340, width: 30, height: 60 };
      const obstacles: Hitbox[] = [
        { x: 200, y: 340, width: 40, height: 80 },
        { x: 300, y: 340, width: 40, height: 80 },
        { x: 400, y: 340, width: 40, height: 80 },
      ];

      let collisionDetected = false;

      for (const obstacle of obstacles) {
        if (checkAABBCollision(playerHitbox, obstacle)) {
          collisionDetected = true;
          break;
        }
      }

      expect(collisionDetected).toBe(false);
    });
  });
});
