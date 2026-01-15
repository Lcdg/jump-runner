# Epic 3: Game States & Scoring

**Goal étendu** : Finaliser l'expérience utilisateur en implémentant les trois états du jeu (Attract Mode, Playing, Game Over), le système de score en temps réel, et la boucle de rejouabilité. À la fin de cet epic, le MVP est complet : un jeu fini, présentable et addictif.

## Story 3.1: Game State Machine

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

## Story 3.2: Attract Mode with Auto-Play

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

## Story 3.3: Real-Time Scoring System

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

## Story 3.4: Game Over Screen

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

## Story 3.5: Restart Flow

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
