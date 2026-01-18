/**
 * Game Constants
 * All gameplay values are centralized here
 */

export const GAME = {
  TITLE: 'Jump Runner',
  VERSION: '0.1.0',
} as const;

export const CANVAS = {
  BACKGROUND_COLOR: '#0D1B2A',
  GROUND_Y_PERCENT: 0.85, // Adjusted per front-end-spec (85%)
  PLAYER_X_PERCENT: 0.2, // Adjusted per front-end-spec (20%)
} as const;

// Night City Theme Colors (from front-end-spec.md)
export const COLORS = {
  // Background
  SKY: '#0D1B2A', // Bleu nuit profond
  BUILDING: '#1B263B', // Gris anthracite (immeubles)
  WINDOW: '#FFD60A', // Jaune chaud (fenêtres éclairées)

  // Ground
  GROUND: '#415A77', // Gris béton (trottoir)
  GROUND_LINE: '#E0E1DD', // Blanc cassé (passages piétons)

  // Player
  PLAYER_BODY: '#FF6B35', // Orange vif
  PLAYER_HEAD: '#FF8C42', // Orange clair

  // UI
  FPS_TEXT: '#ffffff',
  SCORE: '#FFFFFF', // Blanc pur
  OVERLAY_BG: '#000000CC', // Noir 80% opacité
  GAME_OVER: '#E63946', // Rouge erreur

  // Decorations
  STREETLIGHT_POLE: '#415A77',
  STREETLIGHT_HALO: '#FFF3B0', // Jaune doux
} as const;

// Obstacle Colors (from front-end-spec.md)
export const OBSTACLE_COLORS = {
  // Current default (will be replaced by specific types)
  DEFAULT: '#9B2335',

  // Ground obstacles
  TRASH_CAN: '#386641', // Vert foncé
  TRASH_CAN_LID: '#2D4A30',
  CONE: '#FF9F1C', // Orange signalisation
  CONE_STRIPES: '#FFFFFF',
  BENCH: '#5C4033', // Bois
  BOLLARD: '#778DA9', // Gris

  // Car
  CAR_RED: '#9B2335', // Rouge brique
  CAR_BLUE: '#3D5A80', // Bleu acier
  CAR_WHEELS: '#1B1B1B', // Noir
  CAR_HEADLIGHTS: '#FFEA00', // Jaune vif
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
  COLOR: '#9B2335', // Rouge brique (default, from OBSTACLE_COLORS)
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

export const AUTO_PLAYER = {
  // Distance (pixels) at which AI decides to jump
  JUMP_THRESHOLD: 150,
  // Small chance to miss a jump (for imperfection)
  MISS_CHANCE: 0.02,
  // How long AI holds the jump button (seconds) for higher jumps
  JUMP_HOLD_DURATION: 0.15,
} as const;

export const UI = {
  OVERLAY_FONT: '32px Arial',
  OVERLAY_COLOR: '#ffffff',
  OVERLAY_SHADOW_COLOR: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_SHADOW_BLUR: 4,
} as const;

export const SCORE = {
  POINTS_PER_SECOND: 10,
  FONT: '24px Arial',
  COLOR: '#ffffff',
  PADDING: 20,
} as const;
