/**
 * Obstacle Entity
 * Obstacles that the player must avoid
 */

import { Entity } from './Entity';
import { Hitbox, ObstacleType, ObstacleCategory } from '../core/types';
import { SCROLL, OBSTACLE_TYPES } from '../config/constants';

export class Obstacle extends Entity {
  private width: number;
  private height: number;
  private obstacleType: ObstacleType;
  private category: ObstacleCategory;

  constructor(x: number, groundY: number, obstacleType: ObstacleType) {
    const typeConfig = OBSTACLE_TYPES[obstacleType];
    super(x, groundY - typeConfig.height);
    this.width = typeConfig.width;
    this.height = typeConfig.height;
    this.obstacleType = obstacleType;
    this.category = typeConfig.category;
    this.velocity.x = -SCROLL.SPEED;
    // Re-create hitbox now that dimensions are set
    this.hitbox = this.createHitbox();
  }

  protected createHitbox(): Hitbox {
    // Special hitbox for aerial obstacles (only top part)
    if (this.obstacleType === 'streetlight') {
      const config = OBSTACLE_TYPES.streetlight;
      return {
        x: -(config.hitboxWidth - this.width) / 2,
        y: 0,
        width: config.hitboxWidth,
        height: config.hitboxHeight,
      };
    }

    if (this.obstacleType === 'sign') {
      const config = OBSTACLE_TYPES.sign;
      return {
        x: -(config.hitboxWidth - this.width) / 2,
        y: 0,
        width: config.hitboxWidth,
        height: config.hitboxHeight,
      };
    }

    if (this.obstacleType === 'shopSign') {
      const config = OBSTACLE_TYPES.shopSign;
      return {
        x: -(config.hitboxWidth - this.width) / 2,
        y: 0,
        width: config.hitboxWidth,
        height: config.hitboxHeight,
      };
    }

    // Default hitbox for ground obstacles
    return {
      x: 0,
      y: 0,
      width: this.width || 0,
      height: this.height || 0,
    };
  }

  update(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;

    if (this.position.x < -this.width) {
      this.active = false;
    }
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getType(): ObstacleType {
    return this.obstacleType;
  }

  getCategory(): ObstacleCategory {
    return this.category;
  }
}
