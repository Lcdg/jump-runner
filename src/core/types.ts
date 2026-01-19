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

export type ObstacleType = 'trashCan' | 'cone' | 'car' | 'streetlight' | 'sign' | 'shopSign';

export type ObstacleCategory = 'ground' | 'aerial';

export type InputAction =
  | { type: 'jump_start' }
  | { type: 'jump_end' }
  | { type: 'start_game' };

export interface GroundMark {
  x: number;
}

export interface Crosswalk {
  x: number;
}

export interface Tree {
  x: number;
  trunkWidth: number;
  trunkHeight: number;
}

export interface BuildingWindow {
  x: number; // Position relative to building
  y: number;
}

export interface Building {
  x: number;
  width: number;
  height: number;
  windows: BuildingWindow[];
}

export interface CollisionEvent {
  type: 'collision';
  playerHitbox: Hitbox;
  obstacleHitbox: Hitbox;
}

export type CollisionCallback = (event: CollisionEvent) => void;
