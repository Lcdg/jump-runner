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
| 1.4 | Variable Jump Height | Done |
| 1.5 | Scrolling Background | **Ready for Review** |

## Prochaine Action

### Story 1.4 : Variable Jump Height

Story créée : `docs/stories/1.4.story.md`

Pour implémenter :

```
/bmad-orchestrator
```

Puis :
1. Taper `3` pour sélectionner l'agent Dev (James)
2. Implémenter la Story 1.4

### Contenu Story 1.4 (selon Epic 1)

- Appui court sur Espace = petit saut
- Appui prolongé = saut plus haut (jusqu'à un maximum)
- Relâcher la touche coupe la montée
- Hauteur maximale plafonnée
- Transition fluide entre petit et grand saut
- Tests unitaires et E2E

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
