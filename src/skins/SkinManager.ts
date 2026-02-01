/**
 * Skin Manager
 * Registry for player skins with activation support and localStorage persistence
 */

import { PlayerSkin } from './PlayerSkin';

const STORAGE_KEY = 'jumprunner-skin';

export class SkinManager {
  private skins: Map<string, PlayerSkin> = new Map();
  private activeSkinName: string = '';

  register(skin: PlayerSkin): void {
    this.skins.set(skin.getName(), skin);
    if (this.activeSkinName === '') {
      this.activeSkinName = skin.getName();
    }
  }

  setActive(name: string): void {
    if (!this.skins.has(name)) {
      throw new Error(`Skin "${name}" not found`);
    }
    this.activeSkinName = name;
    this.savePref(name);
  }

  getActive(): PlayerSkin {
    const skin = this.skins.get(this.activeSkinName);
    if (!skin) {
      throw new Error('No active skin set');
    }
    return skin;
  }

  getActiveName(): string {
    return this.activeSkinName;
  }

  getAll(): PlayerSkin[] {
    return Array.from(this.skins.values());
  }

  getAllNames(): string[] {
    return Array.from(this.skins.keys());
  }

  has(name: string): boolean {
    return this.skins.has(name);
  }

  loadPref(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.skins.has(saved)) {
        this.activeSkinName = saved;
      }
    } catch {
      // localStorage not available (SSR, privacy mode, etc.)
    }
  }

  private savePref(name: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // localStorage not available
    }
  }
}
