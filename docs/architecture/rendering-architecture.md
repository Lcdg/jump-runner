# Rendering Architecture

## Layer System

```
┌─────────────────────────────────────────────────────┐
│  UI Layer (score, overlays)           - Fixed      │
├─────────────────────────────────────────────────────┤
│  Game Layer (player, obstacles, ground) - 100%     │
├─────────────────────────────────────────────────────┤
│  Midground Layer (lampposts)          - 100%       │
├─────────────────────────────────────────────────────┤
│  Background Layer (buildings)         - 30-50%     │
├─────────────────────────────────────────────────────┤
│  Sky Layer (sky, stars)               - Static 5%  │
└─────────────────────────────────────────────────────┘
```

## Renderer Class

```typescript
// src/rendering/Renderer.ts

import { COLORS, CANVAS } from '../config/constants';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupCanvas(): void {
    this.ctx.imageSmoothingEnabled = false;
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

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getWidth(): number { return this.width; }
  getHeight(): number { return this.height; }

  getGroundY(): number {
    return Math.floor(this.height * CANVAS.GROUND_Y_PERCENT);
  }

  getPlayerX(): number {
    return Math.floor(this.width * CANVAS.PLAYER_X_PERCENT);
  }
}
```

## Rendering Pipeline

```typescript
// Render order in Game.ts

render(): void {
  // 1. Clear canvas (sky already drawn)
  this.renderer.clear();

  // 2. Buildings (slow parallax)
  this.backgroundLayer.render(this.renderer.getGroundY());

  // 3. Ground + crosswalks
  this.gameLayer.renderGround(
    this.renderer.getGroundY(),
    this.renderer.getHeight()
  );

  // 4. Obstacles
  this.gameLayer.renderObstacles(
    this.obstacles,
    this.renderer.getGroundY()
  );

  // 5. Player (if active)
  this.gameLayer.renderPlayer(
    this.player,
    this.renderer.getGroundY()
  );

  // 6-7. UI (score) and Overlays - managed by current state
}
```

---
