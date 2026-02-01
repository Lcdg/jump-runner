import { describe, it, expect, vi } from 'vitest';
import { SpriteSheet } from '../../../src/rendering/SpriteSheet';

function createMockCanvas(width: number, height: number): HTMLCanvasElement {
  return {
    width,
    height,
  } as unknown as HTMLCanvasElement;
}

function createMockContext(): CanvasRenderingContext2D {
  return {
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

describe('SpriteSheet', () => {
  describe('fromCanvas', () => {
    it('should create a loaded sprite sheet from canvas', () => {
      const canvas = createMockCanvas(512, 128);
      const sheet = SpriteSheet.fromCanvas(canvas, 128, 128, 4);

      expect(sheet.isLoaded()).toBe(true);
      expect(sheet.getFrameCount()).toBe(4);
      expect(sheet.getFrameWidth()).toBe(128);
      expect(sheet.getFrameHeight()).toBe(128);
    });
  });

  describe('getFrame', () => {
    it('should return correct frame rect for index 0', () => {
      const canvas = createMockCanvas(384, 128);
      const sheet = SpriteSheet.fromCanvas(canvas, 128, 128, 3);

      const frame = sheet.getFrame(0);

      expect(frame).toEqual({ sx: 0, sy: 0, sw: 128, sh: 128 });
    });

    it('should return correct frame rect for index 2', () => {
      const canvas = createMockCanvas(384, 128);
      const sheet = SpriteSheet.fromCanvas(canvas, 128, 128, 3);

      const frame = sheet.getFrame(2);

      expect(frame).toEqual({ sx: 256, sy: 0, sw: 128, sh: 128 });
    });

    it('should clamp index to valid range (negative)', () => {
      const canvas = createMockCanvas(384, 128);
      const sheet = SpriteSheet.fromCanvas(canvas, 128, 128, 3);

      const frame = sheet.getFrame(-1);

      expect(frame).toEqual({ sx: 0, sy: 0, sw: 128, sh: 128 });
    });

    it('should clamp index to valid range (too large)', () => {
      const canvas = createMockCanvas(384, 128);
      const sheet = SpriteSheet.fromCanvas(canvas, 128, 128, 3);

      const frame = sheet.getFrame(10);

      expect(frame).toEqual({ sx: 256, sy: 0, sw: 128, sh: 128 });
    });
  });

  describe('drawFrame', () => {
    it('should call ctx.drawImage with correct parameters', () => {
      const canvas = createMockCanvas(256, 64);
      const sheet = SpriteSheet.fromCanvas(canvas, 64, 64, 4);
      const ctx = createMockContext();

      sheet.drawFrame(ctx, 1, 100, 200, 40, 60);

      expect(ctx.drawImage).toHaveBeenCalledWith(
        canvas,
        64, // sx = 1 * 64
        0, // sy
        64, // sw
        64, // sh
        100, // dx
        200, // dy
        40, // dw
        60, // dh
      );
    });

    it('should not draw if not loaded', () => {
      const img = {} as HTMLImageElement;
      const sheet = new SpriteSheet(img, 64, 64, 4, false);
      const ctx = createMockContext();

      sheet.drawFrame(ctx, 0, 0, 0, 64, 64);

      expect(ctx.drawImage).not.toHaveBeenCalled();
    });
  });
});
