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

export const SCROLL = {
  SPEED: 300,
  GROUND_MARK_WIDTH: 3,
  GROUND_MARK_GAP: 60,
  DECORATION_COUNT: 10,
} as const;

export const OBSTACLE = {
  MIN_WIDTH: 30,
  MAX_WIDTH: 50,
  MIN_HEIGHT: 40,
  MAX_HEIGHT: 90,
  MIN_SPAWN_INTERVAL: 1.5,
  MAX_SPAWN_INTERVAL: 3.0,
  COLOR: '#ff4757',
  SPAWN_MARGIN: 50,
} as const;

export const COLLISION = {
  FLASH_DURATION: 0.2,
  FLASH_COLOR: '#ff0000',
} as const;

export const DIFFICULTY = {
  // Initial (easy) spawn intervals in seconds
  INITIAL_MIN_INTERVAL: 2.0,
  INITIAL_MAX_INTERVAL: 3.5,
  // Final (hard) spawn intervals in seconds
  FINAL_MIN_INTERVAL: 0.8,
  FINAL_MAX_INTERVAL: 1.5,
  // Time to reach maximum difficulty in seconds
  PLATEAU_TIME: 60,
} as const;
