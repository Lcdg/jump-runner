/**
 * Main Game Class
 * Manages the game loop, update, and render cycles
 */

import { Renderer } from '../rendering/Renderer';
import { Player } from '../entities/Player';
import { InputManager } from '../input/InputManager';
import { InputAction } from './types';
import { DEBUG, COLORS, PLAYER } from '../config/constants';

export class Game {
  private renderer: Renderer;
  private player: Player;
  private inputManager: InputManager;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  // FPS tracking
  private frameCount: number = 0;
  private fpsLastTime: number = 0;
  private currentFps: number = 0;

  constructor() {
    this.renderer = new Renderer('game');
    this.player = new Player(this.renderer.getGroundY());
    this.inputManager = new InputManager();
    this.inputManager.attach((action) => this.handleInput(action));
  }

  start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.fpsLastTime = this.lastTime;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  stop(): void {
    this.isRunning = false;
    this.inputManager.detach();
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

  private handleInput(action: InputAction): void {
    if (action.type === 'jump_start') {
      this.player.jump();
    }
  }

  private update(deltaTime: number): void {
    this.player.update(deltaTime);
  }

  private render(): void {
    this.renderer.clear();
    this.renderGround();
    this.renderPlayer();

    if (DEBUG.SHOW_FPS) {
      this.renderFps();
    }
  }

  private renderGround(): void {
    const ctx = this.renderer.getContext();
    const groundY = this.renderer.getGroundY();
    const width = this.renderer.getWidth();
    const height = this.renderer.getHeight();

    // Ground area
    ctx.fillStyle = COLORS.GROUND;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Ground line
    ctx.strokeStyle = COLORS.GROUND_LINE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
  }

  private renderPlayer(): void {
    const ctx = this.renderer.getContext();
    const pos = this.player.getPosition();

    // Body (rectangle)
    ctx.fillStyle = COLORS.PLAYER_BODY;
    ctx.fillRect(
      pos.x,
      pos.y + PLAYER.HEAD_RADIUS,
      PLAYER.WIDTH,
      PLAYER.HEIGHT - PLAYER.HEAD_RADIUS
    );

    // Head (circle)
    ctx.fillStyle = COLORS.PLAYER_HEAD;
    ctx.beginPath();
    ctx.arc(
      pos.x + PLAYER.WIDTH / 2,
      pos.y + PLAYER.HEAD_RADIUS,
      PLAYER.HEAD_RADIUS,
      0,
      Math.PI * 2
    );
    ctx.fill();
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

  getPlayer(): Player {
    return this.player;
  }
}
