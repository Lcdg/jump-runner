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
  GROUND_Y_PERCENT: 0.8,
  PLAYER_X_PERCENT: 0.15,
} as const;

export const COLORS = {
  SKY: '#1a1a2e',
  GROUND: '#16213e',
  FPS_TEXT: '#ffffff',
} as const;

export const DEBUG = {
  SHOW_FPS: true,
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
