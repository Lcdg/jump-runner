/**
 * Jump Runner - Entry Point
 */

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

function resizeCanvas(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function render(): void {
  if (!ctx) return;

  // Clear canvas with background color
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(): void {
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
gameLoop();
