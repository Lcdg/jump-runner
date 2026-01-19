/**
 * Player Entity
 * The playable character with jump mechanics
 */

import { Entity } from './Entity';
import { Hitbox } from '../core/types';
import { PLAYER, PHYSICS } from '../config/constants';

export type PlayerState = 'idle' | 'jumping' | 'falling' | 'landing';

export class Player extends Entity {
  private state: PlayerState = 'idle';
  private groundY: number;
  private jumpHoldTime: number = 0;
  private isHoldingJump: boolean = false;
  private runAnimationTimer: number = 0;
  private squashTimer: number = 0;

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
    } else if (this.state === 'landing') {
      // Update squash timer
      this.squashTimer -= deltaTime;
      if (this.squashTimer <= 0) {
        this.squashTimer = 0;
        this.state = 'idle';
      }
    } else if (this.state === 'idle') {
      // Update run animation timer when on ground
      this.runAnimationTimer += deltaTime;
    }
  }

  jump(): void {
    if (this.state === 'idle' || this.state === 'landing') {
      this.velocity.y = PHYSICS.MIN_JUMP_VELOCITY;
      this.state = 'jumping';
      this.isHoldingJump = true;
      this.jumpHoldTime = 0;
      this.squashTimer = 0;
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
    this.state = 'landing';
    this.squashTimer = PLAYER.SQUASH_DURATION;
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
    this.runAnimationTimer = 0;
    this.squashTimer = 0;
  }

  isJumpHeld(): boolean {
    return this.isHoldingJump;
  }

  /**
   * Get the current run animation phase (0 to 1)
   * Used for leg animation: sin(phase * 2π) gives leg offset
   */
  getRunAnimationPhase(): number {
    if (this.state !== 'idle') {
      return 0; // No animation when jumping/falling/landing
    }
    return (this.runAnimationTimer % PLAYER.RUN_CYCLE_DURATION) / PLAYER.RUN_CYCLE_DURATION;
  }

  /**
   * Get the current squash factor for landing animation
   * Returns { scaleX, scaleY } where 1.0 = normal size
   */
  getSquashFactor(): { scaleX: number; scaleY: number } {
    if (this.state !== 'landing' || this.squashTimer <= 0) {
      return { scaleX: 1, scaleY: 1 };
    }

    // Progress from 0 (just landed) to 1 (animation done)
    const progress = 1 - this.squashTimer / PLAYER.SQUASH_DURATION;

    // Interpolate from squashed to normal
    const scaleY = PLAYER.SQUASH_SCALE_Y + (1 - PLAYER.SQUASH_SCALE_Y) * progress;
    const scaleX = PLAYER.SQUASH_SCALE_X + (1 - PLAYER.SQUASH_SCALE_X) * progress;

    return { scaleX, scaleY };
  }
}
