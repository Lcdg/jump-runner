/**
 * Sprite Generator
 * Programmatically generates detailed character sprite sheets using Canvas
 * Style: Urban night runner — hoodie, jeans, sneakers
 * Character faces RIGHT (running left to right)
 */

const FRAME_SIZE = 128;

// Character is drawn so feet are at FEET_Y (near bottom of frame)
const FEET_Y = 120;

// Color palette — urban night theme with orange accents
const PALETTE = {
  skin: '#E8B89D',
  skinShadow: '#C4956C',
  hair: '#2C1810',
  hoodie: '#FF6B35',
  hoodieShadow: '#D45A2A',
  hoodieHighlight: '#FF8C42',
  jeans: '#2A4066',
  jeansShadow: '#1B2D4A',
  sneakers: '#E0E1DD',
  sneakersAccent: '#FF6B35',
  eyeWhite: '#FFFFFF',
  eyePupil: '#1B1B1B',
};

interface LimbPos {
  x: number;
  y: number;
  angle: number;
}

interface Pose {
  headOffsetY: number;
  bodyOffsetY: number;
  bodyLean: number;
  leftArm: LimbPos;
  rightArm: LimbPos;
  leftLeg: LimbPos;
  rightLeg: LimbPos;
}

// Scaled body part dimensions
const HEAD_RADIUS = 13;
const TORSO_WIDTH = 24;
const TORSO_HEIGHT = 30;
const ARM_LENGTH = 26;
const LEG_LENGTH = 34;
const ARM_WIDTH = 4;
const LEG_WIDTH = 5;

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  const r = HEAD_RADIUS;

  // Hair (back)
  ctx.fillStyle = PALETTE.hair;
  ctx.beginPath();
  ctx.ellipse(x, y - r * 0.2, r * 1.15, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head shape
  ctx.fillStyle = PALETTE.skin;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shadow on right side of face (light from left)
  ctx.fillStyle = PALETTE.skinShadow;
  ctx.beginPath();
  ctx.ellipse(
    x + r * 0.25,
    y + r * 0.1,
    r * 0.45,
    r * 0.65,
    0.2,
    0,
    Math.PI,
  );
  ctx.fill();

  // Eyes — looking right
  const eyeY = y - r * 0.05;
  const eyeSpacing = r * 0.35;
  // Left eye
  ctx.fillStyle = PALETTE.eyeWhite;
  ctx.beginPath();
  ctx.ellipse(x - eyeSpacing, eyeY, r * 0.2, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.eyePupil;
  ctx.beginPath();
  ctx.arc(x - eyeSpacing + 2, eyeY, r * 0.09, 0, Math.PI * 2);
  ctx.fill();
  // Right eye
  ctx.fillStyle = PALETTE.eyeWhite;
  ctx.beginPath();
  ctx.ellipse(x + eyeSpacing, eyeY, r * 0.2, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.eyePupil;
  ctx.beginPath();
  ctx.arc(x + eyeSpacing + 2, eyeY, r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Hair (front/top)
  ctx.fillStyle = PALETTE.hair;
  ctx.beginPath();
  ctx.ellipse(x, y - r * 0.65, r * 1.1, r * 0.6, 0, Math.PI, Math.PI * 2);
  ctx.fill();
}

function drawTorso(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lean: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);

  const w = TORSO_WIDTH;
  const h = TORSO_HEIGHT;

  // Hoodie body
  ctx.fillStyle = PALETTE.hoodie;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h * 0.1);
  ctx.quadraticCurveTo(-w / 2 - 2, h * 0.5, -w / 2 + 1, h);
  ctx.lineTo(w / 2 - 1, h);
  ctx.quadraticCurveTo(w / 2 + 2, h * 0.5, w / 2, -h * 0.1);
  ctx.closePath();
  ctx.fill();

  // Shadow (right side)
  ctx.fillStyle = PALETTE.hoodieShadow;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, -h * 0.05);
  ctx.quadraticCurveTo(w / 2 + 1, h * 0.5, w / 2 - 2, h);
  ctx.lineTo(w * 0.1, h);
  ctx.closePath();
  ctx.fill();

  // Hoodie pocket line
  ctx.strokeStyle = PALETTE.hoodieShadow;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, h * 0.55);
  ctx.quadraticCurveTo(0, h * 0.65, w * 0.3, h * 0.55);
  ctx.stroke();

  // Collar / hood
  ctx.fillStyle = PALETTE.hoodieHighlight;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.05, w * 0.35, h * 0.1, 0, 0, Math.PI);
  ctx.fill();

  ctx.restore();
}

function drawArm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const len = ARM_LENGTH;
  const w = ARM_WIDTH;

  // Upper arm (hoodie sleeve)
  ctx.fillStyle = PALETTE.hoodie;
  ctx.fillRect(-w, 0, w * 2, len * 0.55);

  // Lower arm (skin)
  ctx.fillStyle = PALETTE.skin;
  ctx.fillRect(-w + 0.5, len * 0.5, w * 2 - 1, len * 0.42);

  // Hand
  ctx.fillStyle = PALETTE.skin;
  ctx.beginPath();
  ctx.arc(0, len * 0.92, w, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLeg(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const len = LEG_LENGTH;
  const w = LEG_WIDTH;

  // Upper leg (jeans)
  ctx.fillStyle = PALETTE.jeans;
  ctx.fillRect(-w, 0, w * 2, len * 0.55);

  // Lower leg (jeans darker)
  ctx.fillStyle = PALETTE.jeansShadow;
  ctx.fillRect(-w + 0.5, len * 0.5, w * 2 - 1, len * 0.38);

  // Sneaker — pointing right (forward direction)
  ctx.fillStyle = PALETTE.sneakers;
  ctx.beginPath();
  ctx.moveTo(-w, len * 0.85);
  ctx.lineTo(w + 4, len * 0.85);
  ctx.lineTo(w + 5, len * 0.92);
  ctx.lineTo(w + 5, len);
  ctx.lineTo(-w, len);
  ctx.closePath();
  ctx.fill();

  // Sneaker accent stripe
  ctx.fillStyle = PALETTE.sneakersAccent;
  ctx.fillRect(-w + 1, len * 0.9, w * 2 + 3, 2);

  ctx.restore();
}

function drawCharacter(ctx: CanvasRenderingContext2D, pose: Pose): void {
  const cx = FRAME_SIZE / 2;

  // Calculate body positions relative to feet
  // Feet are at FEET_Y, legs go up from there, body above legs, head above body
  const hipY = FEET_Y - LEG_LENGTH + pose.bodyOffsetY;
  const torsoY = hipY - TORSO_HEIGHT * 0.85;
  const headY = torsoY - HEAD_RADIUS * 0.8 + pose.headOffsetY;

  const leanOffset = Math.sin(pose.bodyLean) * 5;

  // Draw order: back leg, back arm, body, front leg, front arm, head
  // Back leg
  drawLeg(ctx, cx + pose.leftLeg.x - 3, hipY + pose.leftLeg.y, pose.leftLeg.angle);

  // Back arm (right side of body, farther from viewer)
  drawArm(
    ctx,
    cx + leanOffset + pose.rightArm.x + TORSO_WIDTH / 2 - 2,
    torsoY + TORSO_HEIGHT * 0.1 + pose.rightArm.y,
    pose.rightArm.angle,
  );

  // Torso
  drawTorso(ctx, cx + leanOffset, torsoY, pose.bodyLean);

  // Front leg
  drawLeg(ctx, cx + pose.rightLeg.x + 3, hipY + pose.rightLeg.y, pose.rightLeg.angle);

  // Front arm (left side of body, closer to viewer)
  drawArm(
    ctx,
    cx + leanOffset + pose.leftArm.x - TORSO_WIDTH / 2 + 2,
    torsoY + TORSO_HEIGHT * 0.1 + pose.leftArm.y,
    pose.leftArm.angle,
  );

  // Head
  drawHead(ctx, cx + leanOffset * 1.3, headY);
}

function generateIdleFrames(): HTMLCanvasElement {
  const canvas = createCanvas(FRAME_SIZE * 2, FRAME_SIZE);
  const ctx = canvas.getContext('2d')!;

  const basePose: Pose = {
    headOffsetY: 0,
    bodyOffsetY: 0,
    bodyLean: 0,
    leftArm: { x: 0, y: 0, angle: 0.15 },
    rightArm: { x: 0, y: 0, angle: -0.15 },
    leftLeg: { x: -3, y: 0, angle: 0.03 },
    rightLeg: { x: 3, y: 0, angle: -0.03 },
  };

  // Frame 0: neutral
  ctx.save();
  drawCharacter(ctx, basePose);
  ctx.restore();

  // Frame 1: slight breathing
  ctx.save();
  ctx.translate(FRAME_SIZE, 0);
  drawCharacter(ctx, {
    ...basePose,
    headOffsetY: 1,
    bodyOffsetY: 1,
    leftArm: { x: 0, y: 0.5, angle: 0.17 },
    rightArm: { x: 0, y: 0.5, angle: -0.17 },
  });
  ctx.restore();

  return canvas;
}

function generateRunFrames(): HTMLCanvasElement {
  const canvas = createCanvas(FRAME_SIZE * 8, FRAME_SIZE);
  const ctx = canvas.getContext('2d')!;

  for (let i = 0; i < 8; i++) {
    const phase = (i / 8) * Math.PI * 2;
    // Positive angle = clockwise = limb swings RIGHT = forward for running right
    const legSwing = Math.sin(phase) * 0.55;
    // Body drops when legs are spread (|sin| max), rises when legs cross (sin ~0)
    const bounce = Math.abs(Math.sin(phase)) * 3;
    const lean = 0.15; // Forward lean (leaning right)

    ctx.save();
    ctx.translate(i * FRAME_SIZE, 0);
    drawCharacter(ctx, {
      headOffsetY: bounce,
      bodyOffsetY: bounce,
      bodyLean: lean,
      // Cross-lateral: back arm (leftArm/screen-left) swings with front leg (rightLeg)
      // When rightLeg goes forward (positive), leftArm goes forward (positive)
      leftArm: { x: 0, y: 0, angle: legSwing * 0.8 + lean },
      rightArm: { x: 0, y: 0, angle: -legSwing * 0.8 + lean },
      // rightLeg = front leg (screen-right), leftLeg = back leg (screen-left)
      leftLeg: { x: -2, y: 0, angle: -legSwing },
      rightLeg: { x: 2, y: 0, angle: legSwing },
    });
    ctx.restore();
  }

  return canvas;
}

function generateJumpFrames(): HTMLCanvasElement {
  const canvas = createCanvas(FRAME_SIZE * 3, FRAME_SIZE);
  const ctx = canvas.getContext('2d')!;

  const jumpPoses: Pose[] = [
    // Frame 0: Crouch / impulse (pushing down)
    {
      headOffsetY: 8,
      bodyOffsetY: 10,
      bodyLean: 0.05,
      leftArm: { x: 0, y: 2, angle: 0.5 },
      rightArm: { x: 0, y: 2, angle: -0.5 },
      leftLeg: { x: -4, y: 0, angle: 0.35 },
      rightLeg: { x: 4, y: 0, angle: -0.35 },
    },
    // Frame 1: Launch (arms up, legs extending)
    {
      headOffsetY: -4,
      bodyOffsetY: -2,
      bodyLean: 0.08,
      leftArm: { x: 0, y: -3, angle: -0.7 },
      rightArm: { x: 0, y: -3, angle: 0.7 },
      leftLeg: { x: -3, y: 3, angle: 0.1 },
      rightLeg: { x: 3, y: 3, angle: -0.1 },
    },
    // Frame 2: Airborne (tucked, leaning forward)
    {
      headOffsetY: -6,
      bodyOffsetY: -4,
      bodyLean: 0.12,
      leftArm: { x: 0, y: -1, angle: -0.3 },
      rightArm: { x: 0, y: -1, angle: 0.3 },
      leftLeg: { x: -3, y: 5, angle: 0.4 },
      rightLeg: { x: 3, y: 5, angle: -0.2 },
    },
  ];

  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(i * FRAME_SIZE, 0);
    drawCharacter(ctx, jumpPoses[i]);
    ctx.restore();
  }

  return canvas;
}

function generateFallFrames(): HTMLCanvasElement {
  const canvas = createCanvas(FRAME_SIZE * 2, FRAME_SIZE);
  const ctx = canvas.getContext('2d')!;

  const fallPoses: Pose[] = [
    // Frame 0: Falling, limbs spread
    {
      headOffsetY: -4,
      bodyOffsetY: -2,
      bodyLean: -0.05,
      leftArm: { x: 0, y: 0, angle: -0.8 },
      rightArm: { x: 0, y: 0, angle: 0.8 },
      leftLeg: { x: -4, y: 2, angle: -0.15 },
      rightLeg: { x: 4, y: 2, angle: 0.25 },
    },
    // Frame 1: Bracing for landing (legs extending down)
    {
      headOffsetY: -2,
      bodyOffsetY: 0,
      bodyLean: -0.03,
      leftArm: { x: 0, y: 1, angle: -0.4 },
      rightArm: { x: 0, y: 1, angle: 0.4 },
      leftLeg: { x: -3, y: -1, angle: -0.05 },
      rightLeg: { x: 3, y: -1, angle: 0.05 },
    },
  ];

  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.translate(i * FRAME_SIZE, 0);
    drawCharacter(ctx, fallPoses[i]);
    ctx.restore();
  }

  return canvas;
}

function generateLandFrames(): HTMLCanvasElement {
  const canvas = createCanvas(FRAME_SIZE * 3, FRAME_SIZE);
  const ctx = canvas.getContext('2d')!;

  const landPoses: Pose[] = [
    // Frame 0: Impact — deep crouch
    {
      headOffsetY: 10,
      bodyOffsetY: 12,
      bodyLean: 0.03,
      leftArm: { x: 0, y: 3, angle: 0.35 },
      rightArm: { x: 0, y: 3, angle: -0.35 },
      leftLeg: { x: -5, y: 0, angle: 0.4 },
      rightLeg: { x: 5, y: 0, angle: -0.4 },
    },
    // Frame 1: Recovery — rising
    {
      headOffsetY: 4,
      bodyOffsetY: 5,
      bodyLean: 0.02,
      leftArm: { x: 0, y: 1, angle: 0.2 },
      rightArm: { x: 0, y: 1, angle: -0.2 },
      leftLeg: { x: -4, y: 0, angle: 0.15 },
      rightLeg: { x: 4, y: 0, angle: -0.15 },
    },
    // Frame 2: Back to standing
    {
      headOffsetY: 0,
      bodyOffsetY: 0,
      bodyLean: 0,
      leftArm: { x: 0, y: 0, angle: 0.15 },
      rightArm: { x: 0, y: 0, angle: -0.15 },
      leftLeg: { x: -3, y: 0, angle: 0.03 },
      rightLeg: { x: 3, y: 0, angle: -0.03 },
    },
  ];

  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(i * FRAME_SIZE, 0);
    drawCharacter(ctx, landPoses[i]);
    ctx.restore();
  }

  return canvas;
}

export interface GeneratedSprites {
  idle: HTMLCanvasElement;
  run: HTMLCanvasElement;
  jump: HTMLCanvasElement;
  fall: HTMLCanvasElement;
  land: HTMLCanvasElement;
}

export function generateAllSprites(): GeneratedSprites {
  return {
    idle: generateIdleFrames(),
    run: generateRunFrames(),
    jump: generateJumpFrames(),
    fall: generateFallFrames(),
    land: generateLandFrames(),
  };
}

export const SPRITE_FRAME_SIZE = FRAME_SIZE;
export const SPRITE_FRAME_COUNTS = {
  idle: 2,
  run: 8,
  jump: 3,
  fall: 2,
  land: 3,
};
