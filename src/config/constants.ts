/**
 * Game Constants
 * All gameplay values are centralized here
 */

export const GAME = {
  TITLE: 'Jump Runner',
  VERSION: '0.1.0',
} as const;

export const CANVAS = {
  BACKGROUND_COLOR: '#1a1a2e',
} as const;

export const PHYSICS = {
  GRAVITY: 0.5,
  JUMP_VELOCITY: -12,
  MAX_JUMP_HOLD_TIME: 200,
} as const;

export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 60,
  X_POSITION: 100,
  COLOR: '#e94560',
} as const;
