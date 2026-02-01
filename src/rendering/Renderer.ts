/**
 * Canvas Renderer
 * Handles canvas setup, resizing, and basic rendering operations
 */

import { COLORS, CANVAS } from '../config/constants';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;

  constructor(canvasId: string) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    this.canvas = canvasElement as HTMLCanvasElement;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = context;

    this.setupCanvas();
    this.preventDefaultTouchBehavior();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupCanvas(): void {
    this.ctx.imageSmoothingEnabled = false;
  }

  private preventDefaultTouchBehavior(): void {
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), {
      passive: false,
    });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), {
      passive: false,
    });
  }

  private handleResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  clear(): void {
    this.ctx.fillStyle = COLORS.SKY;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getGroundY(): number {
    return Math.floor(this.height * CANVAS.GROUND_Y_PERCENT);
  }

  getPlayerX(): number {
    return Math.floor(this.width * CANVAS.PLAYER_X_PERCENT);
  }
}
