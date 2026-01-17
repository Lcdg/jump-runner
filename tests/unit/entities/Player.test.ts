import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../../../src/entities/Player';
import { PHYSICS, PLAYER } from '../../../src/config/constants';

describe('Player', () => {
  const GROUND_Y = 500;
  let player: Player;

  beforeEach(() => {
    player = new Player(GROUND_Y);
  });

  describe('initialization', () => {
    it('should start at correct position', () => {
      const pos = player.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(GROUND_Y - PLAYER.HEIGHT);
    });

    it('should start in idle state', () => {
      expect(player.getState()).toBe('idle');
    });

    it('should start with zero velocity', () => {
      const vel = player.getVelocity();
      expect(vel.x).toBe(0);
      expect(vel.y).toBe(0);
    });

    it('should be active by default', () => {
      expect(player.isActive()).toBe(true);
    });
  });

  describe('jump()', () => {
    it('should change state from idle to jumping', () => {
      expect(player.getState()).toBe('idle');
      player.jump();
      expect(player.getState()).toBe('jumping');
    });

    it('should not allow double jump', () => {
      player.jump();
      expect(player.getState()).toBe('jumping');

      player.jump();
      expect(player.getState()).toBe('jumping');
    });

    it('should set minimum negative velocity on jump', () => {
      player.jump();
      const vel = player.getVelocity();
      expect(vel.y).toBe(PHYSICS.MIN_JUMP_VELOCITY);
      expect(vel.y).toBeLessThan(0);
    });

    it('should not jump when falling', () => {
      player.jump();

      // Update until we reach falling state (but not landed)
      for (let i = 0; i < 50; i++) {
        player.update(0.016);
        if (player.getState() === 'falling') break;
      }

      expect(player.getState()).toBe('falling');

      // Try to jump while falling
      player.jump();

      // Should still be falling (no air jump allowed)
      expect(player.getState()).toBe('falling');
    });
  });

  describe('update()', () => {
    it('should not change position when idle', () => {
      const posBefore = player.getPosition();
      player.update(0.016);
      const posAfter = player.getPosition();

      expect(posAfter.x).toBe(posBefore.x);
      expect(posAfter.y).toBe(posBefore.y);
    });

    it('should apply gravity when jumping', () => {
      player.jump();
      const initialVelocity = player.getVelocity().y;

      player.update(0.016);
      const newVelocity = player.getVelocity().y;

      expect(newVelocity).toBeGreaterThan(initialVelocity);
    });

    it('should move player upward initially when jumping', () => {
      player.jump();
      const posBefore = player.getPosition();

      player.update(0.016);
      const posAfter = player.getPosition();

      expect(posAfter.y).toBeLessThan(posBefore.y);
    });

    it('should transition to falling when velocity becomes positive', () => {
      player.jump();
      expect(player.getState()).toBe('jumping');

      // Simulate enough time for gravity to reverse velocity
      for (let i = 0; i < 100; i++) {
        player.update(0.016);
        if (player.getVelocity().y > 0) break;
      }

      expect(player.getState()).toBe('falling');
    });

    it('should land when reaching ground', () => {
      player.jump();

      // Simulate full jump cycle
      for (let i = 0; i < 200; i++) {
        player.update(0.016);
        if (player.getState() === 'idle') break;
      }

      expect(player.getState()).toBe('idle');
      expect(player.getPosition().y).toBe(GROUND_Y - PLAYER.HEIGHT);
      expect(player.getVelocity().y).toBe(0);
    });
  });

  describe('getHitbox()', () => {
    it('should return world-space hitbox', () => {
      const hitbox = player.getHitbox();
      const pos = player.getPosition();

      expect(hitbox.x).toBe(pos.x + PLAYER.HITBOX_OFFSET_X);
      expect(hitbox.y).toBe(pos.y + PLAYER.HITBOX_OFFSET_Y);
      expect(hitbox.width).toBe(PLAYER.HITBOX_WIDTH);
      expect(hitbox.height).toBe(PLAYER.HITBOX_HEIGHT);
    });
  });

  describe('reset()', () => {
    it('should reset player to initial state', () => {
      player.jump();
      player.update(0.1);

      const newGroundY = 600;
      player.reset(newGroundY);

      expect(player.getState()).toBe('idle');
      expect(player.getPosition().x).toBe(100);
      expect(player.getPosition().y).toBe(newGroundY - PLAYER.HEIGHT);
      expect(player.getVelocity().y).toBe(0);
      expect(player.isActive()).toBe(true);
    });

    it('should reset jump hold state', () => {
      player.jump();
      player.holdJump(0.016);
      expect(player.isJumpHeld()).toBe(true);

      player.reset(GROUND_Y);
      expect(player.isJumpHeld()).toBe(false);
    });
  });

  describe('variable jump height', () => {
    it('should have lower max height with short press (immediate release)', () => {
      player.jump();
      player.releaseJump();

      let maxHeight = player.getPosition().y;
      for (let i = 0; i < 100; i++) {
        player.update(0.016);
        if (player.getPosition().y < maxHeight) {
          maxHeight = player.getPosition().y;
        }
        if (player.getState() === 'idle') break;
      }

      const shortPressHeight = GROUND_Y - PLAYER.HEIGHT - maxHeight;
      expect(shortPressHeight).toBeGreaterThan(0);
      expect(shortPressHeight).toBeLessThan(150);
    });

    it('should have higher max height with long press', () => {
      // First measure short press height
      player.jump();
      player.releaseJump();

      let shortMaxY = player.getPosition().y;
      for (let i = 0; i < 100; i++) {
        player.update(0.016);
        if (player.getPosition().y < shortMaxY) {
          shortMaxY = player.getPosition().y;
        }
        if (player.getState() === 'idle') break;
      }
      const shortPressHeight = GROUND_Y - PLAYER.HEIGHT - shortMaxY;

      // Reset and measure long press height
      player.reset(GROUND_Y);
      player.jump();

      // Hold for 150ms (about 9 frames at 60fps)
      for (let i = 0; i < 9; i++) {
        player.holdJump(0.016);
        player.update(0.016);
      }
      player.releaseJump();

      let longMaxY = player.getPosition().y;
      for (let i = 0; i < 100; i++) {
        player.update(0.016);
        if (player.getPosition().y < longMaxY) {
          longMaxY = player.getPosition().y;
        }
        if (player.getState() === 'idle') break;
      }
      const longPressHeight = GROUND_Y - PLAYER.HEIGHT - longMaxY;

      // Long press should result in noticeably higher jump
      expect(longPressHeight).toBeGreaterThan(shortPressHeight * 1.2);
    });

    it('should cap velocity at MAX_JUMP_VELOCITY', () => {
      player.jump();

      // Hold for a long time (300ms)
      for (let i = 0; i < 20; i++) {
        player.holdJump(0.016);
        player.update(0.016);
      }

      const vel = player.getVelocity();
      expect(vel.y).toBeGreaterThanOrEqual(PHYSICS.MAX_JUMP_VELOCITY);
    });

    it('should stop increasing velocity after releaseJump()', () => {
      player.jump();
      player.holdJump(0.016);
      player.update(0.016);
      player.releaseJump();

      const velocityAfterRelease = player.getVelocity().y;

      // Hold more - should not change velocity further (except gravity)
      player.holdJump(0.016);
      player.update(0.016);

      // Velocity should only increase (become less negative) due to gravity
      expect(player.getVelocity().y).toBeGreaterThan(velocityAfterRelease);
    });

    it('should not hold jump when in falling state', () => {
      player.jump();

      // Update until falling
      for (let i = 0; i < 50; i++) {
        player.update(0.016);
        if (player.getState() === 'falling') break;
      }

      expect(player.getState()).toBe('falling');
      const velocityBefore = player.getVelocity().y;

      // Try to hold jump while falling
      player.holdJump(0.016);
      player.update(0.016);

      // Velocity should only be affected by gravity, not holdJump
      const expectedVelocity = velocityBefore + PHYSICS.GRAVITY * 0.016;
      expect(player.getVelocity().y).toBeCloseTo(expectedVelocity, 0);
    });

    it('should have isJumpHeld() return correct state', () => {
      expect(player.isJumpHeld()).toBe(false);

      player.jump();
      expect(player.isJumpHeld()).toBe(true);

      player.releaseJump();
      expect(player.isJumpHeld()).toBe(false);
    });
  });
});
