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
  GROUND_LINE: '#0f3460',
  FPS_TEXT: '#ffffff',
  PLAYER_BODY: '#e94560',
  PLAYER_HEAD: '#ff6b6b',
} as const;

export const DEBUG = {
  SHOW_FPS: true,
} as const;

export const PHYSICS = {
  GRAVITY: 1800,
  MIN_JUMP_VELOCITY: -400,
  MAX_JUMP_VELOCITY: -700,
  JUMP_HOLD_FORCE: 2800,
  MAX_JUMP_HOLD_TIME: 180,
} as const;

export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 60,
  HEAD_RADIUS: 15,
  HITBOX_OFFSET_X: 5,
  HITBOX_OFFSET_Y: 0,
  HITBOX_WIDTH: 30,
  HITBOX_HEIGHT: 60,
} as const;
