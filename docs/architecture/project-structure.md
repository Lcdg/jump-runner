# Project Structure

```
jump-runner/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD GitHub Pages
├── docs/
│   ├── brief.md                # Project Brief (Analyst)
│   ├── prd.md                  # Product Requirements (PM)
│   ├── front-end-spec.md       # UI/UX Specifications
│   ├── architecture.md         # THIS DOCUMENT
│   └── stories/                # User stories (after sharding)
├── src/
│   ├── main.ts                 # Entry point - initializes game
│   ├── config/
│   │   └── constants.ts        # Game constants (speed, gravity, colors)
│   ├── core/
│   │   ├── Game.ts             # Main class - game loop
│   │   ├── GameState.ts        # State machine (Attract/Playing/GameOver)
│   │   └── types.ts            # Shared TypeScript interfaces
│   ├── entities/
│   │   ├── Entity.ts           # Abstract base class
│   │   ├── Player.ts           # Playable character
│   │   ├── Obstacle.ts         # Obstacles (trash can, cone, car...)
│   │   └── Background.ts       # Background elements (buildings, lampposts)
│   ├── systems/
│   │   ├── PhysicsSystem.ts    # Gravity, velocity, variable jump
│   │   ├── CollisionSystem.ts  # AABB detection
│   │   ├── ScoringSystem.ts    # Real-time score
│   │   ├── DifficultySystem.ts # Difficulty progression
│   │   └── SpawnSystem.ts      # Obstacle generation
│   ├── rendering/
│   │   ├── Renderer.ts         # Main Canvas class
│   │   ├── layers/
│   │   │   ├── BackgroundLayer.ts   # Sky, buildings (slow parallax)
│   │   │   ├── GameLayer.ts         # Ground, player, obstacles
│   │   │   └── UILayer.ts           # Score, overlays
│   │   └── sprites/
│   │       ├── PlayerSprite.ts      # Player drawing
│   │       ├── ObstacleSprites.ts   # Obstacle drawings
│   │       └── BackgroundSprites.ts # Background drawings
│   ├── input/
│   │   └── InputManager.ts     # Keyboard/mouse handling
│   └── utils/
│       ├── math.ts             # Utility functions (clamp, lerp, random)
│       └── pool.ts             # Object pooling for obstacles
├── tests/
│   ├── unit/
│   │   ├── systems/
│   │   │   ├── PhysicsSystem.test.ts
│   │   │   ├── CollisionSystem.test.ts
│   │   │   ├── ScoringSystem.test.ts
│   │   │   └── DifficultySystem.test.ts
│   │   ├── entities/
│   │   │   ├── Player.test.ts
│   │   │   └── Obstacle.test.ts
│   │   └── core/
│   │       └── GameState.test.ts
│   └── e2e/
│       ├── attract-mode.spec.ts
│       ├── gameplay.spec.ts
│       └── game-over.spec.ts
├── public/
│   └── index.html              # Minimal HTML with canvas
├── index.html                  # Entry HTML for Vite
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
└── README.md
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Class files | PascalCase.ts | `Player.ts`, `GameState.ts` |
| Utility files | camelCase.ts | `math.ts`, `pool.ts` |
| Test files | *.test.ts / *.spec.ts | `Player.test.ts` |
| Config files | camelCase.ts | `constants.ts` |
| Folders | kebab-case or camelCase | `rendering/`, `sprites/` |

---
