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

  // Trees (background decoration)
  TREE_TRUNK: '#3D2817', // Brun foncé
  TREE_FOLIAGE: '#2D4A3E', // Vert foncé (nuit)
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

  // Streetlight
  STREETLIGHT_POLE: '#415A77', // Gris
  STREETLIGHT_LAMP: '#778DA9', // Gris clair
  STREETLIGHT_HALO: '#FFF3B0', // Jaune doux (from COLORS)

  // Sign (panneau de signalisation)
  SIGN_POLE: '#415A77', // Gris
  SIGN_PANEL: '#1D3557', // Bleu foncé
  SIGN_BORDER: '#E0E1DD', // Blanc cassé

  // Shop Sign (enseigne de magasin)
  SHOP_SIGN_SUPPORT: '#415A77', // Gris
  SHOP_SIGN_PANEL: '#E63946', // Rouge
  SHOP_SIGN_GLOW: '#FFD60A', // Jaune lumineux
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
  // Legs
  LEG_WIDTH: 6,
  LEG_HEIGHT: 20,
  LEG_GAP: 8, // Gap between legs
  LEG_AMPLITUDE: 6, // Forward/backward movement amplitude
  // Animation
  RUN_CYCLE_DURATION: 0.2, // 200ms in seconds
  // Landing squash
  SQUASH_DURATION: 0.05, // 50ms
  SQUASH_SCALE_Y: 0.8, // Vertical compression
  SQUASH_SCALE_X: 1.2, // Horizontal stretch
} as const;

export const SCROLL = {
  SPEED: 300,
  GROUND_MARK_WIDTH: 3,
  GROUND_MARK_GAP: 60,
} as const;

// Background trees (decorative, no collision)
export const TREES = {
  COUNT: 4,
  MIN_TRUNK_WIDTH: 8,
  MAX_TRUNK_WIDTH: 15,
  MIN_TRUNK_HEIGHT: 40,
  MAX_TRUNK_HEIGHT: 80,
  FOLIAGE_RATIO: 1.8, // Foliage width = trunk width * ratio
  FOLIAGE_HEIGHT_RATIO: 1.2, // Foliage height relative to trunk height
  PARALLAX_SPEED: 0.6, // 60% of ground speed (between buildings and ground)
  MIN_SPACING: 200,
} as const;

// Background buildings (parallax layer)
export const BUILDINGS = {
  COUNT: 6,
  MIN_WIDTH: 80,
  MAX_WIDTH: 150,
  MIN_HEIGHT: 150,
  MAX_HEIGHT: 350,
  GAP: 30,
  PARALLAX_SPEED: 0.4, // 40% of ground speed
  WINDOW_SIZE: 8,
  WINDOW_GAP: 20,
  WINDOW_MARGIN: 15,
} as const;

// Crosswalk (passage piéton) - vertical stripes
export const CROSSWALK = {
  WIDTH: 80, // Total width of crosswalk
  STRIPE_WIDTH: 60, // Width of each stripe (horizontal extent)
  STRIPE_HEIGHT: 6, // Height of each stripe
  STRIPE_GAP: 5, // Gap between stripes
  STRIPE_COUNT: 5, // Number of stripes (5-7)
  SPACING: 600, // Distance between crosswalks
  COUNT: 3, // Number of crosswalks to maintain
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

// Obstacle types with specific dimensions
// Ground: 70% total, Aerial: 30% total
export const OBSTACLE_TYPES = {
  trashCan: {
    width: 30,
    height: 50,
    weight: 0.28, // 28% spawn chance
    category: 'ground' as const,
  },
  cone: {
    width: 25,
    height: 40,
    weight: 0.28, // 28% spawn chance
    category: 'ground' as const,
  },
  car: {
    width: 100,
    height: 45,
    weight: 0.14, // 14% spawn chance
    category: 'ground' as const,
  },
  streetlight: {
    width: 15, // Pole width
    height: 120, // Total height
    hitboxHeight: 25, // Only top part has collision
    hitboxWidth: 40, // Width of the lamp part
    weight: 0.1, // 10% spawn chance
    category: 'aerial' as const,
  },
  sign: {
    width: 10, // Pole width
    height: 100, // Total height
    hitboxHeight: 35, // Sign part only
    hitboxWidth: 50, // Sign width
    weight: 0.1, // 10% spawn chance
    category: 'aerial' as const,
  },
  shopSign: {
    width: 8, // Support width
    height: 90, // Total height
    hitboxHeight: 30, // Sign part only
    hitboxWidth: 60, // Sign width
    weight: 0.1, // 10% spawn chance
    category: 'aerial' as const,
  },
} as const;

export const COLLISION = {
  FLASH_DURATION: 0.2,
  FLASH_COLOR: '#ff0000',
} as const;

// Spawn rules to prevent impossible patterns
export const SPAWN_RULES = {
  // After ground obstacle, minimum gap before aerial
  MIN_GROUND_TO_AERIAL_GAP: 150,
  // After aerial obstacle, minimum gap before ground (time to land)
  MIN_AERIAL_TO_GROUND_GAP: 200,
  // Minimum gap between same category obstacles
  MIN_SAME_CATEGORY_GAP: 100,
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
