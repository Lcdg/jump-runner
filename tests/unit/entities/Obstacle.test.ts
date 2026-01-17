import { describe, it, expect } from 'vitest';
import { Obstacle } from '../../../src/entities/Obstacle';
import { SCROLL, OBSTACLE } from '../../../src/config/constants';

describe('Obstacle', () => {
  const GROUND_Y = 500;
  const TEST_WIDTH = 40;
  const TEST_HEIGHT = 60;
  const START_X = 800;

  describe('initialization', () => {
    it('should create obstacle at correct position', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);
      const pos = obstacle.getPosition();

      expect(pos.x).toBe(START_X);
      expect(pos.y).toBe(GROUND_Y - TEST_HEIGHT);
    });

    it('should have correct dimensions', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      expect(obstacle.getWidth()).toBe(TEST_WIDTH);
      expect(obstacle.getHeight()).toBe(TEST_HEIGHT);
    });

    it('should be active by default', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      expect(obstacle.isActive()).toBe(true);
    });
  });

  describe('movement', () => {
    it('should move left based on deltaTime', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);
      const deltaTime = 0.016;

      obstacle.update(deltaTime);
      const pos = obstacle.getPosition();

      expect(pos.x).toBeCloseTo(START_X - SCROLL.SPEED * deltaTime, 2);
    });

    it('should move at same speed as scrolling background', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      // Simulate 1 second
      for (let i = 0; i < 60; i++) {
        obstacle.update(1 / 60);
      }
      const pos = obstacle.getPosition();

      expect(pos.x).toBeCloseTo(START_X - SCROLL.SPEED, 1);
    });

    it('should maintain consistent speed regardless of frame rate', () => {
      const obstacle60fps = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);
      const obstacle30fps = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      // 60 FPS for 1 second
      for (let i = 0; i < 60; i++) {
        obstacle60fps.update(1 / 60);
      }

      // 30 FPS for 1 second
      for (let i = 0; i < 30; i++) {
        obstacle30fps.update(1 / 30);
      }

      expect(obstacle60fps.getPosition().x).toBeCloseTo(obstacle30fps.getPosition().x, 1);
    });
  });

  describe('deactivation', () => {
    it('should deactivate when exiting screen left', () => {
      const obstacle = new Obstacle(0, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      // Move obstacle off screen
      obstacle.update(1); // 1 second should be enough

      expect(obstacle.isActive()).toBe(false);
    });

    it('should remain active while on screen', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);

      obstacle.update(0.5); // Half second

      expect(obstacle.isActive()).toBe(true);
    });
  });

  describe('hitbox', () => {
    it('should return correct world-space hitbox', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);
      const hitbox = obstacle.getHitbox();

      expect(hitbox.x).toBe(START_X);
      expect(hitbox.y).toBe(GROUND_Y - TEST_HEIGHT);
      expect(hitbox.width).toBe(TEST_WIDTH);
      expect(hitbox.height).toBe(TEST_HEIGHT);
    });

    it('should update hitbox position after movement', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, TEST_WIDTH, TEST_HEIGHT);
      obstacle.update(0.1);

      const hitbox = obstacle.getHitbox();
      const pos = obstacle.getPosition();

      expect(hitbox.x).toBe(pos.x);
    });
  });

  describe('constants', () => {
    it('should have valid obstacle dimension ranges', () => {
      expect(OBSTACLE.MIN_WIDTH).toBeGreaterThan(0);
      expect(OBSTACLE.MAX_WIDTH).toBeGreaterThan(OBSTACLE.MIN_WIDTH);
      expect(OBSTACLE.MIN_HEIGHT).toBeGreaterThan(0);
      expect(OBSTACLE.MAX_HEIGHT).toBeGreaterThan(OBSTACLE.MIN_HEIGHT);
    });

    it('should have valid spawn interval ranges', () => {
      expect(OBSTACLE.MIN_SPAWN_INTERVAL).toBeGreaterThan(0);
      expect(OBSTACLE.MAX_SPAWN_INTERVAL).toBeGreaterThan(OBSTACLE.MIN_SPAWN_INTERVAL);
    });
  });
});
