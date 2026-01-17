# Claude Code - Notes de Session

## Projet : Jump Runner

Mini-jeu de type endless runner en TypeScript/Canvas.

## État Actuel

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

## Prochaine Action

### Epic 3 : Game States & Scoring

Pour reprendre le travail :

```
/bmad-orchestrator
```

Puis :
1. Utiliser `create-next-story` pour créer la Story 3.1
2. `*agent dev` pour implémenter

### Contenu attendu Epic 3 (voir docs/prd/epic-3-game-states-scoring.md)

- Game states: Attract → Playing → Game Over
- Score qui augmente avec le temps de survie
- High score persisté en localStorage
- UI overlay pour afficher score et game over

## Architecture Clé

```
src/
├── core/           # Game.ts, types.ts
├── config/         # constants.ts
├── entities/       # Entity.ts, Player.ts, Obstacle.ts
├── input/          # InputManager.ts
├── systems/        # CollisionSystem.ts, DifficultySystem.ts
└── rendering/      # Renderer.ts
```

**123 tests unitaires passent actuellement.**

## Commandes Utiles

```bash
npm run dev      # Serveur de dev (http://localhost:5173)
npm run lint     # ESLint
npm run test:run # Vitest (unit tests)
npm run test:e2e # Playwright (E2E) - Note: nécessite libnspr4 sur WSL
npm run build    # Build production
```

## Documentation BMAD

- `docs/prd/epic-1-foundation-core-game-loop.md` - Epic 1
- `docs/prd/epic-2-obstacles-collision.md` - Epic 2
- `docs/prd/epic-3-game-states-scoring.md` - Epic 3
- `docs/stories/` - Stories créées et complétées

## CI/CD

GitHub Actions déploie automatiquement sur GitHub Pages après chaque push sur main.
