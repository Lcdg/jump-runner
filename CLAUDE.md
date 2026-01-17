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

**Epic 2 : Obstacles & Collision** - En cours

| Story | Titre | Status |
|-------|-------|--------|
| 2.1 | Obstacle Spawning & Movement | Done |
| 2.2 | Collision Detection | À faire |
| 2.3 | Progressive Difficulty | À faire |

## Prochaine Action

### Story 2.1 : Obstacle Spawning & Movement

- Créer classe `Obstacle` héritant de `Entity`
- Spawner obstacles à droite de l'écran
- Obstacles défilent avec le décor
- Recycler/supprimer les obstacles sortis
- Hauteurs variées (petits/grands obstacles)

## Architecture Clé

```
src/
├── core/           # Game.ts, types.ts
├── config/         # constants.ts
├── entities/       # Entity.ts, Player.ts, (Obstacle.ts à créer)
├── input/          # InputManager.ts
└── rendering/      # Renderer.ts
```

## Commandes Utiles

```bash
npm run dev      # Serveur de dev
npm run lint     # ESLint
npm test         # Vitest (unit tests)
npm run test:e2e # Playwright (E2E)
npm run build    # Build production
```

## Documentation BMAD

- `docs/brief.md` - Brief projet
- `docs/prd.md` - PRD complet
- `docs/architecture.md` - Architecture technique
- `docs/epic-1.md` - Epic 1 détaillé avec toutes les stories
- `docs/stories/` - Stories créées et complétées

## CI/CD

GitHub Actions déploie automatiquement sur GitHub Pages après chaque push sur main.
URL : https://lcdg.github.io/jump-runner
