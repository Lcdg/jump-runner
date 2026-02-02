/**
 * Performance Monitor
 * Tracks FPS and provides adaptive quality settings
 */

const SAMPLE_SIZE = 30;
const LOW_FPS_THRESHOLD = 50;
const HIGH_FPS_THRESHOLD = 55;
const DOWNGRADE_DELAY = 2;
const UPGRADE_DELAY = 5;

export class PerformanceMonitor {
  private frameTimes: number[] = [];
  private lowQuality: boolean = false;
  private lowFpsTimer: number = 0;
  private highFpsTimer: number = 0;

  update(deltaTime: number): void {
    // Track frame time
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > SAMPLE_SIZE) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length < SAMPLE_SIZE) return;

    const avgFps = this.getAverageFps();

    if (avgFps < LOW_FPS_THRESHOLD) {
      this.highFpsTimer = 0;
      this.lowFpsTimer += deltaTime;
      if (this.lowFpsTimer >= DOWNGRADE_DELAY && !this.lowQuality) {
        this.lowQuality = true;
      }
    } else if (avgFps > HIGH_FPS_THRESHOLD) {
      this.lowFpsTimer = 0;
      this.highFpsTimer += deltaTime;
      if (this.highFpsTimer >= UPGRADE_DELAY && this.lowQuality) {
        this.lowQuality = false;
      }
    } else {
      this.lowFpsTimer = 0;
      this.highFpsTimer = 0;
    }
  }

  getAverageFps(): number {
    if (this.frameTimes.length === 0) return 60;
    const avgDelta =
      this.frameTimes.reduce((sum, dt) => sum + dt, 0) /
      this.frameTimes.length;
    return avgDelta > 0 ? 1 / avgDelta : 60;
  }

  isLowQuality(): boolean {
    return this.lowQuality;
  }

  reset(): void {
    this.frameTimes = [];
    this.lowQuality = false;
    this.lowFpsTimer = 0;
    this.highFpsTimer = 0;
  }
}
