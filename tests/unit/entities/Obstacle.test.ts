import { describe, it, expect } from 'vitest';
import { Obstacle } from '../../../src/entities/Obstacle';
import { SCROLL, OBSTACLE, OBSTACLE_TYPES } from '../../../src/config/constants';

describe('Obstacle', () => {
  const GROUND_Y = 500;
  const START_X = 800;

  describe('initialization', () => {
    it('should create obstacle at correct position', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const pos = obstacle.getPosition();

      expect(pos.x).toBe(START_X);
      expect(pos.y).toBe(GROUND_Y - OBSTACLE_TYPES.trashCan.height);
    });

    it('should have correct dimensions based on type', () => {
      const trashCan = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const cone = new Obstacle(START_X, GROUND_Y, 'cone');
      const car = new Obstacle(START_X, GROUND_Y, 'car');

      expect(trashCan.getWidth()).toBe(OBSTACLE_TYPES.trashCan.width);
      expect(trashCan.getHeight()).toBe(OBSTACLE_TYPES.trashCan.height);

      expect(cone.getWidth()).toBe(OBSTACLE_TYPES.cone.width);
      expect(cone.getHeight()).toBe(OBSTACLE_TYPES.cone.height);

      expect(car.getWidth()).toBe(OBSTACLE_TYPES.car.width);
      expect(car.getHeight()).toBe(OBSTACLE_TYPES.car.height);
    });

    it('should be active by default', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');

      expect(obstacle.isActive()).toBe(true);
    });

    it('should store the obstacle type', () => {
      const trashCan = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const cone = new Obstacle(START_X, GROUND_Y, 'cone');
      const car = new Obstacle(START_X, GROUND_Y, 'car');

      expect(trashCan.getType()).toBe('trashCan');
      expect(cone.getType()).toBe('cone');
      expect(car.getType()).toBe('car');
    });
  });

  describe('movement', () => {
    it('should move left based on deltaTime', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const deltaTime = 0.016;

      obstacle.update(deltaTime);
      const pos = obstacle.getPosition();

      expect(pos.x).toBeCloseTo(START_X - SCROLL.SPEED * deltaTime, 2);
    });

    it('should move at same speed as scrolling background', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');

      // Simulate 1 second
      for (let i = 0; i < 60; i++) {
        obstacle.update(1 / 60);
      }
      const pos = obstacle.getPosition();

      expect(pos.x).toBeCloseTo(START_X - SCROLL.SPEED, 1);
    });

    it('should maintain consistent speed regardless of frame rate', () => {
      const obstacle60fps = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const obstacle30fps = new Obstacle(START_X, GROUND_Y, 'trashCan');

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
      const obstacle = new Obstacle(0, GROUND_Y, 'trashCan');

      // Move obstacle off screen
      obstacle.update(1); // 1 second should be enough

      expect(obstacle.isActive()).toBe(false);
    });

    it('should remain active while on screen', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');

      obstacle.update(0.5); // Half second

      expect(obstacle.isActive()).toBe(true);
    });
  });

  describe('hitbox', () => {
    it('should return correct world-space hitbox', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const hitbox = obstacle.getHitbox();

      expect(hitbox.x).toBe(START_X);
      expect(hitbox.y).toBe(GROUND_Y - OBSTACLE_TYPES.trashCan.height);
      expect(hitbox.width).toBe(OBSTACLE_TYPES.trashCan.width);
      expect(hitbox.height).toBe(OBSTACLE_TYPES.trashCan.height);
    });

    it('should update hitbox position after movement', () => {
      const obstacle = new Obstacle(START_X, GROUND_Y, 'trashCan');
      obstacle.update(0.1);

      const hitbox = obstacle.getHitbox();
      const pos = obstacle.getPosition();

      expect(hitbox.x).toBe(pos.x);
    });

    it('should have different hitbox sizes for different types', () => {
      const trashCan = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const car = new Obstacle(START_X, GROUND_Y, 'car');

      const trashCanHitbox = trashCan.getHitbox();
      const carHitbox = car.getHitbox();

      expect(carHitbox.width).toBeGreaterThan(trashCanHitbox.width);
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

  describe('obstacle categories', () => {
    it('should have ground category for ground obstacles', () => {
      const trashCan = new Obstacle(START_X, GROUND_Y, 'trashCan');
      const cone = new Obstacle(START_X, GROUND_Y, 'cone');
      const car = new Obstacle(START_X, GROUND_Y, 'car');

      expect(trashCan.getCategory()).toBe('ground');
      expect(cone.getCategory()).toBe('ground');
      expect(car.getCategory()).toBe('ground');
    });

    it('should have aerial category for streetlight', () => {
      const streetlight = new Obstacle(START_X, GROUND_Y, 'streetlight');

      expect(streetlight.getCategory()).toBe('aerial');
    });
  });

  describe('streetlight', () => {
    it('should have correct dimensions', () => {
      const streetlight = new Obstacle(START_X, GROUND_Y, 'streetlight');

      expect(streetlight.getWidth()).toBe(OBSTACLE_TYPES.streetlight.width);
      expect(streetlight.getHeight()).toBe(OBSTACLE_TYPES.streetlight.height);
    });

    it('should have hitbox only on top part', () => {
      const streetlight = new Obstacle(START_X, GROUND_Y, 'streetlight');
      const hitbox = streetlight.getHitbox();

      // Hitbox should be at the top (y = position.y)
      expect(hitbox.height).toBe(OBSTACLE_TYPES.streetlight.hitboxHeight);
      expect(hitbox.width).toBe(OBSTACLE_TYPES.streetlight.hitboxWidth);
    });

    it('should have centered hitbox for lamp part', () => {
      const streetlight = new Obstacle(START_X, GROUND_Y, 'streetlight');
      const hitbox = streetlight.getHitbox();
      const pos = streetlight.getPosition();

      // Hitbox should be centered on the pole
      const expectedOffset = -(OBSTACLE_TYPES.streetlight.hitboxWidth - OBSTACLE_TYPES.streetlight.width) / 2;
      expect(hitbox.x).toBe(pos.x + expectedOffset);
    });

    it('should store streetlight type', () => {
      const streetlight = new Obstacle(START_X, GROUND_Y, 'streetlight');

      expect(streetlight.getType()).toBe('streetlight');
    });
  });

  describe('sign', () => {
    it('should have aerial category', () => {
      const sign = new Obstacle(START_X, GROUND_Y, 'sign');

      expect(sign.getCategory()).toBe('aerial');
    });

    it('should have correct dimensions', () => {
      const sign = new Obstacle(START_X, GROUND_Y, 'sign');

      expect(sign.getWidth()).toBe(OBSTACLE_TYPES.sign.width);
      expect(sign.getHeight()).toBe(OBSTACLE_TYPES.sign.height);
    });

    it('should have hitbox only on sign part', () => {
      const sign = new Obstacle(START_X, GROUND_Y, 'sign');
      const hitbox = sign.getHitbox();

      expect(hitbox.height).toBe(OBSTACLE_TYPES.sign.hitboxHeight);
      expect(hitbox.width).toBe(OBSTACLE_TYPES.sign.hitboxWidth);
    });
  });

  describe('shopSign', () => {
    it('should have aerial category', () => {
      const shopSign = new Obstacle(START_X, GROUND_Y, 'shopSign');

      expect(shopSign.getCategory()).toBe('aerial');
    });

    it('should have correct dimensions', () => {
      const shopSign = new Obstacle(START_X, GROUND_Y, 'shopSign');

      expect(shopSign.getWidth()).toBe(OBSTACLE_TYPES.shopSign.width);
      expect(shopSign.getHeight()).toBe(OBSTACLE_TYPES.shopSign.height);
    });

    it('should have hitbox only on sign part', () => {
      const shopSign = new Obstacle(START_X, GROUND_Y, 'shopSign');
      const hitbox = shopSign.getHitbox();

      expect(hitbox.height).toBe(OBSTACLE_TYPES.shopSign.hitboxHeight);
      expect(hitbox.width).toBe(OBSTACLE_TYPES.shopSign.hitboxWidth);
    });
  });
});
