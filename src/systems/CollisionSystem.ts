/**
 * Collision System
 * Stateless collision detection using AABB algorithm
 */

import { Hitbox } from '../core/types';

/**
 * Check if two axis-aligned bounding boxes overlap
 * @param a First hitbox in world coordinates
 * @param b Second hitbox in world coordinates
 * @returns true if hitboxes overlap (not just adjacent)
 */
export function checkAABBCollision(a: Hitbox, b: Hitbox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
