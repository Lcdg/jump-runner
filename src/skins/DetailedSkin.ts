/**
 * Detailed Skin
 * Renders a detailed human character using programmatically generated sprite sheets
 * with AnimationController for smooth state transitions.
 */

import { PlayerSkin, AnimationData } from './PlayerSkin';
import { Position } from '../core/types';
import { SpriteSheet } from '../rendering/SpriteSheet';
import {
  generateAllSprites,
  SPRITE_FRAME_SIZE,
  SPRITE_FRAME_COUNTS,
} from './SpriteGenerator';
import { PLAYER, COLLISION } from '../config/constants';
import { AnimationController } from './AnimationController';

// Render dimensions — larger than hitbox for visual detail
const RENDER_WIDTH = PLAYER.WIDTH + 46;
const RENDER_HEIGHT = PLAYER.HEIGHT + 56;

export class DetailedSkin implements PlayerSkin {
  private sheets: Map<string, SpriteSheet> = new Map();
  private initialized: boolean = false;
  private animController: AnimationController = new AnimationController();

  async init(): Promise<void> {
    const sprites = generateAllSprites();

    this.sheets.set(
      'idle',
      SpriteSheet.fromCanvas(
        sprites.idle,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_COUNTS.idle,
      ),
    );
    this.sheets.set(
      'run',
      SpriteSheet.fromCanvas(
        sprites.run,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_COUNTS.run,
      ),
    );
    this.sheets.set(
      'jump',
      SpriteSheet.fromCanvas(
        sprites.jump,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_COUNTS.jump,
      ),
    );
    this.sheets.set(
      'fall',
      SpriteSheet.fromCanvas(
        sprites.fall,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_COUNTS.fall,
      ),
    );
    this.sheets.set(
      'land',
      SpriteSheet.fromCanvas(
        sprites.land,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_SIZE,
        SPRITE_FRAME_COUNTS.land,
      ),
    );

    this.initialized = true;
  }

  render(
    ctx: CanvasRenderingContext2D,
    position: Position,
    animationData: AnimationData,
  ): void {
    if (!this.initialized) return;

    const { state, squashFactor, isColliding, groundY, deltaTime, gameSpeed } =
      animationData;

    // Update animation controller
    this.animController.setState(state);
    this.animController.update(deltaTime, gameSpeed);

    const { sheetKey, frameIndex } = this.animController.getState();
    const sheet = this.sheets.get(sheetKey);
    if (!sheet) return;

    const isSquashing =
      squashFactor.scaleX !== 1 || squashFactor.scaleY !== 1;

    let drawX: number;
    let drawY: number;
    let drawW: number;
    let drawH: number;

    if (isSquashing) {
      // Anchor at ground (feet)
      drawW = RENDER_WIDTH * squashFactor.scaleX;
      drawH = RENDER_HEIGHT * squashFactor.scaleY;
      drawX = position.x + (PLAYER.WIDTH - drawW) / 2;
      drawY = groundY - drawH;
    } else {
      drawW = RENDER_WIDTH;
      drawH = RENDER_HEIGHT;
      // Anchor feet at bottom of hitbox (position.y + PLAYER.HEIGHT = feet)
      drawX = position.x + (PLAYER.WIDTH - drawW) / 2;
      drawY = position.y + PLAYER.HEIGHT - drawH;
    }

    if (isColliding) {
      // Flash effect: draw with brightness overlay
      ctx.save();
      sheet.drawFrame(ctx, frameIndex, drawX, drawY, drawW, drawH);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = COLLISION.FLASH_COLOR;
      ctx.fillRect(drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      sheet.drawFrame(ctx, frameIndex, drawX, drawY, drawW, drawH);
    }
  }

  getName(): string {
    return 'Detailed';
  }

  getThumbnail(): HTMLCanvasElement | null {
    const sheet = this.sheets.get('idle');
    if (!sheet) return null;

    const thumb = document.createElement('canvas');
    thumb.width = 64;
    thumb.height = 64;
    const ctx = thumb.getContext('2d');
    if (!ctx) return null;

    sheet.drawFrame(ctx, 0, 0, 0, 64, 64);
    return thumb;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getAnimationController(): AnimationController {
    return this.animController;
  }
}
