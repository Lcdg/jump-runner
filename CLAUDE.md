# Claude Code - Notes de Session

## Projet : Jump Runner

Mini-jeu de type endless runner en TypeScript/Canvas.

## État Actuel - MVP Complet, Sprint 2 Planifié

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

**Epic 4 : Ville de Nuit - Polish Visuel** - À faire

| Story | Titre | Status |
|-------|-------|--------|
| 4.1 | Palette Couleurs "Ville de Nuit" | À faire |
| 4.2 | Décor - Immeubles Arrière-Plan | À faire |
| 4.3 | Décor - Sol avec Passages Piétons | À faire |
| 4.4 | Obstacles Sol - Poubelle, Cône, Voiture | À faire |
| 4.5 | Personnage - Jambes + Animation Course | À faire |
| 4.6 | Personnage - Animation Saut | À faire |

**Epic 5 : Obstacles Aériens** - À faire

| Story | Titre | Status |
|-------|-------|--------|
| 5.1 | Lampadaires (Obstacle Aérien) | À faire |
| 5.2 | Autres Obstacles Aériens | À faire |
| 5.3 | Validation des Patterns | À faire |

## Prochaine Action

### Commencer Epic 4 - Story 4.1

Pour reprendre le travail :

```
/bmad-orchestrator
```

Puis :
1. Taper `3` pour sélectionner l'agent Dev (James)
2. Créer et implémenter la Story 4.1 (Palette Couleurs)

### Référence Visuelle

Le fichier `docs/front-end-spec.md` contient toutes les spécifications visuelles :
- Palette de couleurs complète
- Dimensions des obstacles (poubelle, cône, voiture)
- Design du personnage (corps, tête, jambes)
- Animations (course, saut, atterrissage)
- Éléments de décor (immeubles, passages piétons, lampadaires)

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

- `docs/prd/epic-list.md` - Liste des epics
- `docs/prd/epic-4-night-city-visuals.md` - Epic 4 (Ville de Nuit)
- `docs/prd/epic-5-aerial-obstacles.md` - Epic 5 (Obstacles Aériens)
- `docs/front-end-spec.md` - Specs visuelles complètes
- `docs/stories/` - Stories complétées

## CI/CD

GitHub Actions déploie automatiquement sur GitHub Pages après chaque push sur main.
