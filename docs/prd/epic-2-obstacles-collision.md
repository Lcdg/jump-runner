# Epic 2: Obstacles & Collision

**Goal étendu** : Transformer la démo technique en véritable jeu en ajoutant des obstacles que le joueur doit éviter. Implémenter la détection de collision et la progression de difficulté. À la fin de cet epic, le jeu a un objectif clair (survivre) et devient challenging.

## Story 2.1: Obstacle Spawning & Movement

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

## Story 2.2: Collision Detection

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

## Story 2.3: Progressive Difficulty

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
