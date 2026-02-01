import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DetailedSkin } from '../../../src/skins/DetailedSkin';
import { AnimationData } from '../../../src/skins/PlayerSkin';

// Mock SpriteGenerator to avoid needing real Canvas in tests
vi.mock('../../../src/skins/SpriteGenerator', () => {
  function createMockCanvas(
    width: number,
    height: number,
  ): HTMLCanvasElement {
    return { width, height } as unknown as HTMLCanvasElement;
  }

  return {
    generateAllSprites: (): Record<string, HTMLCanvasElement> => ({
      idle: createMockCanvas(256, 128),
      run: createMockCanvas(1024, 128),
      jump: createMockCanvas(384, 128),
      fall: createMockCanvas(256, 128),
      land: createMockCanvas(384, 128),
    }),
    SPRITE_FRAME_SIZE: 128,
    SPRITE_FRAME_COUNTS: {
      idle: 2,
      run: 8,
      jump: 3,
      fall: 2,
      land: 3,
    },
  };
});

function createMockContext(): CanvasRenderingContext2D {
  return {
    drawImage: vi.fn(),
    fillStyle: '',
    fillRect: vi.fn(),
    globalCompositeOperation: 'source-over',
    save: vi.fn(),
    restore: vi.fn(),
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

describe('DetailedSkin', () => {
  let skin: DetailedSkin;
  let ctx: CanvasRenderingContext2D;

  beforeEach(async () => {
    skin = new DetailedSkin();
    ctx = createMockContext();
    await skin.init();
  });

  describe('init', () => {
    it('should initialize successfully', () => {
      expect(skin.isInitialized()).toBe(true);
    });

    it('should not be initialized before init() is called', () => {
      const freshSkin = new DetailedSkin();
      expect(freshSkin.isInitialized()).toBe(false);
    });
  });

  describe('getName', () => {
    it('should return "Detailed"', () => {
      expect(skin.getName()).toBe('Detailed');
    });
  });

  describe('render', () => {
    it('should not render before initialization', () => {
      const freshSkin = new DetailedSkin();
      freshSkin.render(ctx, { x: 100, y: 800 }, createAnimationData());

      expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should call drawImage when rendering in idle state', () => {
      skin.render(ctx, { x: 100, y: 800 }, createAnimationData());

      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it('should call drawImage when rendering in jumping state', () => {
      skin.render(
        ctx,
        { x: 100, y: 750 },
        createAnimationData({ state: 'jumping' }),
      );

      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it('should call drawImage when rendering in falling state', () => {
      skin.render(
        ctx,
        { x: 100, y: 780 },
        createAnimationData({ state: 'falling' }),
      );

      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it('should call drawImage when rendering in landing state', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ state: 'landing' }),
      );

      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it('should apply collision flash effect', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ isColliding: true }),
      );

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should handle squash factor for landing animation', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({
          state: 'landing',
          squashFactor: { scaleX: 1.2, scaleY: 0.8 },
        }),
      );

      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it('should use run sheet for idle state via AnimationController', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ state: 'idle', deltaTime: 0.016 }),
      );

      const animState = skin.getAnimationController().getState();
      expect(animState.sheetKey).toBe('run');
    });

    it('should use jump sheet for jumping state', () => {
      skin.render(
        ctx,
        { x: 100, y: 750 },
        createAnimationData({ state: 'jumping', deltaTime: 0.016 }),
      );

      const animState = skin.getAnimationController().getState();
      expect(animState.sheetKey).toBe('jump');
    });

    it('should use fall sheet for falling state', () => {
      skin.render(
        ctx,
        { x: 100, y: 780 },
        createAnimationData({ state: 'falling', deltaTime: 0.016 }),
      );

      const animState = skin.getAnimationController().getState();
      expect(animState.sheetKey).toBe('fall');
    });

    it('should use land sheet for landing state', () => {
      skin.render(
        ctx,
        { x: 100, y: 800 },
        createAnimationData({ state: 'landing', deltaTime: 0.016 }),
      );

      const animState = skin.getAnimationController().getState();
      expect(animState.sheetKey).toBe('land');
    });
  });
});
