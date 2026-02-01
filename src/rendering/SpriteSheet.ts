/**
 * SpriteSheet
 * Loads an image or canvas and slices it into frames on a regular grid
 */

export interface FrameRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export class SpriteSheet {
  private source: HTMLImageElement | HTMLCanvasElement;
  private frameWidth: number;
  private frameHeight: number;
  private frameCount: number;
  private loaded: boolean = false;

  constructor(
    source: HTMLImageElement | HTMLCanvasElement,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
    loaded: boolean = false,
  ) {
    this.source = source;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.loaded = loaded;
  }

  static fromImage(
    url: string,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
  ): Promise<SpriteSheet> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => {
        const sheet = new SpriteSheet(img, frameWidth, frameHeight, frameCount, true);
        resolve(sheet);
      };
      img.onerror = (): void => {
        reject(new Error(`Failed to load sprite sheet: ${url}`));
      };
      img.src = url;
    });
  }

  static fromCanvas(
    canvas: HTMLCanvasElement,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
  ): SpriteSheet {
    return new SpriteSheet(canvas, frameWidth, frameHeight, frameCount, true);
  }

  getFrame(index: number): FrameRect {
    const clampedIndex = Math.max(0, Math.min(index, this.frameCount - 1));
    return {
      sx: clampedIndex * this.frameWidth,
      sy: 0,
      sw: this.frameWidth,
      sh: this.frameHeight,
    };
  }

  drawFrame(
    ctx: CanvasRenderingContext2D,
    index: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    if (!this.loaded) return;
    const frame = this.getFrame(index);
    ctx.drawImage(
      this.source,
      frame.sx,
      frame.sy,
      frame.sw,
      frame.sh,
      x,
      y,
      width,
      height,
    );
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getFrameCount(): number {
    return this.frameCount;
  }

  getFrameWidth(): number {
    return this.frameWidth;
  }

  getFrameHeight(): number {
    return this.frameHeight;
  }
}
