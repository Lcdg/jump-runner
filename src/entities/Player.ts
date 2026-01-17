/**
 * Player Entity
 * The playable character with jump mechanics
 */

import { Entity } from './Entity';
import { Hitbox } from '../core/types';
import { PLAYER, PHYSICS } from '../config/constants';

export type PlayerState = 'idle' | 'jumping' | 'falling';

export class Player extends Entity {
  private state: PlayerState = 'idle';
  private groundY: number;
  private jumpHoldTime: number = 0;
  private isHoldingJump: boolean = false;

  constructor(groundY: number) {
    const startX = 100;
    super(startX, groundY - PLAYER.HEIGHT);
    this.groundY = groundY;
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

      if (this.velocity.y > 0 && this.state === 'jumping') {
        this.state = 'falling';
      }

      if (this.position.y >= this.groundY - PLAYER.HEIGHT) {
        this.land();
      }
    }
  }

  jump(): void {
    if (this.state === 'idle') {
      this.velocity.y = PHYSICS.MIN_JUMP_VELOCITY;
      this.state = 'jumping';
      this.isHoldingJump = true;
      this.jumpHoldTime = 0;
    }
  }

  holdJump(deltaTime: number): void {
    if (this.state === 'jumping' && this.isHoldingJump) {
      const holdTimeMs = this.jumpHoldTime * 1000;
      if (holdTimeMs < PHYSICS.MAX_JUMP_HOLD_TIME) {
        this.velocity.y -= PHYSICS.JUMP_HOLD_FORCE * deltaTime;
        this.jumpHoldTime += deltaTime;

        if (this.velocity.y < PHYSICS.MAX_JUMP_VELOCITY) {
          this.velocity.y = PHYSICS.MAX_JUMP_VELOCITY;
        }
      }
    }
  }

  releaseJump(): void {
    this.isHoldingJump = false;
  }

  private land(): void {
    this.position.y = this.groundY - PLAYER.HEIGHT;
    this.velocity.y = 0;
    this.state = 'idle';
  }

  getState(): PlayerState {
    return this.state;
  }

  getVelocity(): { x: number; y: number } {
    return { ...this.velocity };
  }

  reset(groundY: number): void {
    this.groundY = groundY;
    this.position = { x: 100, y: groundY - PLAYER.HEIGHT };
    this.velocity = { x: 0, y: 0 };
    this.state = 'idle';
    this.active = true;
    this.jumpHoldTime = 0;
    this.isHoldingJump = false;
  }

  isJumpHeld(): boolean {
    return this.isHoldingJump;
  }
}
