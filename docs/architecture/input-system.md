# Input System

## InputManager

```typescript
// src/input/InputManager.ts

import { InputAction } from '../core/types';

type InputCallback = (action: InputAction) => void;

export class InputManager {
  private callback: InputCallback | null = null;
  private isJumpKeyDown: boolean = false;

  attach(callback: InputCallback): void {
    this.callback = callback;
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('keydown', this.preventSpaceScroll);
  }

  detach(): void {
    this.callback = null;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('keydown', this.preventSpaceScroll);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    if (event.code === 'Space' && !this.isJumpKeyDown) {
      this.isJumpKeyDown = true;
      this.emit({ type: 'jump_start' });
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (event.code === 'Space' && this.isJumpKeyDown) {
      this.isJumpKeyDown = false;
      this.emit({ type: 'jump_end' });
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

  private preventSpaceScroll = (event: KeyboardEvent): void => {
    if (event.code === 'Space') event.preventDefault();
  };

  private emit(action: InputAction): void {
    if (this.callback) this.callback(action);
  }

  reset(): void {
    this.isJumpKeyDown = false;
  }

  isJumpHeld(): boolean {
    return this.isJumpKeyDown;
  }
}
```

---
