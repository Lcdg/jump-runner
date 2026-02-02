/**
 * Input Manager
 * Handles keyboard, mouse, and touch input for the game
 */

import { InputAction } from '../core/types';
import { isTouchDevice } from '../utils/platform';

type InputCallback = (action: InputAction) => void;

export class InputManager {
  private callback: InputCallback | null = null;
  private isJumpKeyDown: boolean = false;
  private activeTouchId: number | null = null;
  private touchActive: boolean = false;

  attach(callback: InputCallback): void {
    this.callback = callback;
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    if (isTouchDevice()) {
      document.addEventListener('touchstart', this.handleTouchStart, {
        passive: false,
      });
      document.addEventListener('touchend', this.handleTouchEnd, {
        passive: false,
      });
      document.addEventListener('touchcancel', this.handleTouchEnd, {
        passive: false,
      });
    } else {
      document.addEventListener('mousedown', this.handleMouseDown);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  detach(): void {
    this.callback = null;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchcancel', this.handleTouchEnd);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;

    if (event.code === 'Space') {
      event.preventDefault();
      if (!this.isJumpKeyDown) {
        this.isJumpKeyDown = true;
        this.emit({ type: 'jump_start' });
      }
    } else if (event.code === 'KeyS' || event.code === 'Escape') {
      this.emit({ type: 'toggle_skin_selector' });
    } else if (event.code === 'ArrowLeft') {
      this.emit({ type: 'skin_prev' });
    } else if (event.code === 'ArrowRight') {
      this.emit({ type: 'skin_next' });
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (event.code === 'Space') {
      if (this.isJumpKeyDown) {
        this.isJumpKeyDown = false;
        this.emit({ type: 'jump_end' });
      }
    }
  };

  private handleMouseDown = (event: MouseEvent): void => {
    if (event.button === 0 && !this.isJumpKeyDown) {
      this.isJumpKeyDown = true;
      this.emit({ type: 'jump_start' });
    }
  };

  private handleMouseUp = (event: MouseEvent): void => {
    if (event.button === 0 && this.isJumpKeyDown) {
      this.isJumpKeyDown = false;
      this.emit({ type: 'jump_end' });
    }
  };

  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    if (this.activeTouchId !== null) return;

    const touch = event.changedTouches[0];
    this.activeTouchId = touch.identifier;
    this.touchActive = true;

    if (!this.isJumpKeyDown) {
      this.isJumpKeyDown = true;
      this.emit({ type: 'jump_start' });
    }
  };

  private handleTouchEnd = (event: TouchEvent): void => {
    event.preventDefault();

    for (let i = 0; i < event.changedTouches.length; i++) {
      if (event.changedTouches[i].identifier === this.activeTouchId) {
        this.activeTouchId = null;
        this.touchActive = false;

        if (this.isJumpKeyDown) {
          this.isJumpKeyDown = false;
          this.emit({ type: 'jump_end' });
        }
        return;
      }
    }
  };

  private emit(action: InputAction): void {
    if (this.callback) {
      this.callback(action);
    }
  }

  reset(): void {
    this.isJumpKeyDown = false;
    this.activeTouchId = null;
    this.touchActive = false;
  }

  isJumpHeld(): boolean {
    return this.isJumpKeyDown;
  }

  isTouchActive(): boolean {
    return this.touchActive;
  }
}
