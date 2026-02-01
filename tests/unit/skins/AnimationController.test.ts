import { describe, it, expect, beforeEach } from 'vitest';
import { AnimationController } from '../../../src/skins/AnimationController';

describe('AnimationController', () => {
  let controller: AnimationController;

  beforeEach(() => {
    controller = new AnimationController();
  });

  describe('initial state', () => {
    it('should start on run animation', () => {
      expect(controller.getCurrentAnimation()).toBe('run');
    });

    it('should start at frame 0', () => {
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(0);
    });

    it('should not be finished initially', () => {
      expect(controller.isFinished()).toBe(false);
    });
  });

  describe('setState', () => {
    it('should map idle to run animation', () => {
      controller.setState('idle');
      expect(controller.getCurrentAnimation()).toBe('run');
    });

    it('should map jumping to jump animation', () => {
      controller.setState('jumping');
      expect(controller.getCurrentAnimation()).toBe('jump');
    });

    it('should map falling to fall animation', () => {
      controller.setState('falling');
      expect(controller.getCurrentAnimation()).toBe('fall');
    });

    it('should map landing to land animation', () => {
      controller.setState('landing');
      expect(controller.getCurrentAnimation()).toBe('land');
    });

    it('should reset timer when changing state', () => {
      controller.update(0.1, 1);
      controller.setState('jumping');
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(0);
    });

    it('should not reset timer when setting same state', () => {
      controller.update(0.05, 1); // Advance run animation
      const before = controller.getState();
      controller.setState('idle'); // idle maps to run, same as current
      const after = controller.getState();
      expect(after.frameIndex).toBe(before.frameIndex);
    });
  });

  describe('update', () => {
    it('should advance frames over time for looping animation', () => {
      // Run animation has 8 frames over 0.2s base duration
      controller.setState('idle');
      controller.update(0.1, 1); // Halfway through
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(4); // 0.1/0.2 = 0.5, 0.5 * 8 = 4
    });

    it('should loop run animation', () => {
      controller.setState('idle');
      controller.update(0.25, 1); // Past one full cycle
      expect(controller.isFinished()).toBe(false);
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBeGreaterThanOrEqual(0);
      expect(frameIndex).toBeLessThan(8);
    });

    it('should finish one-shot animation (jump)', () => {
      controller.setState('jumping');
      controller.update(0.2, 1); // Past jump duration (0.15s)
      expect(controller.isFinished()).toBe(true);
    });

    it('should hold last frame for jump animation when finished', () => {
      controller.setState('jumping');
      controller.update(0.2, 1); // Past the duration
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(2); // Last frame (3 frames, index 2)
    });

    it('should finish landing animation', () => {
      controller.setState('landing');
      controller.update(0.15, 1); // Past land duration (0.1s)
      expect(controller.isFinished()).toBe(true);
    });

    it('should not update timer when finished', () => {
      controller.setState('jumping');
      controller.update(0.2, 1); // Finish it
      const state1 = controller.getState();
      controller.update(0.1, 1); // Should not change
      const state2 = controller.getState();
      expect(state1.frameIndex).toBe(state2.frameIndex);
    });
  });

  describe('speed scaling', () => {
    it('should speed up run animation with higher game speed', () => {
      controller.setState('idle');
      // At speed 2x, 0.2s duration becomes 0.1s
      controller.update(0.05, 2); // 0.05s into 0.1s effective duration = 50%
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(4); // 0.5 * 8 = 4
    });

    it('should slow down run animation with lower game speed', () => {
      controller.setState('idle');
      // At speed 0.5x, 0.2s duration becomes 0.4s
      controller.update(0.1, 0.5); // 0.1s into 0.4s = 25%
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(2); // 0.25 * 8 = 2
    });

    it('should not scale jump animation with game speed', () => {
      controller.setState('jumping');
      // Jump duration is 0.15s regardless of speed
      controller.update(0.075, 2); // Halfway through jump
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(1); // 0.5 * 3 = 1
    });

    it('should not scale landing animation with game speed', () => {
      controller.setState('landing');
      // Land duration is 0.1s regardless of speed
      controller.update(0.05, 2); // Halfway through land
      const { frameIndex } = controller.getState();
      expect(frameIndex).toBe(1); // 0.5 * 3 = 1
    });
  });

  describe('transitions', () => {
    it('should transition from idle to jumping', () => {
      controller.setState('idle');
      controller.update(0.05, 1);
      controller.setState('jumping');
      expect(controller.getCurrentAnimation()).toBe('jump');
      expect(controller.isFinished()).toBe(false);
    });

    it('should transition from jumping to falling', () => {
      controller.setState('jumping');
      controller.update(0.2, 1); // Let jump finish
      controller.setState('falling');
      expect(controller.getCurrentAnimation()).toBe('fall');
      expect(controller.isFinished()).toBe(false);
    });

    it('should transition from falling to landing', () => {
      controller.setState('falling');
      controller.update(0.05, 1);
      controller.setState('landing');
      expect(controller.getCurrentAnimation()).toBe('land');
      expect(controller.isFinished()).toBe(false);
    });

    it('should transition from landing back to idle/run', () => {
      controller.setState('landing');
      controller.update(0.15, 1); // Let landing finish
      controller.setState('idle');
      expect(controller.getCurrentAnimation()).toBe('run');
      expect(controller.isFinished()).toBe(false);
    });

    it('should handle full jump cycle', () => {
      // Idle → Jump → Fall → Land → Idle
      controller.setState('idle');
      controller.update(0.05, 1);
      expect(controller.getCurrentAnimation()).toBe('run');

      controller.setState('jumping');
      controller.update(0.2, 1);
      expect(controller.getCurrentAnimation()).toBe('jump');

      controller.setState('falling');
      controller.update(0.1, 1);
      expect(controller.getCurrentAnimation()).toBe('fall');

      controller.setState('landing');
      controller.update(0.15, 1);
      expect(controller.getCurrentAnimation()).toBe('land');

      controller.setState('idle');
      expect(controller.getCurrentAnimation()).toBe('run');
      expect(controller.isFinished()).toBe(false);
    });
  });
});
