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

export interface Entity {
  position: Position;
  velocity: Velocity;
  dimensions: Dimensions;
}

export type GameStateType = 'attract' | 'playing' | 'gameOver';
