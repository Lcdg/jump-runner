import { describe, it, expect } from 'vitest';
import { SCROLL, TREES } from '../../../src/config/constants';

describe('Scrolling System', () => {
  describe('ground marks movement', () => {
    it('should move ground marks left based on deltaTime', () => {
      const mark = { x: 100 };
      const deltaTime = 0.016; // ~60 FPS

      mark.x -= SCROLL.SPEED * deltaTime;

      expect(mark.x).toBeCloseTo(100 - SCROLL.SPEED * 0.016, 2);
    });

    it('should move marks at constant speed regardless of frame rate', () => {
      // Simulate 1 second at different frame rates
      const mark60fps = { x: 100 };
      const mark30fps = { x: 100 };

      // 60 FPS: 60 frames at 16.67ms each
      for (let i = 0; i < 60; i++) {
        mark60fps.x -= SCROLL.SPEED * (1 / 60);
      }

      // 30 FPS: 30 frames at 33.33ms each
      for (let i = 0; i < 30; i++) {
        mark30fps.x -= SCROLL.SPEED * (1 / 30);
      }

      // Both should have moved the same distance after 1 second
      expect(mark60fps.x).toBeCloseTo(mark30fps.x, 1);
      expect(mark60fps.x).toBeCloseTo(100 - SCROLL.SPEED, 1);
    });
  });

  describe('ground marks recycling', () => {
    it('should recycle marks that exit screen left', () => {
      const marks = [{ x: -10 }, { x: 50 }, { x: 110 }];

      // Simulate recycling logic
      for (const mark of marks) {
        if (mark.x < -SCROLL.GROUND_MARK_WIDTH) {
          const maxX = Math.max(...marks.map((m) => m.x));
          mark.x = maxX + SCROLL.GROUND_MARK_GAP;
        }
      }

      // First mark should have been recycled to the right
      expect(marks[0].x).toBe(110 + SCROLL.GROUND_MARK_GAP);
    });

    it('should maintain even spacing between marks', () => {
      const markCount = 5;
      const marks: { x: number }[] = [];

      for (let i = 0; i < markCount; i++) {
        marks.push({ x: i * SCROLL.GROUND_MARK_GAP });
      }

      // Check initial spacing
      for (let i = 1; i < marks.length; i++) {
        expect(marks[i].x - marks[i - 1].x).toBe(SCROLL.GROUND_MARK_GAP);
      }
    });
  });

  describe('trees movement', () => {
    it('should move trees left with parallax speed', () => {
      const tree = { x: 200, trunkWidth: 10, trunkHeight: 60 };
      const deltaTime = 0.016;

      tree.x -= SCROLL.SPEED * TREES.PARALLAX_SPEED * deltaTime;

      expect(tree.x).toBeCloseTo(200 - SCROLL.SPEED * TREES.PARALLAX_SPEED * 0.016, 2);
    });

    it('should recycle trees when they exit screen left', () => {
      const screenWidth = 800;
      const tree = { x: -20, trunkWidth: 10, trunkHeight: 60 };
      const foliageWidth = tree.trunkWidth * TREES.FOLIAGE_RATIO;

      if (tree.x < -foliageWidth) {
        tree.x = screenWidth + TREES.MIN_SPACING; // Recycled to right
      }

      expect(tree.x).toBe(screenWidth + TREES.MIN_SPACING);
    });
  });

  describe('scroll constants', () => {
    it('should have positive scroll speed', () => {
      expect(SCROLL.SPEED).toBeGreaterThan(0);
    });

    it('should have reasonable ground mark gap', () => {
      expect(SCROLL.GROUND_MARK_GAP).toBeGreaterThan(0);
      expect(SCROLL.GROUND_MARK_GAP).toBeLessThan(200);
    });

    it('should have trees configured', () => {
      expect(TREES.COUNT).toBeGreaterThan(0);
      expect(TREES.PARALLAX_SPEED).toBeGreaterThan(0);
      expect(TREES.PARALLAX_SPEED).toBeLessThan(1);
    });
  });
});
