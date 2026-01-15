# Technical Assumptions

## Repository Structure: Monorepo

Un seul repository contenant tout le projet :
- Code source du jeu (`src/`)
- Documentation BMAD (`docs/`)
- Configuration et build (`package.json`, `vite.config.js`)
- Assets si nécessaire (`assets/`)

## Service Architecture: Monolith Client-Side

- **100% client-side** : Aucun backend nécessaire
- **Single Page Application** : Une seule page HTML avec le canvas du jeu
- **Modules ES6** : Code organisé en modules pour la maintenabilité
- **State management simple** : Objet game state centralisé (pas de Redux/Vuex)

```
src/
├── main.ts           # Entry point
├── game/
│   ├── Game.ts       # Game loop principal
│   ├── entities/     # Player, Obstacle
│   ├── systems/      # Physics, Collision, Scoring
│   └── states/       # AttractMode, Playing, GameOver
├── rendering/        # Canvas rendering
└── input/            # Keyboard/mouse handling
```

## Testing Requirements: Full Testing Pyramid

| Niveau | Framework | Couverture |
|--------|-----------|------------|
| Unit | Vitest | Collision, Physics, Scoring |
| Integration | Vitest | State machine, Input system |
| E2E | Playwright | User journeys complets |

**Scénarios E2E prioritaires :**
1. Attract Mode → Start : Vérifier que "Press Space" lance le jeu
2. Cycle de jeu complet : Start → Jouer → Collision → Game Over → Restart
3. Scoring : Vérifier que le score augmente pendant le jeu
4. Saut variable : Appui court vs appui long produit des hauteurs différentes
5. Game Over : Vérifier que le personnage disparaît et que le décor continue

## Additional Technical Assumptions

| Choix | Décision | Rationale |
|-------|----------|-----------|
| **Langage** | TypeScript | Meilleure maintenabilité, autocomplétion, détection d'erreurs |
| **Build tool** | Vite | Setup minimal, HMR rapide, build optimisé |
| **Rendering** | HTML5 Canvas (vanilla) | Contrôle total, pas de dépendance lourde |
| **Game framework** | Aucun (vanilla) | Projet simple, apprentissage des bases |
| **Package manager** | npm | Standard, disponible partout |
| **Hébergement** | GitHub Pages | Gratuit, intégration Git directe, CI/CD simple |
| **CI/CD** | GitHub Actions | Déploiement auto sur push main |
| **Graphismes** | Dessin via Canvas API | Pas de sprites externes, formes géométriques codées |

---
