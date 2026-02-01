/**
 * Animation Controller
 * Manages frame-based sprite animation with state transitions,
 * looping/one-shot modes, and speed adaptation.
 */

import { PlayerState } from '../entities/Player';
import { SPRITE_FRAME_COUNTS } from './SpriteGenerator';

export type AnimationName = 'idle' | 'run' | 'jump' | 'fall' | 'land';

interface AnimationDef {
  name: AnimationName;
  frameCount: number;
  duration: number; // Total duration in seconds
  loop: boolean;
  holdLastFrame: boolean; // If true, stay on last frame after finishing
}

const ANIMATIONS: Record<AnimationName, AnimationDef> = {
  idle: {
    name: 'idle',
    frameCount: SPRITE_FRAME_COUNTS.idle,
    duration: 0.8,
    loop: true,
    holdLastFrame: false,
  },
  run: {
    name: 'run',
    frameCount: SPRITE_FRAME_COUNTS.run,
    duration: 0.2, // Base duration, scaled by game speed
    loop: true,
    holdLastFrame: false,
  },
  jump: {
    name: 'jump',
    frameCount: SPRITE_FRAME_COUNTS.jump,
    duration: 0.15,
    loop: false,
    holdLastFrame: true,
  },
  fall: {
    name: 'fall',
    frameCount: SPRITE_FRAME_COUNTS.fall,
    duration: 0.15,
    loop: false,
    holdLastFrame: true,
  },
  land: {
    name: 'land',
    frameCount: SPRITE_FRAME_COUNTS.land,
    duration: 0.1,
    loop: false,
    holdLastFrame: false,
  },
};

export class AnimationController {
  private current: AnimationName = 'run';
  private timer: number = 0;
  private finished: boolean = false;
  private speedMultiplier: number = 1;

  getState(): { sheetKey: AnimationName; frameIndex: number } {
    const anim = ANIMATIONS[this.current];
    const effectiveDuration = this.getEffectiveDuration(anim);

    if (this.finished && anim.holdLastFrame) {
      return { sheetKey: this.current, frameIndex: anim.frameCount - 1 };
    }

    if (this.finished && !anim.loop) {
      return { sheetKey: this.current, frameIndex: anim.frameCount - 1 };
    }

    const progress = anim.loop
      ? (this.timer % effectiveDuration) / effectiveDuration
      : Math.min(this.timer / effectiveDuration, 1);

    const frameIndex = Math.min(
      Math.floor(progress * anim.frameCount),
      anim.frameCount - 1,
    );

    return { sheetKey: this.current, frameIndex };
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.speedMultiplier = gameSpeed;

    if (this.finished) return;

    this.timer += deltaTime;

    const anim = ANIMATIONS[this.current];
    const effectiveDuration = this.getEffectiveDuration(anim);

    if (!anim.loop && this.timer >= effectiveDuration) {
      this.finished = true;
    }
  }

  setState(playerState: PlayerState): void {
    const targetAnim = this.mapStateToAnimation(playerState);

    if (targetAnim !== this.current) {
      this.current = targetAnim;
      this.timer = 0;
      this.finished = false;
    }
  }

  isFinished(): boolean {
    return this.finished;
  }

  getCurrentAnimation(): AnimationName {
    return this.current;
  }

  private mapStateToAnimation(state: PlayerState): AnimationName {
    switch (state) {
      case 'idle':
        return 'run';
      case 'jumping':
        return 'jump';
      case 'falling':
        return 'fall';
      case 'landing':
        return 'land';
      default:
        return 'run';
    }
  }

  private getEffectiveDuration(anim: AnimationDef): number {
    // Only scale run animation with game speed
    if (anim.name === 'run' && this.speedMultiplier > 0) {
      return anim.duration / this.speedMultiplier;
    }
    return anim.duration;
  }
}
