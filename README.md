# Jump Runner

Mini-jeu d'auto-scroller web développé avec BMAD Method.

## Description

Jump Runner est un jeu web minimaliste où le joueur contrôle un bonhomme qui court automatiquement. L'objectif est de survivre le plus longtemps possible en sautant par-dessus les obstacles qui défilent.

**Projet développé avec BMAD Method** - Ce projet sert de cas d'usage pour apprendre et valider la méthodologie BMAD appliquée au développement de jeux vidéo.

## Caractéristiques

- 🎮 Gameplay simple : une seule action (sauter)
- 📈 Score basé sur le temps de survie
- ⚡ Difficulté progressive
- 🎨 Graphismes minimalistes
- 🌐 100% web (HTML5 Canvas)

## Structure du projet

```
jump-runner/
├── docs/              # Documentation BMAD (brief, PRD, architecture, stories)
├── src/               # Code source
│   ├── game/          # Logique de jeu
│   │   ├── entities/  # Player, obstacles, power-ups
│   │   ├── systems/   # Physics, collision, scoring
│   │   └── states/    # Game states (menu, playing, gameover)
│   ├── rendering/     # Canvas rendering
│   ├── input/         # Keyboard/mouse handling
│   └── main.js        # Entry point
├── assets/            # Assets (minimal)
└── dist/              # Build output
```

## Stack technique

- **Frontend**: HTML5 Canvas + JavaScript/TypeScript
- **Build**: Vite
- **Tests**: Jest/Vitest
- **Hosting**: GitHub Pages / Netlify

## Documentation BMAD

Ce projet suit la méthodologie BMAD Method. La documentation complète est disponible dans le dossier `docs/` :

- `docs/brief.md` - Project Brief (✅ Complété)
- `docs/prd.md` - Product Requirements Document (à venir)
- `docs/architecture.md` - Architecture Document (à venir)
- `docs/epics/` - Epics fragmentés (à venir)
- `docs/stories/` - User Stories (à venir)

## Installation

*Instructions à venir après la phase d'architecture*

## Développement

*Instructions à venir après la phase d'architecture*

## Licence

Projet personnel privé - Tous droits réservés

---

**Créé par**: lcdg
**Méthodologie**: BMAD Method
**Date de démarrage**: 2026-01-13
