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
import { InputAction, GroundMark, Tree, Building, BuildingWindow, Crosswalk, ObstacleType, CollisionCallback, GameStateType } from './types';
import { DEBUG, COLORS, OBSTACLE_COLORS, PLAYER, SCROLL, TREES, BUILDINGS, CROSSWALK, OBSTACLE, OBSTACLE_TYPES, COLLISION, UI, AUTO_PLAYER, SCORE, SPAWN_RULES } from '../config/constants';

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
  private trees: Tree[] = [];
  private buildings: Building[] = [];
  private crosswalks: Crosswalk[] = [];

  // Obstacles
  private obstacles: Obstacle[] = [];
  private spawnTimer: number = 0;
  private nextSpawnTime: number = 0;
  private lastSpawnedCategory: 'ground' | 'aerial' | null = null;
  private timeSinceLastSpawn: number = 0;

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
    this.initBuildings();
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
    // Reset spawn pattern tracking
    this.lastSpawnedCategory = null;
    this.timeSinceLastSpawn = 0;
    this.player.reset(this.renderer.getGroundY());
  }

  private getRandomSpawnTime(): number {
    return getSpawnTime(this.gameTime);
  }

  private getRandomObstacleType(): ObstacleType {
    const random = Math.random();
    let cumulative = 0;

    const types = Object.keys(OBSTACLE_TYPES) as ObstacleType[];
    for (const type of types) {
      cumulative += OBSTACLE_TYPES[type].weight;
      if (random < cumulative) {
        return type;
      }
    }

    return 'trashCan'; // fallback
  }

  private getRandomTypeByCategory(category: 'ground' | 'aerial'): ObstacleType {
    const types = (Object.keys(OBSTACLE_TYPES) as ObstacleType[]).filter(
      (type) => OBSTACLE_TYPES[type].category === category
    );

    // Calculate total weight for this category
    let totalWeight = 0;
    for (const type of types) {
      totalWeight += OBSTACLE_TYPES[type].weight;
    }

    // Pick random type within category
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    for (const type of types) {
      cumulative += OBSTACLE_TYPES[type].weight;
      if (random < cumulative) {
        return type;
      }
    }

    return types[0]; // fallback
  }

  private getValidObstacleType(): ObstacleType {
    // Calculate effective gap based on time since last spawn
    // Gap = time * scroll speed (how far the last obstacle has moved)
    const gap = this.timeSinceLastSpawn * SCROLL.SPEED;

    // Get a random candidate type
    const candidateType = this.getRandomObstacleType();
    const candidateCategory = OBSTACLE_TYPES[candidateType].category;

    // First spawn - no validation needed
    if (this.lastSpawnedCategory === null) {
      return candidateType;
    }

    // Validate pattern
    if (this.lastSpawnedCategory === 'ground' && candidateCategory === 'aerial') {
      if (gap < SPAWN_RULES.MIN_GROUND_TO_AERIAL_GAP) {
        // Force ground obstacle
        return this.getRandomTypeByCategory('ground');
      }
    }

    if (this.lastSpawnedCategory === 'aerial' && candidateCategory === 'ground') {
      if (gap < SPAWN_RULES.MIN_AERIAL_TO_GROUND_GAP) {
        // Force aerial obstacle
        return this.getRandomTypeByCategory('aerial');
      }
    }

    return candidateType;
  }

  private spawnObstacle(): void {
    const width = this.renderer.getWidth();
    const groundY = this.renderer.getGroundY();
    const spawnX = width + OBSTACLE.SPAWN_MARGIN;

    const obstacleType = this.getValidObstacleType();
    const obstacle = new Obstacle(
      spawnX,
      groundY,
      obstacleType
    );

    // Track last spawned obstacle info
    this.lastSpawnedCategory = OBSTACLE_TYPES[obstacleType].category;
    this.timeSinceLastSpawn = 0; // Reset timer

    this.obstacles.push(obstacle);
  }

  private initBuildings(): void {
    // Start buildings from the left edge to fill the screen
    let currentX = 0;

    // Generate initial buildings to cover the entire screen
    for (let i = 0; i < BUILDINGS.COUNT; i++) {
      const building = this.generateBuilding(currentX);
      this.buildings.push(building);
      currentX += building.width + this.getRandomBuildingGap();
    }
  }

  private getRandomBuildingGap(): number {
    // 20% chance of a larger gap (2-4x normal gap)
    if (Math.random() < 0.2) {
      return BUILDINGS.GAP * (2 + Math.random() * 2);
    }
    return BUILDINGS.GAP;
  }

  private generateBuilding(x: number): Building {
    const width = BUILDINGS.MIN_WIDTH + Math.random() * (BUILDINGS.MAX_WIDTH - BUILDINGS.MIN_WIDTH);
    const height = BUILDINGS.MIN_HEIGHT + Math.random() * (BUILDINGS.MAX_HEIGHT - BUILDINGS.MIN_HEIGHT);

    // Generate windows for this building
    const windows: BuildingWindow[] = [];
    const windowCols = Math.floor((width - BUILDINGS.WINDOW_MARGIN * 2) / BUILDINGS.WINDOW_GAP);
    const windowRows = Math.floor((height - BUILDINGS.WINDOW_MARGIN * 2) / BUILDINGS.WINDOW_GAP);

    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        // Randomly light some windows (about 60%)
        if (Math.random() < 0.6) {
          windows.push({
            x: BUILDINGS.WINDOW_MARGIN + col * BUILDINGS.WINDOW_GAP,
            y: BUILDINGS.WINDOW_MARGIN + row * BUILDINGS.WINDOW_GAP,
          });
        }
      }
    }

    return {
      x,
      width,
      height,
      windows,
    };
  }

  private updateBuildings(deltaTime: number): void {
    const width = this.renderer.getWidth();
    const scrollAmount = SCROLL.SPEED * BUILDINGS.PARALLAX_SPEED * deltaTime;

    for (const building of this.buildings) {
      building.x -= scrollAmount;

      // Recycle building when it goes off-screen left
      if (building.x + building.width < 0) {
        // Find the rightmost building
        const maxX = Math.max(...this.buildings.map((b) => b.x + b.width));

        // Ensure new building spawns off-screen to the right
        const newX = Math.max(width, maxX + this.getRandomBuildingGap());

        // Generate new building properties
        const newBuilding = this.generateBuilding(newX);
        building.x = newBuilding.x;
        building.width = newBuilding.width;
        building.height = newBuilding.height;
        building.windows = newBuilding.windows;
      }
    }
  }

  private initScrollingElements(): void {
    const width = this.renderer.getWidth();

    // Initialize ground marks
    const markCount = Math.ceil(width / SCROLL.GROUND_MARK_GAP) + 2;
    for (let i = 0; i < markCount; i++) {
      this.groundMarks.push({ x: i * SCROLL.GROUND_MARK_GAP });
    }

    // Initialize crosswalks
    for (let i = 0; i < CROSSWALK.COUNT; i++) {
      this.crosswalks.push({ x: i * CROSSWALK.SPACING });
    }

    // Initialize trees (decorative background)
    for (let i = 0; i < TREES.COUNT; i++) {
      this.trees.push(this.generateTree(i * TREES.MIN_SPACING + Math.random() * 100));
    }
  }

  private generateTree(x: number): Tree {
    return {
      x,
      trunkWidth: TREES.MIN_TRUNK_WIDTH + Math.random() * (TREES.MAX_TRUNK_WIDTH - TREES.MIN_TRUNK_WIDTH),
      trunkHeight: TREES.MIN_TRUNK_HEIGHT + Math.random() * (TREES.MAX_TRUNK_HEIGHT - TREES.MIN_TRUNK_HEIGHT),
    };
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

    // Scrolling and buildings always update (attract, playing, gameOver)
    this.updateBuildings(deltaTime);
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
    const playerState = this.player.getState();

    for (const obstacle of this.obstacles) {
      // Skip aerial obstacles when player is on ground
      if (obstacle.getCategory() === 'aerial') {
        if (playerState === 'idle' || playerState === 'landing') {
          continue;
        }
      }

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
    // Track time since last spawn for pattern validation
    this.timeSinceLastSpawn += deltaTime;

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

    // Update crosswalks
    for (const crosswalk of this.crosswalks) {
      crosswalk.x -= scrollAmount;
      if (crosswalk.x < -CROSSWALK.WIDTH) {
        // Find the rightmost crosswalk and position after it
        const maxX = Math.max(...this.crosswalks.map((c) => c.x));
        crosswalk.x = maxX + CROSSWALK.SPACING;
      }
    }

    // Update trees (parallax layer between buildings and ground)
    const treeScrollAmount = SCROLL.SPEED * TREES.PARALLAX_SPEED * deltaTime;
    for (const tree of this.trees) {
      tree.x -= treeScrollAmount;

      // Calculate total tree width for off-screen check
      const foliageWidth = tree.trunkWidth * TREES.FOLIAGE_RATIO;
      if (tree.x < -foliageWidth) {
        // Recycle to the right
        const maxX = Math.max(...this.trees.map((t) => t.x));
        const newTree = this.generateTree(Math.max(width, maxX + TREES.MIN_SPACING));
        tree.x = newTree.x;
        tree.trunkWidth = newTree.trunkWidth;
        tree.trunkHeight = newTree.trunkHeight;
      }
    }
  }

  private render(): void {
    this.renderer.clear();
    this.renderBuildings();
    this.renderTrees();
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

  private renderBuildings(): void {
    const ctx = this.renderer.getContext();
    const groundY = this.renderer.getGroundY();

    for (const building of this.buildings) {
      // Draw building silhouette
      ctx.fillStyle = COLORS.BUILDING;
      const buildingY = groundY - building.height;
      ctx.fillRect(building.x, buildingY, building.width, building.height);

      // Draw lit windows
      ctx.fillStyle = COLORS.WINDOW;
      for (const window of building.windows) {
        ctx.fillRect(
          building.x + window.x,
          buildingY + window.y,
          BUILDINGS.WINDOW_SIZE,
          BUILDINGS.WINDOW_SIZE
        );
      }
    }
  }

  private renderObstacles(): void {
    for (const obstacle of this.obstacles) {
      const type = obstacle.getType();
      switch (type) {
        case 'trashCan':
          this.renderTrashCan(obstacle);
          break;
        case 'cone':
          this.renderCone(obstacle);
          break;
        case 'car':
          this.renderCar(obstacle);
          break;
        case 'streetlight':
          this.renderStreetlight(obstacle);
          break;
        case 'sign':
          this.renderSign(obstacle);
          break;
        case 'shopSign':
          this.renderShopSign(obstacle);
          break;
      }
    }
  }

  private renderTrashCan(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();

    // Body (green rectangle)
    ctx.fillStyle = OBSTACLE_COLORS.TRASH_CAN;
    ctx.fillRect(pos.x, pos.y + 5, w, h - 5);

    // Lid (darker green, slightly wider)
    ctx.fillStyle = OBSTACLE_COLORS.TRASH_CAN_LID;
    ctx.fillRect(pos.x - 2, pos.y, w + 4, 8);
  }

  private renderCone(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();

    // Orange cone (triangle shape)
    ctx.fillStyle = OBSTACLE_COLORS.CONE;
    ctx.beginPath();
    ctx.moveTo(pos.x + w / 2, pos.y); // Top center
    ctx.lineTo(pos.x + w, pos.y + h); // Bottom right
    ctx.lineTo(pos.x, pos.y + h); // Bottom left
    ctx.closePath();
    ctx.fill();

    // White stripes (2 horizontal)
    ctx.fillStyle = OBSTACLE_COLORS.CONE_STRIPES;
    const stripeH = 4;
    ctx.fillRect(pos.x + w * 0.2, pos.y + h * 0.35, w * 0.6, stripeH);
    ctx.fillRect(pos.x + w * 0.1, pos.y + h * 0.6, w * 0.8, stripeH);
  }

  private renderCar(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();

    // Randomly choose car color (deterministic based on position)
    const useBlue = Math.floor(pos.x) % 2 === 0;
    const bodyColor = useBlue ? OBSTACLE_COLORS.CAR_BLUE : OBSTACLE_COLORS.CAR_RED;

    // Car body (main rectangle)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(pos.x, pos.y + 10, w, h - 20);

    // Roof (smaller rectangle on top)
    ctx.fillRect(pos.x + w * 0.2, pos.y, w * 0.5, 15);

    // Wheels (black circles)
    ctx.fillStyle = OBSTACLE_COLORS.CAR_WHEELS;
    const wheelRadius = 8;
    // Front wheel
    ctx.beginPath();
    ctx.arc(pos.x + 20, pos.y + h - 5, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    // Rear wheel
    ctx.beginPath();
    ctx.arc(pos.x + w - 20, pos.y + h - 5, wheelRadius, 0, Math.PI * 2);
    ctx.fill();

    // Headlights (yellow rectangles on front)
    ctx.fillStyle = OBSTACLE_COLORS.CAR_HEADLIGHTS;
    ctx.fillRect(pos.x + w - 5, pos.y + 15, 5, 8);
    ctx.fillRect(pos.x + w - 5, pos.y + h - 23, 5, 8);
  }

  private renderStreetlight(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();
    const config = OBSTACLE_TYPES.streetlight;

    // Pole (decorative, no collision)
    ctx.fillStyle = OBSTACLE_COLORS.STREETLIGHT_POLE;
    const poleX = pos.x + (w - 6) / 2; // Center the pole
    ctx.fillRect(poleX, pos.y + config.hitboxHeight, 6, h - config.hitboxHeight);

    // Lamp housing (top part with collision)
    ctx.fillStyle = OBSTACLE_COLORS.STREETLIGHT_LAMP;
    const lampX = pos.x - (config.hitboxWidth - w) / 2;
    ctx.fillRect(lampX, pos.y, config.hitboxWidth, config.hitboxHeight);

    // Halo effect (semi-transparent glow)
    ctx.fillStyle = OBSTACLE_COLORS.STREETLIGHT_HALO;
    ctx.globalAlpha = 0.3;
    const haloSize = 50;
    ctx.beginPath();
    ctx.arc(
      lampX + config.hitboxWidth / 2,
      pos.y + config.hitboxHeight,
      haloSize,
      0,
      Math.PI // Only bottom half
    );
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private renderSign(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();
    const config = OBSTACLE_TYPES.sign;

    // Pole (decorative)
    ctx.fillStyle = OBSTACLE_COLORS.SIGN_POLE;
    const poleX = pos.x + (w - 6) / 2;
    ctx.fillRect(poleX, pos.y + config.hitboxHeight, 6, h - config.hitboxHeight);

    // Sign panel (with collision)
    const signX = pos.x - (config.hitboxWidth - w) / 2;

    // Border
    ctx.fillStyle = OBSTACLE_COLORS.SIGN_BORDER;
    ctx.fillRect(signX - 2, pos.y - 2, config.hitboxWidth + 4, config.hitboxHeight + 4);

    // Panel
    ctx.fillStyle = OBSTACLE_COLORS.SIGN_PANEL;
    ctx.fillRect(signX, pos.y, config.hitboxWidth, config.hitboxHeight);
  }

  private renderShopSign(obstacle: Obstacle): void {
    const ctx = this.renderer.getContext();
    const pos = obstacle.getPosition();
    const w = obstacle.getWidth();
    const h = obstacle.getHeight();
    const config = OBSTACLE_TYPES.shopSign;

    // Support bracket (decorative)
    ctx.fillStyle = OBSTACLE_COLORS.SHOP_SIGN_SUPPORT;
    const supportX = pos.x + (w - 4) / 2;
    ctx.fillRect(supportX, pos.y + config.hitboxHeight, 4, h - config.hitboxHeight);

    // Horizontal bracket
    const signX = pos.x - (config.hitboxWidth - w) / 2;
    ctx.fillRect(signX, pos.y + config.hitboxHeight - 4, config.hitboxWidth, 4);

    // Sign panel glow (behind)
    ctx.fillStyle = OBSTACLE_COLORS.SHOP_SIGN_GLOW;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(signX - 3, pos.y - 3, config.hitboxWidth + 6, config.hitboxHeight + 6);
    ctx.globalAlpha = 1;

    // Sign panel
    ctx.fillStyle = OBSTACLE_COLORS.SHOP_SIGN_PANEL;
    ctx.fillRect(signX, pos.y, config.hitboxWidth, config.hitboxHeight);

    // Inner glow lines (to simulate neon)
    ctx.fillStyle = OBSTACLE_COLORS.SHOP_SIGN_GLOW;
    ctx.fillRect(signX + 5, pos.y + 5, config.hitboxWidth - 10, 3);
    ctx.fillRect(signX + 5, pos.y + config.hitboxHeight - 8, config.hitboxWidth - 10, 3);
  }

  private renderTrees(): void {
    const ctx = this.renderer.getContext();
    const groundY = this.renderer.getGroundY();

    for (const tree of this.trees) {
      const foliageWidth = tree.trunkWidth * TREES.FOLIAGE_RATIO;
      const foliageHeight = tree.trunkHeight * TREES.FOLIAGE_HEIGHT_RATIO;

      // Calculate positions
      const trunkX = tree.x - tree.trunkWidth / 2;
      const trunkY = groundY - tree.trunkHeight;
      const foliageY = trunkY - foliageHeight + 10; // Overlap slightly with trunk

      // Draw trunk
      ctx.fillStyle = COLORS.TREE_TRUNK;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(trunkX, trunkY, tree.trunkWidth, tree.trunkHeight);

      // Draw foliage (rounded/oval shape using ellipse or simple triangle)
      ctx.fillStyle = COLORS.TREE_FOLIAGE;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.ellipse(
        tree.x,
        foliageY + foliageHeight / 2,
        foliageWidth / 2,
        foliageHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
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

    // Crosswalks (zebra crossing pattern - vertical stripes)
    ctx.fillStyle = COLORS.GROUND_LINE;
    for (const crosswalk of this.crosswalks) {
      // Center the stripes horizontally within the crosswalk
      const stripeX = crosswalk.x + (CROSSWALK.WIDTH - CROSSWALK.STRIPE_WIDTH) / 2;
      for (let i = 0; i < CROSSWALK.STRIPE_COUNT; i++) {
        const stripeY = groundY + 5 + i * (CROSSWALK.STRIPE_HEIGHT + CROSSWALK.STRIPE_GAP);
        ctx.fillRect(stripeX, stripeY, CROSSWALK.STRIPE_WIDTH, CROSSWALK.STRIPE_HEIGHT);
      }
    }

    // Ground line (sidewalk edge)
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

    // Get squash factor for landing animation
    const squash = this.player.getSquashFactor();
    const isSquashing = squash.scaleY !== 1 || squash.scaleX !== 1;

    // Calculate leg animation offset
    const phase = this.player.getRunAnimationPhase();
    const legOffset = Math.sin(phase * Math.PI * 2) * PLAYER.LEG_AMPLITUDE;

    // Base dimensions
    const baseBodyHeight = PLAYER.HEIGHT - PLAYER.HEAD_RADIUS - PLAYER.LEG_HEIGHT;

    if (isSquashing) {
      // Squash mode: anchor at feet (ground level)
      const groundY = this.renderer.getGroundY();
      const scaledWidth = PLAYER.WIDTH * squash.scaleX;
      const scaledBodyHeight = baseBodyHeight * squash.scaleY;
      const scaledLegHeight = PLAYER.LEG_HEIGHT * squash.scaleY;
      const scaledHeadRadius = PLAYER.HEAD_RADIUS * squash.scaleY;

      // Position from ground up (feet anchored)
      const feetY = groundY;
      const legY = feetY - scaledLegHeight;
      const bodyY = legY - scaledBodyHeight;
      const headY = bodyY - scaledHeadRadius;

      // Center X offset for width scaling
      const xOffset = (scaledWidth - PLAYER.WIDTH) / 2;
      const playerX = pos.x - xOffset;

      // Leg positions (scaled, no animation during squash)
      const scaledLegWidth = PLAYER.LEG_WIDTH * squash.scaleX;
      const scaledLegGap = PLAYER.LEG_GAP * squash.scaleX;
      const leftLegX = playerX + (scaledWidth - scaledLegGap) / 2 - scaledLegWidth;
      const rightLegX = playerX + (scaledWidth + scaledLegGap) / 2;

      // Draw legs
      ctx.fillStyle = bodyColor;
      ctx.fillRect(leftLegX, legY, scaledLegWidth, scaledLegHeight);
      ctx.fillRect(rightLegX, legY, scaledLegWidth, scaledLegHeight);

      // Body
      ctx.fillRect(playerX, bodyY, scaledWidth, scaledBodyHeight);

      // Head
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(playerX + scaledWidth / 2, headY, scaledHeadRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal mode: use pos.y
      const bodyY = pos.y + PLAYER.HEAD_RADIUS;
      const legY = bodyY + baseBodyHeight;
      const leftLegX = pos.x + (PLAYER.WIDTH - PLAYER.LEG_GAP) / 2 - PLAYER.LEG_WIDTH;
      const rightLegX = pos.x + (PLAYER.WIDTH + PLAYER.LEG_GAP) / 2;

      // Draw legs
      ctx.fillStyle = bodyColor;
      ctx.fillRect(leftLegX + legOffset, legY, PLAYER.LEG_WIDTH, PLAYER.LEG_HEIGHT);
      ctx.fillRect(rightLegX - legOffset, legY, PLAYER.LEG_WIDTH, PLAYER.LEG_HEIGHT);

      // Body
      ctx.fillRect(pos.x, bodyY, PLAYER.WIDTH, baseBodyHeight);

      // Head
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(pos.x + PLAYER.WIDTH / 2, pos.y + PLAYER.HEAD_RADIUS, PLAYER.HEAD_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
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
    ctx.fillStyle = COLORS.GAME_OVER;
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
