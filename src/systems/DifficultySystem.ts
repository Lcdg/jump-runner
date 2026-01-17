/**
 * Difficulty System
 * Stateless difficulty progression calculation
 */

import { DIFFICULTY } from '../config/constants';

export interface SpawnInterval {
  min: number;
  max: number;
}

/**
 * Calculate spawn interval based on elapsed game time
 * Uses linear interpolation from initial (easy) to final (hard) values
 * Plateaus after PLATEAU_TIME seconds
 *
 * @param elapsedTime Time in seconds since game started
 * @returns min and max spawn intervals in seconds
 */
export function calculateSpawnInterval(elapsedTime: number): SpawnInterval {
  // Calculate progress (0 to 1), clamped at plateau
  const progress = Math.min(elapsedTime / DIFFICULTY.PLATEAU_TIME, 1);

  // Linear interpolation from initial to final values
  const min =
    DIFFICULTY.INITIAL_MIN_INTERVAL +
    (DIFFICULTY.FINAL_MIN_INTERVAL - DIFFICULTY.INITIAL_MIN_INTERVAL) * progress;

  const max =
    DIFFICULTY.INITIAL_MAX_INTERVAL +
    (DIFFICULTY.FINAL_MAX_INTERVAL - DIFFICULTY.INITIAL_MAX_INTERVAL) * progress;

  return { min, max };
}

/**
 * Get a random spawn time based on current difficulty
 * @param elapsedTime Time in seconds since game started
 * @returns Random spawn time in seconds
 */
export function getSpawnTime(elapsedTime: number): number {
  const { min, max } = calculateSpawnInterval(elapsedTime);
  return min + Math.random() * (max - min);
}
