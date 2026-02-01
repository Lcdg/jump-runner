/**
 * Player Skin Interface & Types
 * Defines the contract for rendering player characters
 */

import { PlayerState } from '../entities/Player';
import { Position } from '../core/types';

export interface SquashFactor {
  scaleX: number;
  scaleY: number;
}

export interface AnimationData {
  state: PlayerState;
  runPhase: number;
  squashFactor: SquashFactor;
  isColliding: boolean;
  groundY: number;
  velocity: { x: number; y: number };
  deltaTime: number;
  gameSpeed: number;
}

export interface PlayerSkin {
  init(): Promise<void>;
  render(
    ctx: CanvasRenderingContext2D,
    position: Position,
    animationData: AnimationData,
  ): void;
  getName(): string;
  getThumbnail(): HTMLCanvasElement | null;
}
