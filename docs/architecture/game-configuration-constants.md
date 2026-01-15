# Game Configuration (Constants)

```typescript
// src/config/constants.ts

/** "Night City" theme colors (from front-end-spec.md) */
export const COLORS = {
  SKY: '#0D1B2A',
  BUILDING: '#1B263B',
  WINDOW: '#FFD60A',
  SIDEWALK: '#415A77',
  SIDEWALK_EDGE: '#778DA9',
  CROSSWALK: '#E0E1DD',
  PLAYER_BODY: '#FF6B35',
  PLAYER_HEAD: '#FF8C42',
  TRASH_CAN: '#386641',
  CONE: '#FF9F1C',
  CAR_RED: '#9B2335',
  CAR_BLUE: '#3D5A80',
  HEADLIGHT: '#FFEA00',
  UI_TEXT: '#FFFFFF',
  OVERLAY_BG: 'rgba(0, 0, 0, 0.8)',
  GAME_OVER: '#E63946',
} as const;

export const CANVAS = {
  GROUND_Y_PERCENT: 0.85,
  PLAYER_X_PERCENT: 0.20,
} as const;

export const PLAYER = {
  WIDTH: 30,
  HEIGHT: 70,
  START_X: 0,
  GROUND_Y: 0,
  HITBOX_OFFSET_X: 5,
  HITBOX_OFFSET_Y: 5,
  HITBOX_WIDTH: 20,
  HITBOX_HEIGHT: 60,
} as const;

export const PHYSICS = {
  GRAVITY: 2500,
  JUMP_VELOCITY: -800,
  MAX_JUMP_TIME: 200,
  JUMP_CUT_MULTIPLIER: 0.4,
  BASE_SCROLL_SPEED: 400,
} as const;

export const OBSTACLES = {
  TYPES: {
    TRASH_CAN: { width: 30, height: 50, jumpRequired: 'small' },
    CONE: { width: 25, height: 40, jumpRequired: 'small' },
    BENCH: { width: 60, height: 35, jumpRequired: 'medium' },
    CAR: { width: 100, height: 50, jumpRequired: 'large' },
  },
  MIN_SPACING: 300,
  SPAWN_OFFSET: 100,
} as const;

export const DIFFICULTY = {
  INITIAL_SPAWN_INTERVAL: 2000,
  MIN_SPAWN_INTERVAL: 800,
  INTERVAL_DECREASE_RATE: 50,
  INTERVAL_DECREASE_EVERY: 5000,
  PLATEAU_TIME: 60000,
} as const;

export const SCORING = {
  POINTS_PER_SECOND: 10,
} as const;

export const PARALLAX = {
  BACKGROUND_SPEED: 0.3,
  MIDGROUND_SPEED: 1.0,
} as const;

export const UI = {
  PADDING: 20,
  SCORE_FONT: 'bold 24px monospace',
  TITLE_FONT: 'bold 48px monospace',
  SUBTITLE_FONT: '18px monospace',
  SCORE_FINAL_FONT: 'bold 64px monospace',
} as const;
```

---
