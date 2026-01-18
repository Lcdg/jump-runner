# Claude Code - Notes de Session

## Projet : Jump Runner

Mini-jeu de type endless runner en TypeScript/Canvas.

## État Actuel - MVP Complet!

**Epic 1 : Foundation & Core Game Loop** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 1.1 | Project Setup & CI/CD | Done |
| 1.2 | Game Loop & Canvas Rendering | Done |
| 1.3 | Player Entity & Basic Jump | Done |
| 1.4 | Variable Jump Height | Done |
| 1.5 | Scrolling Background | Done |

**Epic 2 : Obstacles & Collision** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 2.1 | Obstacle Spawning & Movement | Done |
| 2.2 | Collision Detection | Done |
| 2.3 | Progressive Difficulty | Done |

**Epic 3 : Game States & Scoring** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 3.1 | Game State Machine | Done |
| 3.2 | Attract Mode with Auto-Play | Done |
| 3.3 | Real-Time Scoring | Done |
| 3.4 | Game Over Screen | Done |
| 3.5 | Restart Flow | Done |

## Fonctionnalités Implémentées

- **Attract Mode**: IA qui joue automatiquement, "Press Space to Start"
- **Playing**: Contrôles de saut variable, score en temps réel
- **Collision**: Détection AABB, transition vers Game Over
- **Game Over**: Score final affiché, "Press Space to Restart"
- **Difficulté Progressive**: Obstacles plus fréquents au fil du temps (plateau à 60s)
- **Restart Fluide**: Reset complet instantané

## Architecture

```
src/
├── core/           # Game.ts, GameStateManager.ts, types.ts
├── config/         # constants.ts
├── entities/       # Entity.ts, Player.ts, Obstacle.ts
├── input/          # InputManager.ts
├── systems/        # CollisionSystem.ts, DifficultySystem.ts, AutoPlayerSystem.ts
└── rendering/      # Renderer.ts
```

**207 tests unitaires passent.**

## Commandes Utiles

```bash
npm run dev      # Serveur de dev (http://localhost:5173)
npm run lint     # ESLint
npm run test:run # Vitest (unit tests)
npm run test:e2e # Playwright (E2E)
npm run build    # Build production
```

## Documentation BMAD

- `docs/prd/epic-1-foundation-core-game-loop.md` - Epic 1
- `docs/prd/epic-2-obstacles-collision.md` - Epic 2
- `docs/prd/epic-3-game-states-scoring.md` - Epic 3
- `docs/stories/` - Toutes les stories complétées

## CI/CD

GitHub Actions déploie automatiquement sur GitHub Pages après chaque push sur main.

## Prochaine Action (Optionnel)

Le MVP est complet! Améliorations possibles:
- High score persisté en localStorage
- Sons et effets visuels
- Mobile touch controls
- Nouveaux types d'obstacles
- Power-ups
