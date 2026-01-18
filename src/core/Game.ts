/**
 * Main Game Class
 * Manages the game loop, update, and render cycles
 */

import { Renderer } from '../rendering/Renderer';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { InputManager } from '../input/InputManager';
import { checkAABBCollision } from '../systems/CollisionSystem';
import { getSpawnTime, calculateSpawnInterval, SpawnInterval } from '../systems/DifficultySystem';
import { shouldAutoJump, AutoPlayerInput } from '../systems/AutoPlayerSystem';
import { GameStateManager } from './GameStateManager';
import { InputAction, GroundMark, Decoration, CollisionCallback, GameStateType } from './types';
import { DEBUG, COLORS, PLAYER, SCROLL, OBSTACLE, COLLISION, UI, AUTO_PLAYER, SCORE } from '../config/constants';

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

  // Collision
  private onCollision: CollisionCallback | null = null;
  private isColliding: boolean = false;
  private collisionFlashTimer: number = 0;

  // Difficulty progression
  private gameTime: number = 0;

  // Game state
  private stateManager: GameStateManager;

  // Auto-player state
  private aiJumpHoldTimer: number = 0;

  // Score
  private score: number = 0;
  private finalScore: number = 0;

  constructor() {
    this.renderer = new Renderer('game');
    this.player = new Player(this.renderer.getGroundY());
    this.inputManager = new InputManager();
    this.inputManager.attach((action) => this.handleInput(action));
    this.initScrollingElements();
    this.nextSpawnTime = this.getRandomSpawnTime();

    // Initialize state manager
    this.stateManager = new GameStateManager();
    this.setupStateCallbacks();
  }

  private setupStateCallbacks(): void {
    this.stateManager.registerCallbacks('playing', {
      onEnter: () => {
        this.resetGameplay();
      },
    });

    this.stateManager.registerCallbacks('gameOver', {
      onEnter: () => {
        this.finalScore = Math.floor(this.score);
        this.player.deactivate();
      },
    });

    this.stateManager.registerCallbacks('attract', {
      onEnter: () => {
        this.resetGameplay();
      },
    });
  }

  private resetGameplay(): void {
    this.gameTime = 0;
    this.spawnTimer = 0;
    this.nextSpawnTime = this.getRandomSpawnTime();
    this.obstacles = [];
    this.isColliding = false;
    this.collisionFlashTimer = 0;
    this.aiJumpHoldTimer = 0;
    this.score = 0;
    this.player.reset(this.renderer.getGroundY());
  }

  private getRandomSpawnTime(): number {
    return getSpawnTime(this.gameTime);
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
    const currentState = this.stateManager.getState();

    if (action.type === 'jump_start') {
      if (currentState === 'attract') {
        this.stateManager.transition('playing');
      } else if (currentState === 'gameOver') {
        this.stateManager.transition('attract');
      } else if (currentState === 'playing') {
        this.player.jump();
      }
    } else if (action.type === 'jump_end') {
      if (currentState === 'playing') {
        this.player.releaseJump();
      }
    }
  }

  private update(deltaTime: number): void {
    const currentState = this.stateManager.getState();

    // Scrolling always happens (attract, playing, gameOver)
    this.updateScrolling(deltaTime);

    // Collision flash always updates
    this.updateCollisionFlash(deltaTime);

    if (currentState === 'attract') {
      // In attract: auto-player controls the character
      this.updateAutoPlayer(deltaTime);
      this.player.update(deltaTime);
      this.updateObstacles(deltaTime);
    } else if (currentState === 'playing') {
      // Track game time for difficulty progression (only in playing)
      this.gameTime += deltaTime;

      // Increment score
      this.score += SCORE.POINTS_PER_SECOND * deltaTime;

      if (this.inputManager.isJumpHeld()) {
        this.player.holdJump(deltaTime);
      }
      this.player.update(deltaTime);
      this.updateObstacles(deltaTime);
      this.checkCollisions();
    } else if (currentState === 'gameOver') {
      // In gameOver: obstacles move but don't spawn
      this.updateObstaclesNoSpawn(deltaTime);
    }
  }

  private checkCollisions(): void {
    const playerHitbox = this.player.getHitbox();

    for (const obstacle of this.obstacles) {
      const obstacleHitbox = obstacle.getHitbox();

      if (checkAABBCollision(playerHitbox, obstacleHitbox)) {
        // eslint-disable-next-line no-console, no-undef
        console.log('Collision detected');
        this.isColliding = true;
        this.collisionFlashTimer = COLLISION.FLASH_DURATION;

        if (this.onCollision) {
          this.onCollision({
            type: 'collision',
            playerHitbox,
            obstacleHitbox,
          });
        }

        // Transition to gameOver state
        this.stateManager.transition('gameOver');
        break;
      }
    }
  }

  private updateCollisionFlash(deltaTime: number): void {
    if (this.collisionFlashTimer > 0) {
      this.collisionFlashTimer -= deltaTime;
      if (this.collisionFlashTimer <= 0) {
        this.isColliding = false;
      }
    }
  }

  private updateAutoPlayer(deltaTime: number): void {
    // If AI is currently holding a jump, continue holding
    if (this.aiJumpHoldTimer > 0) {
      this.player.holdJump(deltaTime);
      this.aiJumpHoldTimer -= deltaTime;
      return;
    }

    const pos = this.player.getPosition();
    const groundY = this.renderer.getGroundY();

    const input: AutoPlayerInput = {
      playerX: pos.x,
      playerY: pos.y,
      playerWidth: PLAYER.WIDTH,
      playerHeight: PLAYER.HEIGHT,
      groundY: groundY,
      isOnGround: this.player.getState() === 'idle',
      obstacles: this.obstacles.map((obs) => ({
        x: obs.getPosition().x,
        y: obs.getPosition().y,
        width: obs.getWidth(),
        height: obs.getHeight(),
      })),
    };

    if (shouldAutoJump(input)) {
      this.player.jump();
      // Start holding the jump for a duration to get a higher jump
      this.aiJumpHoldTimer = AUTO_PLAYER.JUMP_HOLD_DURATION;
    }
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

  private updateObstaclesNoSpawn(deltaTime: number): void {
    // Update obstacles without spawning new ones (for gameOver state)
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

    // Only render player when not in gameOver state
    if (!this.stateManager.isState('gameOver')) {
      this.renderPlayer();
    }

    // Render state-specific overlays and UI
    if (this.stateManager.isState('attract')) {
      this.renderAttractOverlay();
    } else if (this.stateManager.isState('playing')) {
      this.renderScore();
    } else if (this.stateManager.isState('gameOver')) {
      this.renderGameOverOverlay();
    }

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

    // Use flash color if colliding
    const bodyColor = this.isColliding ? COLLISION.FLASH_COLOR : COLORS.PLAYER_BODY;
    const headColor = this.isColliding ? COLLISION.FLASH_COLOR : COLORS.PLAYER_HEAD;

    // Body (rectangle)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(
      pos.x,
      pos.y + PLAYER.HEAD_RADIUS,
      PLAYER.WIDTH,
      PLAYER.HEIGHT - PLAYER.HEAD_RADIUS
    );

    // Head (circle)
    ctx.fillStyle = headColor;
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

  private renderAttractOverlay(): void {
    const ctx = this.renderer.getContext();
    const width = this.renderer.getWidth();
    const height = this.renderer.getHeight();

    const text = 'Press Space to Start';

    ctx.font = UI.OVERLAY_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow for better readability
    ctx.shadowColor = UI.OVERLAY_SHADOW_COLOR;
    ctx.shadowBlur = UI.OVERLAY_SHADOW_BLUR;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = UI.OVERLAY_COLOR;
    ctx.fillText(text, width / 2, height / 2);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Reset alignment
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  private renderScore(): void {
    const ctx = this.renderer.getContext();
    const width = this.renderer.getWidth();

    const displayScore = Math.floor(this.score);
    const text = `Score: ${displayScore}`;

    ctx.font = SCORE.FONT;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = SCORE.COLOR;

    // Shadow for better readability
    ctx.shadowColor = UI.OVERLAY_SHADOW_COLOR;
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(text, width - SCORE.PADDING, SCORE.PADDING);

    // Reset shadow and alignment
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  private renderGameOverOverlay(): void {
    const ctx = this.renderer.getContext();
    const width = this.renderer.getWidth();
    const height = this.renderer.getHeight();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow for better readability
    ctx.shadowColor = UI.OVERLAY_SHADOW_COLOR;
    ctx.shadowBlur = UI.OVERLAY_SHADOW_BLUR;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // "Game Over" title
    ctx.font = UI.OVERLAY_FONT;
    ctx.fillStyle = '#ff4757';
    ctx.fillText('Game Over', width / 2, height / 2 - 50);

    // Final score
    ctx.font = SCORE.FONT;
    ctx.fillStyle = UI.OVERLAY_COLOR;
    ctx.fillText(`Score: ${this.finalScore}`, width / 2, height / 2);

    // Restart message
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', width / 2, height / 2 + 50);

    // Reset shadow and alignment
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
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

  setOnCollision(callback: CollisionCallback | null): void {
    this.onCollision = callback;
  }

  getIsColliding(): boolean {
    return this.isColliding;
  }

  getGameTime(): number {
    return this.gameTime;
  }

  getCurrentDifficulty(): SpawnInterval {
    return calculateSpawnInterval(this.gameTime);
  }

  getStateManager(): GameStateManager {
    return this.stateManager;
  }

  getCurrentState(): GameStateType {
    return this.stateManager.getState();
  }

  getScore(): number {
    return this.score;
  }

  getFinalScore(): number {
    return this.finalScore;
  }
}
