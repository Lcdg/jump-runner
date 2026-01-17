/**
 * Base Entity Class
 * Abstract class for all game entities
 */

import { Position, Velocity, Hitbox } from '../core/types';

export abstract class Entity {
  protected position: Position;
  protected velocity: Velocity;
  protected hitbox: Hitbox;
  protected active: boolean = true;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.hitbox = this.createHitbox();
  }

  protected abstract createHitbox(): Hitbox;
  abstract update(deltaTime: number): void;

  getHitbox(): Hitbox {
    return {
      x: this.position.x + this.hitbox.x,
      y: this.position.y + this.hitbox.y,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  getPosition(): Position {
    return { ...this.position };
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }
}
