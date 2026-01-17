/**
 * Core TypeScript Interfaces
 */

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Hitbox extends Position, Dimensions {}

export type GameStateType = 'attract' | 'playing' | 'gameOver';

export type InputAction =
  | { type: 'jump_start' }
  | { type: 'jump_end' }
  | { type: 'start_game' };
