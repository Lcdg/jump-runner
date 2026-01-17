# Claude Code - Notes de Session

## Projet : Jump Runner

Mini-jeu de type endless runner en TypeScript/Canvas.

## État Actuel

**Epic 1 : Foundation & Core Game Loop** - En cours

| Story | Titre | Status |
|-------|-------|--------|
| 1.1 | Project Setup & CI/CD | Done |
| 1.2 | Game Loop & Canvas Rendering | Done |
| 1.3 | Player Entity & Basic Jump | Done |
| 1.4 | Obstacle Spawning | **À faire** |
| 1.5 | Collision Detection | À faire |
| 1.6 | Score System | À faire |
| 1.7 | Game States | À faire |

## Prochaine Action

### Story 1.4 : Obstacle Spawning

Pour reprendre le travail :

```
/bmad-orchestrator
```

Puis :
1. Taper `1` pour sélectionner l'agent PO (Sarah)
2. Demander de créer la Story 1.4 basée sur l'Epic 1
3. Approuver la story
4. Passer à l'agent Dev (James) pour implémenter

### Contenu attendu Story 1.4 (selon Epic 1)

- Créer une classe `Obstacle` qui hérite de `Entity`
- Spawner des obstacles à intervalles réguliers côté droit
- Les obstacles se déplacent vers la gauche à vitesse constante
- Recycler/supprimer les obstacles sortis de l'écran
- Tests unitaires pour le spawn et le mouvement

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
