/**
 * Game State Manager
 * Manages game state transitions with validation
 */

import { GameStateType } from './types';

export interface StateCallbacks {
  onEnter?: () => void;
  onExit?: () => void;
}

export class GameStateManager {
  private currentState: GameStateType = 'attract';
  private stateCallbacks: Map<GameStateType, StateCallbacks> = new Map();

  private readonly validTransitions: Map<GameStateType, GameStateType[]> = new Map([
    ['attract', ['playing']],
    ['playing', ['gameOver']],
    ['gameOver', ['attract']],
  ]);

  /**
   * Attempt to transition to a new state
   * @param to Target state
   * @returns true if transition was valid and executed, false otherwise
   */
  transition(to: GameStateType): boolean {
    const allowed = this.validTransitions.get(this.currentState);
    if (!allowed?.includes(to)) {
      return false;
    }

    // Call onExit for current state
    const exitCallbacks = this.stateCallbacks.get(this.currentState);
    if (exitCallbacks?.onExit) {
      exitCallbacks.onExit();
    }

    // Change state
    this.currentState = to;

    // Call onEnter for new state
    const enterCallbacks = this.stateCallbacks.get(to);
    if (enterCallbacks?.onEnter) {
      enterCallbacks.onEnter();
    }

    return true;
  }

  /**
   * Get current game state
   */
  getState(): GameStateType {
    return this.currentState;
  }

  /**
   * Check if currently in a specific state
   */
  isState(state: GameStateType): boolean {
    return this.currentState === state;
  }

  /**
   * Register callbacks for a specific state
   */
  registerCallbacks(state: GameStateType, callbacks: StateCallbacks): void {
    this.stateCallbacks.set(state, callbacks);
  }

  /**
   * Reset to initial state (attract)
   */
  reset(): void {
    this.currentState = 'attract';
  }
}
