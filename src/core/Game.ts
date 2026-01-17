/**
 * Main Game Class
 * Manages the game loop, update, and render cycles
 */

import { Renderer } from '../rendering/Renderer';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { InputManager } from '../input/InputManager';
import { InputAction, GroundMark, Decoration } from './types';
import { DEBUG, COLORS, PLAYER, SCROLL, OBSTACLE } from '../config/constants';

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

  // Scrolling
  private groundMarks: GroundMark[] = [];
  private decorations: Decoration[] = [];

  // Obstacles
  private obstacles: Obstacle[] = [];
  private spawnTimer: number = 0;
  private nextSpawnTime: number = 0;

  constructor() {
    this.renderer = new Renderer('game');
    this.player = new Player(this.renderer.getGroundY());
    this.inputManager = new InputManager();
    this.inputManager.attach((action) => this.handleInput(action));
    this.initScrollingElements();
    this.nextSpawnTime = this.getRandomSpawnTime();
  }

  private getRandomSpawnTime(): number {
    return (
      OBSTACLE.MIN_SPAWN_INTERVAL +
      Math.random() * (OBSTACLE.MAX_SPAWN_INTERVAL - OBSTACLE.MIN_SPAWN_INTERVAL)
    );
  }

  private spawnObstacle(): void {
    const width = this.renderer.getWidth();
    const groundY = this.renderer.getGroundY();

    const obsWidth =
      OBSTACLE.MIN_WIDTH +
      Math.random() * (OBSTACLE.MAX_WIDTH - OBSTACLE.MIN_WIDTH);
    const obsHeight =
      OBSTACLE.MIN_HEIGHT +
      Math.random() * (OBSTACLE.MAX_HEIGHT - OBSTACLE.MIN_HEIGHT);

    const obstacle = new Obstacle(
      width + OBSTACLE.SPAWN_MARGIN,
      groundY,
      obsWidth,
      obsHeight
    );

    this.obstacles.push(obstacle);
  }

  private initScrollingElements(): void {
    const width = this.renderer.getWidth();
    const groundY = this.renderer.getGroundY();

    // Initialize ground marks
    const markCount = Math.ceil(width / SCROLL.GROUND_MARK_GAP) + 2;
    for (let i = 0; i < markCount; i++) {
      this.groundMarks.push({ x: i * SCROLL.GROUND_MARK_GAP });
    }

    // Initialize decorations
    for (let i = 0; i < SCROLL.DECORATION_COUNT; i++) {
      this.decorations.push({
        x: Math.random() * width,
        y: groundY - 30 - Math.random() * 150,
        width: 2 + Math.random() * 4,
        height: 10 + Math.random() * 30,
      });
    }
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
    } else if (action.type === 'jump_end') {
      this.player.releaseJump();
    }
  }

  private update(deltaTime: number): void {
    if (this.inputManager.isJumpHeld()) {
      this.player.holdJump(deltaTime);
    }
    this.player.update(deltaTime);
    this.updateScrolling(deltaTime);
    this.updateObstacles(deltaTime);
  }

  private updateObstacles(deltaTime: number): void {
    // Spawn timer
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.nextSpawnTime) {
      this.spawnObstacle();
      this.spawnTimer = 0;
      this.nextSpawnTime = this.getRandomSpawnTime();
    }

    // Update obstacles and remove inactive ones
    for (const obstacle of this.obstacles) {
      obstacle.update(deltaTime);
    }
    this.obstacles = this.obstacles.filter((obs) => obs.isActive());
  }

  private updateScrolling(deltaTime: number): void {
    const width = this.renderer.getWidth();
    const groundY = this.renderer.getGroundY();
    const scrollAmount = SCROLL.SPEED * deltaTime;

    // Update ground marks
    for (const mark of this.groundMarks) {
      mark.x -= scrollAmount;
      if (mark.x < -SCROLL.GROUND_MARK_WIDTH) {
        // Find the rightmost mark and position after it
        const maxX = Math.max(...this.groundMarks.map((m) => m.x));
        mark.x = maxX + SCROLL.GROUND_MARK_GAP;
      }
    }

    // Update decorations
    for (const deco of this.decorations) {
      deco.x -= scrollAmount;
      if (deco.x < -deco.width) {
        // Recycle to the right with random position
        deco.x = width + Math.random() * 100;
        deco.y = groundY - 30 - Math.random() * 150;
        deco.width = 2 + Math.random() * 4;
        deco.height = 10 + Math.random() * 30;
      }
    }
  }

  private render(): void {
    this.renderer.clear();
    this.renderDecorations();
    this.renderGround();
    this.renderObstacles();
    this.renderPlayer();

    if (DEBUG.SHOW_FPS) {
      this.renderFps();
    }
  }

  private renderObstacles(): void {
    const ctx = this.renderer.getContext();
    ctx.fillStyle = OBSTACLE.COLOR;

    for (const obstacle of this.obstacles) {
      const pos = obstacle.getPosition();
      ctx.fillRect(pos.x, pos.y, obstacle.getWidth(), obstacle.getHeight());
    }
  }

  private renderDecorations(): void {
    const ctx = this.renderer.getContext();
    ctx.fillStyle = COLORS.GROUND_LINE;

    for (const deco of this.decorations) {
      ctx.globalAlpha = 0.3;
      ctx.fillRect(deco.x, deco.y, deco.width, deco.height);
    }
    ctx.globalAlpha = 1;
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

    // Ground marks (scrolling)
    ctx.fillStyle = COLORS.GROUND_LINE;
    for (const mark of this.groundMarks) {
      ctx.fillRect(mark.x, groundY + 5, SCROLL.GROUND_MARK_WIDTH, 15);
    }
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

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}
