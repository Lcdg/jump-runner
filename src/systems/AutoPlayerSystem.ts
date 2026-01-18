/**
 * Auto Player System
 * Simple AI logic for attract mode auto-play
 */

import { AUTO_PLAYER } from '../config/constants';

export interface ObstacleData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AutoPlayerInput {
  playerX: number;
  playerY: number;
  playerWidth: number;
  playerHeight: number;
  groundY: number;
  isOnGround: boolean;
  obstacles: ObstacleData[];
}

/**
 * Find the nearest obstacle ahead of the player
 */
function findNearestObstacleAhead(
  input: AutoPlayerInput
): ObstacleData | null {
  const playerRight = input.playerX + input.playerWidth;

  let nearest: ObstacleData | null = null;
  let nearestDistance = Infinity;

  for (const obstacle of input.obstacles) {
    // Only consider obstacles ahead of the player
    if (obstacle.x + obstacle.width > playerRight) {
      const distance = obstacle.x - playerRight;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = obstacle;
      }
    }
  }

  return nearest;
}

/**
 * Determine if the auto-player should jump
 * Returns true if the player should jump to avoid an obstacle
 */
export function shouldAutoJump(input: AutoPlayerInput): boolean {
  // Can only jump when on ground
  if (!input.isOnGround) {
    return false;
  }

  const nearest = findNearestObstacleAhead(input);
  if (!nearest) {
    return false;
  }

  const playerRight = input.playerX + input.playerWidth;
  const distance = nearest.x - playerRight;

  // Check if obstacle is within jump threshold
  if (distance <= 0 || distance > AUTO_PLAYER.JUMP_THRESHOLD) {
    return false;
  }

  // Add some imperfection - small chance to miss
  if (Math.random() < AUTO_PLAYER.MISS_CHANCE) {
    return false;
  }

  return true;
}

/**
 * Get distance to nearest obstacle (for testing/debugging)
 */
export function getDistanceToNearestObstacle(
  input: AutoPlayerInput
): number | null {
  const nearest = findNearestObstacleAhead(input);
  if (!nearest) {
    return null;
  }

  const playerRight = input.playerX + input.playerWidth;
  return nearest.x - playerRight;
}
