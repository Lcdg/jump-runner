# Jump Runner - Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Créer un démonstrateur fonctionnel de la méthode BMAD appliquée au game dev
- Livrer un mini-jeu web jouable (cycle complet : start → play → die → restart)
- Produire une documentation complète et réutilisable du workflow BMAD
- Valider que BMAD génère des tests et documentation pertinents
- Obtenir un jeu avec score temporel, difficulté progressive, et rejouabilité
- Produire des livrables intermédiaires propres et lisibles à chaque étape (PRD, Architecture, Stories, etc.) pour évaluer la qualité de chaque phase BMAD

### Background Context

Jump Runner répond au besoin d'un cas d'usage concret pour démontrer la méthodologie BMAD. Les développeurs souhaitant adopter BMAD manquent d'exemples simples et documentés illustrant le workflow complet. Ce mini-jeu auto-scroller minimaliste permet de valider l'efficacité de BMAD sur un projet simple tout en créant un référentiel réutilisable.

Le format "mini-jeu web" est idéal : suffisamment complet pour couvrir toutes les phases BMAD (planning, dev, QA), mais assez simple pour se concentrer sur la méthode plutôt que la complexité technique.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-14 | 0.1 | Création initiale du PRD | John (PM) |

---

## Requirements

### Functional Requirements

- **FR1**: Le décor défile automatiquement de droite à gauche à vitesse constante, créant l'illusion que le personnage avance
- **FR2**: Le personnage reste à une position fixe horizontale à l'écran (côté gauche)
- **FR3**: Le joueur peut faire sauter le personnage via la touche Espace ou clic souris
- **FR4**: Le saut est variable selon la durée de pression : un appui court produit un petit saut, un appui prolongé produit un saut plus haut et/ou plus long. La hauteur maximale est plafonnée.
- **FR5**: Des obstacles apparaissent à droite de l'écran et défilent avec le décor
- **FR6**: Le système détecte les collisions entre le personnage et les obstacles
- **FR7**: Une collision déclenche immédiatement le Game Over
- **FR8**: Le score augmente en temps réel proportionnellement au temps de survie
- **FR9**: Le score actuel est affiché en permanence pendant le jeu
- **FR10**: L'écran Game Over affiche le score final et un bouton "Restart"
- **FR11**: Le bouton Restart permet de relancer immédiatement une nouvelle partie
- **FR12**: La fréquence d'apparition des obstacles augmente progressivement avec le temps

### Non-Functional Requirements

- **NFR1**: Le jeu doit tourner à 60 FPS constant sur navigateurs modernes (Chrome, Firefox, Safari, Edge)
- **NFR2**: Le temps de chargement initial doit être inférieur à 3 secondes
- **NFR3**: La latence entre l'input (saut) et la réaction visuelle doit être inférieure à 50ms
- **NFR4**: Le jeu doit fonctionner sans backend (100% client-side)
- **NFR5**: Le code doit être modulaire et documenté pour faciliter les itérations post-MVP
- **NFR6**: Aucune donnée utilisateur ne doit être collectée (pas de cookies/localStorage pour MVP)
- **NFR7**: Le jeu doit être jouable offline une fois chargé
- **NFR8**: Les livrables intermédiaires (docs, code) doivent être lisibles et auto-suffisants

---

## User Interface Design Goals

### Overall UX Vision

Une expérience de jeu **immédiate et sans friction**. Le joueur doit comprendre le gameplay en moins de 10 secondes sans aucune instruction. L'interface est épurée à l'extrême : seul le score est visible pendant le jeu. L'accent est mis sur la lisibilité (personnage et obstacles clairement distincts) et la réactivité des contrôles.

### Key Interaction Paradigms

- **One-button gameplay** : Toute l'interaction se résume à un seul input (saut)
- **Instant feedback** : Réponse visuelle immédiate à chaque action
- **Fail-fast, retry-fast** : Game over clair, restart en un clic
- **Progressive challenge** : Courbe de difficulté naturelle sans sélection de niveau

### Core Screens and Views

1. **Écran titre (Attract Mode)** : Le jeu tourne en arrière-plan en mode démo (décor qui défile, personnage qui saute automatiquement pour éviter les obstacles). Overlay "Press Space to Start" affiché.

2. **Écran de jeu (principal)** : Le joueur contrôle le personnage, le score s'affiche et augmente en temps réel, les obstacles défilent.

3. **Écran Game Over** : Le décor continue de défiler mais le personnage a disparu. Overlay affichant le score final + "Press Space to Restart". Le vide laissé par le personnage absent renforce visuellement l'échec.

### Accessibility

Pas d'exigences WCAG spécifiques pour le MVP. Le jeu repose sur la réactivité et le timing.

### Branding

Style **géométrique minimaliste** :
- Personnage : Formes simples (cercle pour la tête, rectangles pour le corps)
- Obstacles : Formes géométriques basiques (rectangles, triangles)
- Palette : Couleurs contrastées et lisibles (à définir avec l'Architect)
- Pas de logo ou d'identité de marque

### Target Devices and Platforms

- **Priorité** : Desktop (clavier pour le saut)
- **Navigateurs** : Chrome, Firefox, Safari, Edge (2 dernières versions)
- **Mobile** : Hors scope MVP (pourrait être ajouté en Phase 2 avec tap)

---

## Technical Assumptions

### Repository Structure: Monorepo

Un seul repository contenant tout le projet :
- Code source du jeu (`src/`)
- Documentation BMAD (`docs/`)
- Configuration et build (`package.json`, `vite.config.js`)
- Assets si nécessaire (`assets/`)

### Service Architecture: Monolith Client-Side

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

### Testing Requirements: Full Testing Pyramid

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

### Additional Technical Assumptions

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

## Epic List

### Epic 1: Foundation & Core Game Loop
**Goal** : Établir les fondations du projet et livrer un personnage jouable qui peut sauter dans un environnement qui défile.

### Epic 2: Obstacles & Collision
**Goal** : Introduire les obstacles et la détection de collision pour créer le challenge du jeu.

### Epic 3: Game States & Scoring
**Goal** : Implémenter les états du jeu (Attract Mode, Playing, Game Over) et le système de score pour une expérience complète.

---

## Epic 1: Foundation & Core Game Loop

**Goal étendu** : Mettre en place l'infrastructure technique du projet (TypeScript, Vite, CI/CD, déploiement GitHub Pages) et implémenter la mécanique centrale du jeu : un personnage visible dans un environnement défilant qui peut sauter avec une hauteur variable selon la durée de pression. À la fin de cet epic, le projet est déployable et la mécanique core est jouable.

### Story 1.1: Project Setup & CI/CD

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

### Story 1.2: Game Loop & Canvas Rendering

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

### Story 1.3: Player Entity & Basic Jump

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

### Story 1.4: Variable Jump Height

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

### Story 1.5: Scrolling Background

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

## Epic 2: Obstacles & Collision

**Goal étendu** : Transformer la démo technique en véritable jeu en ajoutant des obstacles que le joueur doit éviter. Implémenter la détection de collision et la progression de difficulté. À la fin de cet epic, le jeu a un objectif clair (survivre) et devient challenging.

### Story 2.1: Obstacle Spawning & Movement

**As a** player,
**I want** obstacles to appear and scroll towards me,
**so that** I have something to avoid and the game has a challenge.

**Acceptance Criteria:**
1. Obstacles générés à droite de l'écran (hors zone visible)
2. Obstacles défilent de droite à gauche à la même vitesse que le décor
3. Obstacles représentés par des formes géométriques simples (rectangles)
4. Obstacles supprimés de la mémoire une fois sortis à gauche de l'écran
5. Hauteurs d'obstacles variées (petits obstacles = petit saut suffit, grands = grand saut requis)
6. Espacement minimum entre obstacles pour garantir que c'est "jouable"
7. Tests unitaires pour le spawning, le mouvement et la suppression des obstacles
8. Test E2E : vérifier qu'un obstacle traverse l'écran de droite à gauche

### Story 2.2: Collision Detection

**As a** player,
**I want** the game to detect when I hit an obstacle,
**so that** my mistakes have consequences.

**Acceptance Criteria:**
1. Hitbox définie pour le personnage (rectangle englobant simplifié)
2. Hitbox définie pour chaque obstacle
3. Collision détectée quand les hitboxes se chevauchent (AABB collision)
4. Collision déclenchée uniquement quand le personnage touche l'obstacle (pas avant, pas après)
5. Événement "collision" émis pour être consommé par le système de game state (Epic 3)
6. Pour l'instant : collision = console.log ou indicateur visuel temporaire (flash rouge)
7. Tests unitaires exhaustifs pour la collision (cas limites : au-dessus, en-dessous, devant, derrière, chevauchement partiel)
8. Test E2E : vérifier qu'une collision est détectée quand le joueur ne saute pas

### Story 2.3: Progressive Difficulty

**As a** player,
**I want** the game to become harder over time,
**so that** I feel challenged and motivated to improve.

**Acceptance Criteria:**
1. Fréquence d'apparition des obstacles augmente avec le temps de jeu
2. Difficulté initiale accessible (obstacles espacés, patterns simples)
3. Progression fluide (pas de spike soudain de difficulté)
4. Paramètres de difficulté configurables (vitesse d'augmentation, min/max fréquence)
5. La vitesse de défilement reste constante (seule la fréquence change)
6. Après X temps, la difficulté atteint un plateau (ne devient pas impossible)
7. Tests unitaires pour l'algorithme de progression (vérifier les valeurs à t=0, t=30s, t=60s, etc.)
8. Test d'intégration : jouer 60 secondes et vérifier que la fréquence a augmenté

---

## Epic 3: Game States & Scoring

**Goal étendu** : Finaliser l'expérience utilisateur en implémentant les trois états du jeu (Attract Mode, Playing, Game Over), le système de score en temps réel, et la boucle de rejouabilité. À la fin de cet epic, le MVP est complet : un jeu fini, présentable et addictif.

### Story 3.1: Game State Machine

**As a** developer,
**I want** a clean state machine managing game states,
**so that** transitions between Attract/Playing/GameOver are predictable and bug-free.

**Acceptance Criteria:**
1. Trois états définis : `AttractMode`, `Playing`, `GameOver`
2. Transitions claires : Attract → Playing (on Space), Playing → GameOver (on collision), GameOver → Attract (on Space)
3. Chaque état a ses propres comportements (update, render, handleInput)
4. État initial = AttractMode au lancement du jeu
5. Impossible de transitionner vers un état invalide
6. Tests unitaires pour chaque transition et les cas invalides
7. Architecture : pattern State ou simple enum + switch (au choix du dev)

### Story 3.2: Attract Mode with Auto-Play

**As a** player,
**I want** to see the game playing itself on the title screen,
**so that** I understand the gameplay before starting.

**Acceptance Criteria:**
1. En AttractMode, le décor défile et les obstacles apparaissent normalement
2. Un personnage "IA" saute automatiquement pour éviter les obstacles
3. L'IA n'est pas parfaite : logique simple (sauter quand obstacle proche)
4. Overlay "Press Space to Start" affiché au centre de l'écran
5. Appuyer sur Espace transitionne vers Playing
6. Pas de score affiché en AttractMode
7. Tests unitaires pour la logique d'auto-jump de l'IA
8. Test E2E : vérifier que l'attract mode tourne et que Space lance le jeu

### Story 3.3: Real-Time Scoring System

**As a** player,
**I want** to see my score increasing while I play,
**so that** I know how well I'm doing and want to beat my record.

**Acceptance Criteria:**
1. Score démarre à 0 quand l'état passe à Playing
2. Score augmente continuellement (ex: +1 par 100ms ou +10 par seconde)
3. Score affiché en temps réel dans un coin de l'écran (lisible mais non intrusif)
4. Score arrête d'augmenter quand l'état passe à GameOver
5. Score final mémorisé pour affichage sur l'écran Game Over
6. Style du score : police simple, bonne lisibilité, contraste avec le fond
7. Tests unitaires pour l'incrémentation et l'arrêt du score
8. Test E2E : vérifier que le score augmente pendant le jeu

### Story 3.4: Game Over Screen

**As a** player,
**I want** to see a clear Game Over screen when I fail,
**so that** I understand what happened and can try again.

**Acceptance Criteria:**
1. Quand collision détectée, transition vers état GameOver
2. Le personnage disparaît immédiatement de l'écran
3. Le décor continue de défiler (le monde continue sans le joueur)
4. Les obstacles continuent de défiler normalement
5. Overlay "Game Over" affiché avec le score final
6. Message "Press Space to Restart" affiché
7. Aucun nouvel obstacle ne spawn en GameOver (optionnel, évite le spam visuel)
8. Test E2E : vérifier que collision → personnage disparu → Game Over affiché

### Story 3.5: Restart Flow

**As a** player,
**I want** to quickly restart after a Game Over,
**so that** I can immediately try again without friction.

**Acceptance Criteria:**
1. En état GameOver, appuyer sur Espace transitionne vers AttractMode
2. Reset complet : score à 0, personnage réapparaît, difficulté reset, obstacles cleared
3. Transition fluide (pas de flash ou de rechargement visible)
4. Le joueur peut enchaîner les parties rapidement (objectif : <1 seconde entre Game Over et nouvelle partie)
5. Tests unitaires pour le reset de tous les systèmes (score, difficulté, obstacles)
6. Test E2E : cycle complet Attract → Play → Die → Restart → Play

---

## Checklist Results Report

### Executive Summary

| Critère | Évaluation |
|---------|------------|
| **Complétude PRD** | 92% |
| **Scope MVP** | Just Right |
| **Prêt pour Architecture** | Ready |
| **Concerns critiques** | Aucun bloqueur |

### Category Analysis

| Category | Status | Notes |
|----------|--------|-------|
| 1. Problem Definition & Context | **PASS** | Problème clair, utilisateur défini, succès mesurable |
| 2. MVP Scope Definition | **PASS** | Scope minimal et viable |
| 3. User Experience Requirements | **PASS** | 3 écrans définis, flows clairs |
| 4. Functional Requirements | **PASS** | 12 FR + 8 NFR, testables |
| 5. Non-Functional Requirements | **PASS** | Performance définie (60 FPS, <50ms) |
| 6. Epic & Story Structure | **PASS** | 3 epics, 13 stories, séquentiels |
| 7. Technical Guidance | **PASS** | Stack définie, architecture claire |
| 8. Cross-Functional Requirements | **PARTIAL** | Pas de data persistante (OK pour MVP) |
| 9. Clarity & Communication | **PASS** | Structure claire, terminologie cohérente |

### Open Items for Architecture Phase

- Définir la palette de couleurs exacte
- Préciser l'algorithme de difficulté progressive (linéaire recommandé)

### Final Decision

**READY FOR ARCHITECT**

---

## Next Steps

### UX Expert Prompt

> Bonjour ! J'ai besoin de ton expertise pour définir le design visuel de **Jump Runner**, un mini-jeu auto-scroller minimaliste. Le PRD est disponible dans `docs/prd.md`. Points clés à traiter :
>
> 1. **Palette de couleurs** : Définir les couleurs pour le fond, le personnage, les obstacles, le sol, et les overlays (score, Game Over)
> 2. **Style du personnage** : Proportions et formes géométriques (cercle + rectangles)
> 3. **Typographie** : Police pour le score et les messages (Game Over, Press Space)
> 4. **Feedback visuel** : Comment indiquer visuellement le saut variable (trail? stretch?)
>
> L'objectif est un style géométrique minimaliste avec une excellente lisibilité.

### Architect Prompt

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
