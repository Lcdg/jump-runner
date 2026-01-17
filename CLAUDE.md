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
| 2.2 | Collision Detection | **À faire** |
| 2.3 | Progressive Difficulty | À faire |

## Prochaine Action

### Story 2.2 : Collision Detection

Pour reprendre le travail :

```
/bmad-orchestrator
```

Puis :
1. Taper `3` pour sélectionner l'agent Dev (James)
2. Créer et implémenter la Story 2.2

### Contenu attendu Story 2.2 (selon Epic 2)

- Hitbox définie pour le personnage (déjà fait dans Player)
- Hitbox définie pour chaque obstacle (déjà fait dans Obstacle)
- Collision AABB quand les hitboxes se chevauchent
- Événement "collision" émis (pour le système de game state)
- Pour l'instant : indicateur visuel temporaire (flash rouge)
- Tests unitaires exhaustifs pour la collision
- Test E2E : vérifier collision quand le joueur ne saute pas

## Architecture Clé

```
src/
├── core/           # Game.ts, types.ts
├── config/         # constants.ts
├── entities/       # Entity.ts, Player.ts, Obstacle.ts
├── input/          # InputManager.ts
└── rendering/      # Renderer.ts
```

**70 tests unitaires passent actuellement.**

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
