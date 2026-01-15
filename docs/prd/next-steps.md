# Next Steps

## UX Expert Prompt

> Bonjour ! J'ai besoin de ton expertise pour définir le design visuel de **Jump Runner**, un mini-jeu auto-scroller minimaliste. Le PRD est disponible dans `docs/prd.md`. Points clés à traiter :
>
> 1. **Palette de couleurs** : Définir les couleurs pour le fond, le personnage, les obstacles, le sol, et les overlays (score, Game Over)
> 2. **Style du personnage** : Proportions et formes géométriques (cercle + rectangles)
> 3. **Typographie** : Police pour le score et les messages (Game Over, Press Space)
> 4. **Feedback visuel** : Comment indiquer visuellement le saut variable (trail? stretch?)
>
> L'objectif est un style géométrique minimaliste avec une excellente lisibilité.

## Architect Prompt

> Bonjour ! Le PRD de **Jump Runner** est prêt dans `docs/prd.md`. C'est un mini-jeu auto-scroller en TypeScript + Vite + Canvas vanilla. J'ai besoin que tu crées le document d'architecture couvrant :
>
> 1. **Structure des modules** : Organisation exacte de `src/` (entities, systems, states)
> 2. **Game loop** : Pattern pour requestAnimationFrame + delta time
> 3. **State machine** : Implémentation des 3 états (Attract, Playing, GameOver)
> 4. **Physique du saut variable** : Algorithme pour gérer la durée de pression
> 5. **Collision AABB** : Implémentation de la détection
> 6. **Difficulté progressive** : Algorithme recommandé
> 7. **Testing strategy** : Organisation Vitest + Playwright
>
> Stack : TypeScript, Vite, HTML5 Canvas, Vitest, Playwright, GitHub Pages.
