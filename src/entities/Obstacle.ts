/**
 * Obstacle Entity
 * Obstacles that the player must avoid
 */

import { Entity } from './Entity';
import { Hitbox } from '../core/types';
import { SCROLL } from '../config/constants';

export class Obstacle extends Entity {
  private width: number;
  private height: number;

  constructor(x: number, groundY: number, width: number, height: number) {
    super(x, groundY - height);
    this.width = width;
    this.height = height;
    this.velocity.x = -SCROLL.SPEED;
    // Re-create hitbox now that dimensions are set
    this.hitbox = this.createHitbox();
  }

  protected createHitbox(): Hitbox {
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
}
