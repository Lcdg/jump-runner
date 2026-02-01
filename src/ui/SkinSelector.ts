/**
 * Skin Selector UI
 * Overlay for choosing player skins in Attract Mode
 */

import { SkinManager } from '../skins/SkinManager';
import { UI, COLORS } from '../config/constants';

// Arrow button hit zones (set during render)
interface HitZone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class SkinSelector {
  private isOpen: boolean = false;
  private skinManager: SkinManager;
  private previewIndex: number = 0;
  private prevArrow: HitZone = { x: 0, y: 0, w: 0, h: 0 };
  private nextArrow: HitZone = { x: 0, y: 0, w: 0, h: 0 };

  constructor(skinManager: SkinManager) {
    this.skinManager = skinManager;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Sync preview index with current active skin
      const names = this.skinManager.getAllNames();
      const activeIdx = names.indexOf(this.skinManager.getActiveName());
      this.previewIndex = activeIdx >= 0 ? activeIdx : 0;
    }
  }

  close(): void {
    this.isOpen = false;
  }

  isVisible(): boolean {
    return this.isOpen;
  }

  nextSkin(): void {
    if (!this.isOpen) return;
    const names = this.skinManager.getAllNames();
    this.previewIndex = (this.previewIndex + 1) % names.length;
    this.applySelection();
  }

  prevSkin(): void {
    if (!this.isOpen) return;
    const names = this.skinManager.getAllNames();
    this.previewIndex = (this.previewIndex - 1 + names.length) % names.length;
    this.applySelection();
  }

  handleClick(x: number, y: number): boolean {
    if (!this.isOpen) return false;

    if (this.hitTest(x, y, this.prevArrow)) {
      this.prevSkin();
      return true;
    }
    if (this.hitTest(x, y, this.nextArrow)) {
      this.nextSkin();
      return true;
    }
    return false;
  }

  private hitTest(x: number, y: number, zone: HitZone): boolean {
    return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
  }

  private applySelection(): void {
    const names = this.skinManager.getAllNames();
    const name = names[this.previewIndex];
    if (name) {
      this.skinManager.setActive(name);
    }
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (!this.isOpen) return;

    const names = this.skinManager.getAllNames();
    const currentName = names[this.previewIndex] ?? '';

    // Overlay background
    ctx.fillStyle = COLORS.OVERLAY_BG;
    ctx.fillRect(0, 0, width, height);

    // Box dimensions
    const boxW = 320;
    const boxH = 220;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    // Box background
    ctx.fillStyle = '#1B263B';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Box border
    ctx.strokeStyle = '#778DA9';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Title
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = UI.OVERLAY_COLOR;
    ctx.fillText('SELECT SKIN', width / 2, boxY + 35);

    // Arrows (store hit zones for click detection)
    const arrowSize = 40;
    const arrowY = boxY + boxH / 2 - arrowSize / 2;

    this.prevArrow = { x: boxX + 15, y: arrowY, w: arrowSize, h: arrowSize };
    this.nextArrow = { x: boxX + boxW - 15 - arrowSize, y: arrowY, w: arrowSize, h: arrowSize };

    ctx.font = '32px Arial';
    ctx.fillStyle = '#778DA9';
    ctx.fillText('◄', boxX + 40, boxY + boxH / 2);
    ctx.fillText('►', boxX + boxW - 40, boxY + boxH / 2);

    // Skin name (highlighted)
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FFD60A';
    ctx.fillText(currentName, width / 2, boxY + boxH / 2);

    // Counter
    ctx.font = '14px Arial';
    ctx.fillStyle = '#778DA9';
    ctx.fillText(
      `${this.previewIndex + 1} / ${names.length}`,
      width / 2,
      boxY + boxH / 2 + 30,
    );

    // Close hint
    ctx.font = '14px Arial';
    ctx.fillStyle = '#E0E1DD';
    ctx.fillText('Press S or ESC to close', width / 2, boxY + boxH - 25);

    // Reset alignment
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
