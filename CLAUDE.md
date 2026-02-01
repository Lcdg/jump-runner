# Claude Code - Notes de Session

## Projet : Jump Runner

Mini-jeu de type endless runner en TypeScript/Canvas.

## État Actuel - Epics 1-6 Terminés, Epic 7 Planifié

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

**Epic 4 : Ville de Nuit - Polish Visuel** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 4.1 | Palette Couleurs "Ville de Nuit" | Done |
| 4.2 | Décor - Immeubles Arrière-Plan | Done |
| 4.3 | Décor - Sol avec Passages Piétons | Done |
| 4.4 | Obstacles Sol - Poubelle, Cône, Voiture | Done |
| 4.5 | Personnage - Jambes + Animation Course | Done |
| 4.6 | Personnage - Animation Saut | Done |

**Epic 5 : Obstacles Aériens** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 5.1 | Lampadaires (Obstacle Aérien) | Done |
| 5.2 | Autres Obstacles Aériens | Done |
| 5.3 | Validation des Patterns | Done |

**Epic 6 : Character Upgrade** - Terminé

| Story | Titre | Status |
|-------|-------|--------|
| 6.1 | Système de Skins (Architecture) | Done |
| 6.2 | Sprite Sheet du Personnage | Done |
| 6.3 | Animations Fluides et Réalistes | Done |
| 6.4 | Sélecteur de Skin en Jeu | Done |

**Epic 7 : Compatibilité Mobile & Optimisations** - À faire

| Story | Titre | Status |
|-------|-------|--------|
| 7.1 | Viewport & Meta Tags Mobile | Draft |
| 7.2 | Contrôles Tactiles | Draft |
| 7.3 | Layout Adaptatif (Portrait & Paysage) | Draft |
| 7.4 | UI Tactile (Boutons & Skin Selector) | Draft |
| 7.5 | Optimisations Performance Mobile | Draft |

## Prochaine Action

### Commencer Epic 7 - Story 7.1

Pour reprendre le travail :

```
/dev
```

Puis implémenter la Story 7.1 (Viewport & Meta Tags Mobile)

### Séquence Epic 7

```
7.1 (Viewport) → 7.2 (Touch) → 7.3 (Layout) → 7.4 (UI Tactile) → 7.5 (Performance)
```

## Architecture

```
src/
├── core/           # Game.ts, GameStateManager.ts, types.ts
├── config/         # constants.ts
├── entities/       # Entity.ts, Player.ts, Obstacle.ts
├── input/          # InputManager.ts
├── skins/          # PlayerSkin.ts, SkinManager.ts, ClassicSkin.ts, DetailedSkin.ts, AnimationController.ts, SpriteGenerator.ts
├── systems/        # CollisionSystem.ts, DifficultySystem.ts, AutoPlayerSystem.ts
├── ui/             # SkinSelector.ts
└── rendering/      # Renderer.ts, SpriteSheet.ts
```

**334 tests unitaires passent.**

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
- `docs/prd/epic-7-mobile-compatibility.md` - Epic 7 (Compatibilité Mobile)
- `docs/front-end-spec.md` - Specs visuelles complètes
- `docs/stories/` - Stories

## CI/CD

GitHub Actions déploie automatiquement sur GitHub Pages après chaque push sur main.
