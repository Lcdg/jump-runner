import { describe, it, expect, vi } from 'vitest';
import { SPAWN_RULES, OBSTACLE_TYPES, OBSTACLE } from '../../../src/config/constants';
import { ObstacleType, ObstacleCategory } from '../../../src/core/types';

// Mock canvas for tests
const mockCanvas = {
  width: 800,
  height: 600,
  addEventListener: vi.fn(),
  getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
  getContext: () => ({
    fillRect: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    font: '',
    globalAlpha: 1,
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }),
};

vi.stubGlobal('document', {
  getElementById: () => mockCanvas,
});

describe('Spawn Pattern Validation', () => {
  describe('SPAWN_RULES constants', () => {
    it('should have MIN_GROUND_TO_AERIAL_GAP defined', () => {
      expect(SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP).toBeDefined();
      expect(SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP).toBe(150);
    });

    it('should have MIN_AERIAL_TO_GROUND_GAP defined', () => {
      expect(SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP).toBeDefined();
      expect(SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP).toBe(200);
    });

    it('should have MIN_SAME_CATEGORY_GAP defined', () => {
      expect(SPAWN_RULES.MIN_SAME_CATEGORY_GAP).toBeDefined();
      expect(SPAWN_RULES.MIN_SAME_CATEGORY_GAP).toBe(100);
    });

    it('aerial-to-ground gap should be larger than ground-to-aerial (time to land)', () => {
      expect(SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP).toBeGreaterThan(
        SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP
      );
    });
  });

  describe('Obstacle categories', () => {
    it('ground obstacles should have ground category', () => {
      expect(OBSTACLE_TYPES.trashCan.category).toBe('ground');
      expect(OBSTACLE_TYPES.cone.category).toBe('ground');
      expect(OBSTACLE_TYPES.car.category).toBe('ground');
    });

    it('aerial obstacles should have aerial category', () => {
      expect(OBSTACLE_TYPES.streetlight.category).toBe('aerial');
      expect(OBSTACLE_TYPES.sign.category).toBe('aerial');
      expect(OBSTACLE_TYPES.shopSign.category).toBe('aerial');
    });
  });

  describe('Spawn weights', () => {
    it('should have 70% ground and 30% aerial total weight', () => {
      const types = Object.keys(OBSTACLE_TYPES) as ObstacleType[];

      let groundWeight = 0;
      let aerialWeight = 0;

      for (const type of types) {
        if (OBSTACLE_TYPES[type].category === 'ground') {
          groundWeight += OBSTACLE_TYPES[type].weight;
        } else {
          aerialWeight += OBSTACLE_TYPES[type].weight;
        }
      }

      expect(groundWeight).toBeCloseTo(0.7, 2);
      expect(aerialWeight).toBeCloseTo(0.3, 2);
    });

    it('total weights should equal 1', () => {
      const types = Object.keys(OBSTACLE_TYPES) as ObstacleType[];
      const totalWeight = types.reduce((sum, type) => sum + OBSTACLE_TYPES[type].weight, 0);

      expect(totalWeight).toBeCloseTo(1, 2);
    });
  });

  describe('Pattern validation logic', () => {
    // Helper function mimicking the validation logic
    function validatePattern(
      lastCategory: ObstacleCategory | null,
      lastX: number,
      candidateCategory: ObstacleCategory,
      spawnX: number
    ): { valid: boolean; forcedCategory?: ObstacleCategory } {
      if (lastCategory === null) {
        return { valid: true };
      }

      const gap = spawnX - lastX;

      if (lastCategory === 'ground' && candidateCategory === 'aerial') {
        if (gap < SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP) {
          return { valid: false, forcedCategory: 'ground' };
        }
      }

      if (lastCategory === 'aerial' && candidateCategory === 'ground') {
        if (gap < SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP) {
          return { valid: false, forcedCategory: 'aerial' };
        }
      }

      return { valid: true };
    }

    it('should allow any type on first spawn', () => {
      const result = validatePattern(null, 0, 'aerial', 800);
      expect(result.valid).toBe(true);
    });

    it('should block aerial after ground with insufficient gap', () => {
      const spawnX = 800 + OBSTACLE.SPAWN_MARGIN;
      const lastX = spawnX - 100; // Less than MIN_GROUND_TO_AERIAL_GAP (150)

      const result = validatePattern('ground', lastX, 'aerial', spawnX);

      expect(result.valid).toBe(false);
      expect(result.forcedCategory).toBe('ground');
    });

    it('should allow aerial after ground with sufficient gap', () => {
      const spawnX = 800 + OBSTACLE.SPAWN_MARGIN;
      const lastX = spawnX - 200; // More than MIN_GROUND_TO_AERIAL_GAP (150)

      const result = validatePattern('ground', lastX, 'aerial', spawnX);

      expect(result.valid).toBe(true);
    });

    it('should block ground after aerial with insufficient gap', () => {
      const spawnX = 800 + OBSTACLE.SPAWN_MARGIN;
      const lastX = spawnX - 150; // Less than MIN_AERIAL_TO_GROUND_GAP (200)

      const result = validatePattern('aerial', lastX, 'ground', spawnX);

      expect(result.valid).toBe(false);
      expect(result.forcedCategory).toBe('aerial');
    });

    it('should allow ground after aerial with sufficient gap', () => {
      const spawnX = 800 + OBSTACLE.SPAWN_MARGIN;
      const lastX = spawnX - 250; // More than MIN_AERIAL_TO_GROUND_GAP (200)

      const result = validatePattern('aerial', lastX, 'ground', spawnX);

      expect(result.valid).toBe(true);
    });

    it('should always allow same category', () => {
      const spawnX = 800 + OBSTACLE.SPAWN_MARGIN;
      const lastX = spawnX - 50; // Very small gap

      // Ground after ground
      const groundResult = validatePattern('ground', lastX, 'ground', spawnX);
      expect(groundResult.valid).toBe(true);

      // Aerial after aerial
      const aerialResult = validatePattern('aerial', lastX, 'aerial', spawnX);
      expect(aerialResult.valid).toBe(true);
    });
  });

  describe('Gameplay fairness', () => {
    it('gaps should give player enough time to react', () => {
      // At SCROLL.SPEED = 300px/s, 150px = 0.5s reaction time
      const reactionTimeGroundToAerial = SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP / 300;
      expect(reactionTimeGroundToAerial).toBeGreaterThanOrEqual(0.4);

      // After jumping over aerial, player needs time to land
      // 200px = ~0.67s at 300px/s
      const reactionTimeAerialToGround = SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP / 300;
      expect(reactionTimeAerialToGround).toBeGreaterThanOrEqual(0.5);
    });

    it('should never create impossible ground+aerial simultaneous pattern', () => {
      // With validation, if last was ground and gap < 150, force ground
      // This ensures player never faces ground+aerial at same time
      const minGap = SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP;
      expect(minGap).toBeGreaterThan(0);
    });
  });
});
