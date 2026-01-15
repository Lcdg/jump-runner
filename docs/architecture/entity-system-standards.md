# Entity & System Standards

## Entity Base Class

```typescript
// src/entities/Entity.ts

import { Hitbox, Position, Velocity } from '../core/types';

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
```

## Player Entity

```typescript
// src/entities/Player.ts

import { Entity } from './Entity';
import { Hitbox } from '../core/types';
import { PLAYER, PHYSICS } from '../config/constants';

export type PlayerState = 'idle' | 'jumping' | 'falling';

export class Player extends Entity {
  private state: PlayerState = 'idle';
  private isJumpHeld: boolean = false;
  private jumpTime: number = 0;

  constructor(groundY: number) {
    super(PLAYER.START_X, groundY - PLAYER.HEIGHT);
  }

  protected createHitbox(): Hitbox {
    return {
      x: PLAYER.HITBOX_OFFSET_X,
      y: PLAYER.HITBOX_OFFSET_Y,
      width: PLAYER.HITBOX_WIDTH,
      height: PLAYER.HITBOX_HEIGHT,
    };
  }

  update(deltaTime: number): void {
    if (this.state === 'jumping' || this.state === 'falling') {
      this.velocity.y += PHYSICS.GRAVITY * deltaTime;
      this.position.y += this.velocity.y * deltaTime;

      if (this.position.y >= this.getGroundY()) {
        this.land();
      }
    }

    if (this.state === 'jumping' && this.isJumpHeld) {
      this.jumpTime += deltaTime;
      if (this.jumpTime >= PHYSICS.MAX_JUMP_TIME) {
        this.state = 'falling';
      }
    }
  }

  jump(): void {
    if (this.state === 'idle') {
      this.velocity.y = PHYSICS.JUMP_VELOCITY;
      this.state = 'jumping';
      this.isJumpHeld = true;
      this.jumpTime = 0;
    }
  }

  releaseJump(): void {
    this.isJumpHeld = false;
    if (this.state === 'jumping') {
      if (this.velocity.y < 0) {
        this.velocity.y *= PHYSICS.JUMP_CUT_MULTIPLIER;
      }
      this.state = 'falling';
    }
  }

  private land(): void {
    this.position.y = this.getGroundY();
    this.velocity.y = 0;
    this.state = 'idle';
  }

  private getGroundY(): number {
    return PLAYER.GROUND_Y - PLAYER.HEIGHT;
  }

  getState(): PlayerState {
    return this.state;
  }

  reset(groundY: number): void {
    this.position = { x: PLAYER.START_X, y: groundY - PLAYER.HEIGHT };
    this.velocity = { x: 0, y: 0 };
    this.state = 'idle';
    this.active = true;
  }
}
```

## System Template (Collision)

```typescript
// src/systems/CollisionSystem.ts

import { Hitbox } from '../core/types';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';

export class CollisionSystem {
  static checkAABB(a: Hitbox, b: Hitbox): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static checkPlayerObstacleCollision(
    player: Player,
    obstacles: Obstacle[]
  ): Obstacle | null {
    const playerHitbox = player.getHitbox();

    for (const obstacle of obstacles) {
      if (!obstacle.isActive()) continue;
      if (this.checkAABB(playerHitbox, obstacle.getHitbox())) {
        return obstacle;
      }
    }

    return null;
  }
}
```

---
