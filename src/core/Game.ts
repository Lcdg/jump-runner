/**
 * Main Game Class
 * Manages the game loop, update, and render cycles
 */

import { Renderer } from '../rendering/Renderer';
import { DEBUG, COLORS } from '../config/constants';

export class Game {
  private renderer: Renderer;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  // FPS tracking
  private frameCount: number = 0;
  private fpsLastTime: number = 0;
  private currentFps: number = 0;

  constructor() {
    this.renderer = new Renderer('game');
  }

  start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.fpsLastTime = this.lastTime;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  stop(): void {
    this.isRunning = false;
  }

  private gameLoop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updateFps(currentTime);
    this.update(deltaTime);
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private updateFps(currentTime: number): void {
    this.frameCount++;

    const elapsed = currentTime - this.fpsLastTime;
    if (elapsed >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.fpsLastTime = currentTime;
    }
  }

  private update(deltaTime: number): void {
    // Game logic will be added here in future stories
    // deltaTime is in seconds for frame-independent movement
    void deltaTime;
  }

  private render(): void {
    this.renderer.clear();

    if (DEBUG.SHOW_FPS) {
      this.renderFps();
    }
  }

  private renderFps(): void {
    const ctx = this.renderer.getContext();
    ctx.fillStyle = COLORS.FPS_TEXT;
    ctx.font = '14px monospace';
    ctx.fillText(`FPS: ${this.currentFps}`, 10, 20);
  }

  getRenderer(): Renderer {
    return this.renderer;
  }
}
