/**
 * Classic Skin
 * Original geometric character: circle head, rectangle body, rectangle legs
 */

import { PlayerSkin, AnimationData } from './PlayerSkin';
import { Position } from '../core/types';
import { PLAYER, COLORS, COLLISION } from '../config/constants';

export class ClassicSkin implements PlayerSkin {
  async init(): Promise<void> {
    // No assets to load for classic skin
  }

  render(
    ctx: CanvasRenderingContext2D,
    position: Position,
    animationData: AnimationData,
  ): void {
    const { state, runPhase, squashFactor, isColliding, groundY } =
      animationData;

    const bodyColor = isColliding ? COLLISION.FLASH_COLOR : COLORS.PLAYER_BODY;
    const headColor = isColliding ? COLLISION.FLASH_COLOR : COLORS.PLAYER_HEAD;

    const legOffset =
      state === 'idle'
        ? Math.sin(runPhase * Math.PI * 2) * PLAYER.LEG_AMPLITUDE
        : 0;

    const baseBodyHeight =
      PLAYER.HEIGHT - PLAYER.HEAD_RADIUS - PLAYER.LEG_HEIGHT;

    const isSquashing =
      squashFactor.scaleY !== 1 || squashFactor.scaleX !== 1;

    if (isSquashing) {
      this.renderSquash(
        ctx,
        position,
        squashFactor,
        bodyColor,
        headColor,
        baseBodyHeight,
        groundY,
      );
    } else {
      this.renderNormal(
        ctx,
        position,
        bodyColor,
        headColor,
        baseBodyHeight,
        legOffset,
      );
    }
  }

  getName(): string {
    return 'Classic';
  }

  getThumbnail(): HTMLCanvasElement | null {
    return null;
  }

  private renderSquash(
    ctx: CanvasRenderingContext2D,
    position: Position,
    squashFactor: { scaleX: number; scaleY: number },
    bodyColor: string,
    headColor: string,
    baseBodyHeight: number,
    groundY: number,
  ): void {
    const scaledWidth = PLAYER.WIDTH * squashFactor.scaleX;
    const scaledBodyHeight = baseBodyHeight * squashFactor.scaleY;
    const scaledLegHeight = PLAYER.LEG_HEIGHT * squashFactor.scaleY;
    const scaledHeadRadius = PLAYER.HEAD_RADIUS * squashFactor.scaleY;

    const feetY = groundY;
    const legY = feetY - scaledLegHeight;
    const bodyY = legY - scaledBodyHeight;
    const headY = bodyY - scaledHeadRadius;

    const xOffset = (scaledWidth - PLAYER.WIDTH) / 2;
    const playerX = position.x - xOffset;

    const scaledLegWidth = PLAYER.LEG_WIDTH * squashFactor.scaleX;
    const scaledLegGap = PLAYER.LEG_GAP * squashFactor.scaleX;
    const leftLegX =
      playerX + (scaledWidth - scaledLegGap) / 2 - scaledLegWidth;
    const rightLegX = playerX + (scaledWidth + scaledLegGap) / 2;

    // Legs
    ctx.fillStyle = bodyColor;
    ctx.fillRect(leftLegX, legY, scaledLegWidth, scaledLegHeight);
    ctx.fillRect(rightLegX, legY, scaledLegWidth, scaledLegHeight);

    // Body
    ctx.fillRect(playerX, bodyY, scaledWidth, scaledBodyHeight);

    // Head
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(
      playerX + scaledWidth / 2,
      headY,
      scaledHeadRadius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  private renderNormal(
    ctx: CanvasRenderingContext2D,
    position: Position,
    bodyColor: string,
    headColor: string,
    baseBodyHeight: number,
    legOffset: number,
  ): void {
    const bodyY = position.y + PLAYER.HEAD_RADIUS;
    const legY = bodyY + baseBodyHeight;
    const leftLegX =
      position.x + (PLAYER.WIDTH - PLAYER.LEG_GAP) / 2 - PLAYER.LEG_WIDTH;
    const rightLegX = position.x + (PLAYER.WIDTH + PLAYER.LEG_GAP) / 2;

    // Legs
    ctx.fillStyle = bodyColor;
    ctx.fillRect(
      leftLegX + legOffset,
      legY,
      PLAYER.LEG_WIDTH,
      PLAYER.LEG_HEIGHT,
    );
    ctx.fillRect(
      rightLegX - legOffset,
      legY,
      PLAYER.LEG_WIDTH,
      PLAYER.LEG_HEIGHT,
    );

    // Body
    ctx.fillRect(position.x, bodyY, PLAYER.WIDTH, baseBodyHeight);

    // Head
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(
      position.x + PLAYER.WIDTH / 2,
      position.y + PLAYER.HEAD_RADIUS,
      PLAYER.HEAD_RADIUS,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
