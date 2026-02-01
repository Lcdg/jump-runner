import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClassicSkin } from '../../../src/skins/ClassicSkin';
import { AnimationData } from '../../../src/skins/PlayerSkin';
import { COLORS, COLLISION, PLAYER } from '../../../src/config/constants';

function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

function createAnimationData(
  overrides: Partial<AnimationData> = {},
): AnimationData {
  return {
    state: 'idle',
    runPhase: 0,
    squashFactor: { scaleX: 1, scaleY: 1 },
    isColliding: false,
    groundY: 918,
    velocity: { x: 0, y: 0 },
    deltaTime: 0.016,
    gameSpeed: 1,
    ...overrides,
  };
}

describe('ClassicSkin', () => {
  let skin: ClassicSkin;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    skin = new ClassicSkin();
    ctx = createMockContext();
  });

  describe('init', () => {
    it('should resolve immediately (no assets)', async () => {
      await expect(skin.init()).resolves.toBeUndefined();
    });
  });

  describe('getName', () => {
    it('should return "Classic"', () => {
      expect(skin.getName()).toBe('Classic');
    });
  });

  describe('getThumbnail', () => {
    it('should return null', () => {
      expect(skin.getThumbnail()).toBeNull();
    });
  });

  describe('render - normal mode', () => {
    it('should draw head as arc', () => {
      const pos = { x: 100, y: 800 };
      skin.render(ctx, pos, createAnimationData());

      expect(ctx.arc).toHaveBeenCalledWith(
        pos.x + PLAYER.WIDTH / 2,
        pos.y + PLAYER.HEAD_RADIUS,
        PLAYER.HEAD_RADIUS,
        0,
        Math.PI * 2,
      );
    });

    it('should draw body as rectangle', () => {
      const pos = { x: 100, y: 800 };
      skin.render(ctx, pos, createAnimationData());

      const baseBodyHeight =
        PLAYER.HEIGHT - PLAYER.HEAD_RADIUS - PLAYER.LEG_HEIGHT;
      expect(ctx.fillRect).toHaveBeenCalledWith(
        pos.x,
        pos.y + PLAYER.HEAD_RADIUS,
        PLAYER.WIDTH,
        baseBodyHeight,
      );
    });

    it('should draw two legs', () => {
      const pos = { x: 100, y: 800 };
      skin.render(ctx, pos, createAnimationData());

      // fillRect is called for: left leg, right leg, body = 3 times
      expect(ctx.fillRect).toHaveBeenCalledTimes(3);
    });

    it('should use player body color when not colliding', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ isColliding: false }),
      );

      // First fillStyle set is for body/legs
      expect(ctx.fillStyle).not.toBe(COLLISION.FLASH_COLOR);
    });

    it('should use flash color when colliding', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ isColliding: true }),
      );

      // The last fillStyle set should be flash color (for head)
      expect(ctx.fillStyle).toBe(COLLISION.FLASH_COLOR);
    });

    it('should animate legs when idle with non-zero phase', () => {
      const pos = { x: 100, y: 800 };
      skin.render(ctx, pos, createAnimationData({ runPhase: 0.25 }));

      const legOffset =
        Math.sin(0.25 * Math.PI * 2) * PLAYER.LEG_AMPLITUDE;
      const baseBodyHeight =
        PLAYER.HEIGHT - PLAYER.HEAD_RADIUS - PLAYER.LEG_HEIGHT;
      const legY = pos.y + PLAYER.HEAD_RADIUS + baseBodyHeight;
      const leftLegX =
        pos.x + (PLAYER.WIDTH - PLAYER.LEG_GAP) / 2 - PLAYER.LEG_WIDTH;

      expect(ctx.fillRect).toHaveBeenCalledWith(
        leftLegX + legOffset,
        legY,
        PLAYER.LEG_WIDTH,
        PLAYER.LEG_HEIGHT,
      );
    });

    it('should not animate legs when jumping', () => {
      const pos = { x: 100, y: 800 };
      skin.render(
        ctx,
        pos,
        createAnimationData({ state: 'jumping', runPhase: 0.25 }),
      );

      const baseBodyHeight =
        PLAYER.HEIGHT - PLAYER.HEAD_RADIUS - PLAYER.LEG_HEIGHT;
      const legY = pos.y + PLAYER.HEAD_RADIUS + baseBodyHeight;
      const leftLegX =
        pos.x + (PLAYER.WIDTH - PLAYER.LEG_GAP) / 2 - PLAYER.LEG_WIDTH;

      // legOffset should be 0 when not idle
      expect(ctx.fillRect).toHaveBeenCalledWith(
        leftLegX,
        legY,
        PLAYER.LEG_WIDTH,
        PLAYER.LEG_HEIGHT,
      );
    });
  });

  describe('render - squash mode', () => {
    it('should use scaled dimensions when squashing', () => {
      const pos = { x: 100, y: 800 };
      const squashFactor = { scaleX: 1.2, scaleY: 0.8 };
      skin.render(
        ctx,
        pos,
        createAnimationData({ state: 'landing', squashFactor }),
      );

      // Should still draw: 2 legs, body, head
      expect(ctx.fillRect).toHaveBeenCalledTimes(3);
      expect(ctx.arc).toHaveBeenCalledTimes(1);
    });

    it('should anchor at ground level when squashing', () => {
      const groundY = 918;
      const squashFactor = { scaleX: 1.2, scaleY: 0.8 };
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({
          state: 'landing',
          squashFactor,
          groundY,
        }),
      );

      const scaledLegHeight = PLAYER.LEG_HEIGHT * squashFactor.scaleY;
      const scaledLegWidth = PLAYER.LEG_WIDTH * squashFactor.scaleX;
      const legY = groundY - scaledLegHeight;

      // First fillRect call should be left leg at legY
      expect(ctx.fillRect).toHaveBeenCalledWith(
        expect.any(Number),
        legY,
        scaledLegWidth,
        scaledLegHeight,
      );
    });
  });
});
