# Epic 1: Foundation & Core Game Loop

**Goal étendu** : Mettre en place l'infrastructure technique du projet (TypeScript, Vite, CI/CD, déploiement GitHub Pages) et implémenter la mécanique centrale du jeu : un personnage visible dans un environnement défilant qui peut sauter avec une hauteur variable selon la durée de pression. À la fin de cet epic, le projet est déployable et la mécanique core est jouable.

## Story 1.1: Project Setup & CI/CD

**As a** developer,
**I want** a fully configured TypeScript + Vite project with automated deployment,
**so that** I can start developing with a solid foundation and see changes live on GitHub Pages.

**Acceptance Criteria:**
1. Repository initialisé avec structure `src/`, `docs/`, `tests/`
2. Vite configuré avec TypeScript (strict mode)
3. `index.html` avec un canvas plein écran
4. Script `npm run dev` lance le serveur de développement
5. Script `npm run build` génère le build dans `dist/`
6. GitHub Actions workflow déploie automatiquement sur GitHub Pages à chaque push sur `main`
7. Page accessible via URL GitHub Pages affichant un canvas vide
8. Vitest configuré avec un test placeholder qui passe
9. Playwright configuré avec un test E2E placeholder

## Story 1.2: Game Loop & Canvas Rendering

**As a** developer,
**I want** a stable game loop running at 60 FPS with delta time,
**so that** the game runs smoothly and consistently across different machines.

**Acceptance Criteria:**
1. Game loop utilisant `requestAnimationFrame`
2. Delta time calculé entre chaque frame pour des mouvements frame-independent
3. Canvas redimensionné automatiquement à la taille de la fenêtre
4. Fond de couleur unie rendu à chaque frame (preuve que le rendering fonctionne)
5. FPS counter affiché en mode développement (optionnel, peut être désactivé)
6. Tests unitaires vérifiant le calcul du delta time
7. Architecture modulaire : séparation `Game.ts`, `Renderer.ts`

## Story 1.3: Player Entity & Basic Jump

**As a** player,
**I want** to see a character on screen that can jump when I press Space,
**so that** I can start interacting with the game.

**Acceptance Criteria:**
1. Personnage affiché côté gauche de l'écran (forme géométrique simple : rectangle + cercle)
2. Personnage positionné sur une "ligne de sol" visible
3. Appui sur Espace déclenche un saut (le personnage quitte le sol et y revient)
4. Gravité appliquée : le personnage retombe naturellement
5. Le personnage ne peut pas sauter s'il est déjà en l'air (pas de double saut)
6. Tests unitaires pour la physique du saut (vélocité, gravité, position au sol)
7. Test E2E : appuyer sur Espace fait sauter le personnage

## Story 1.4: Variable Jump Height

**As a** player,
**I want** the jump height to vary based on how long I hold the Space key,
**so that** I have more control and skill expression.

**Acceptance Criteria:**
1. Appui court sur Espace = petit saut
2. Appui prolongé sur Espace = saut plus haut (jusqu'à un maximum)
3. Relâcher la touche coupe la montée (le personnage commence à redescendre)
4. Hauteur maximale plafonnée même si on maintient indéfiniment
5. La transition entre petit et grand saut est fluide (pas de "paliers")
6. Tests unitaires vérifiant les différentes hauteurs selon la durée de pression
7. Test E2E : comparaison visuelle ou d'état entre appui court et appui long

## Story 1.5: Scrolling Background

**As a** player,
**I want** to see the environment scrolling from right to left,
**so that** I feel like my character is running forward.

**Acceptance Criteria:**
1. Ligne de sol qui défile de droite à gauche à vitesse constante
2. Éléments de décor simples (lignes ou formes) qui défilent pour renforcer la sensation de mouvement
3. Le défilement est continu et seamless (pas de "saut" visible)
4. Vitesse de défilement constante (paramétrable pour les futurs ajustements)
5. Le personnage reste à sa position fixe horizontale pendant le défilement
6. Tests unitaires pour la logique de défilement et le repositionnement des éléments
7. Performance : maintien des 60 FPS avec le décor qui défile

---
