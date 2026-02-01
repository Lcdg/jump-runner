# Epic 7: Compatibilité Mobile & Optimisations

**Goal** : Rendre le jeu entièrement jouable sur smartphone et tablette avec des contrôles tactiles, un layout adaptatif aux deux orientations (portrait et paysage), et des optimisations de performance mobile.

## Story 7.1: Viewport & Meta Tags Mobile

**As a** mobile player,
**I want** the game to display correctly on my phone,
**so that** there is no unwanted zoom, scroll, or browser UI interfering with gameplay.

### Acceptance Criteria

1. Meta viewport empêche le zoom utilisateur et le double-tap zoom
2. Pas de pull-to-refresh, bounce scroll, ou text selection sur le canvas
3. Canvas fullscreen sans barre d'adresse visible (standalone display mode)
4. Détection fiable tactile vs desktop (`isTouchDevice`)
5. Tests unitaires et lint/build passent

## Story 7.2: Contrôles Tactiles

**As a** mobile player,
**I want** to control my character by tapping the screen,
**so that** I can play the game without a keyboard.

### Acceptance Criteria

1. Touch start = saut (équivalent Space/click)
2. Touch hold = saut plus haut (maintien du doigt)
3. Touch end = relâcher le saut
4. Multi-touch ignoré (seul le premier doigt compte)
5. Coexistence tactile + clavier/souris (desktop non cassé)
6. Pas de conflit entre touch et mouse events (pas de double-fire)
7. Tests unitaires et lint/build passent

## Story 7.3: Layout Adaptatif (Portrait & Paysage)

**As a** mobile player,
**I want** the game to work in both portrait and landscape orientation,
**so that** I can play however I hold my phone.

### Acceptance Criteria

1. Le canvas s'adapte dynamiquement aux deux orientations
2. Recalcul correct de groundY, positions joueur, UI lors du resize/rotation
3. Score, FPS, textes lisibles et bien positionnés dans les deux orientations
4. Pas de clignotement ou saut visuel lors de la rotation
5. Tests unitaires et lint/build passent

## Story 7.4: UI Tactile (Boutons & Skin Selector)

**As a** mobile player,
**I want** touch-friendly buttons to access game features,
**so that** I can start the game and change skins without a keyboard.

### Acceptance Criteria

1. Bouton "Skins" visible en Attract Mode (zone tactile ≥ 44px)
2. Sélecteur de skin navigable par tap sur flèches ou swipe gauche/droite
3. Bouton "Play" ou zone de tap clairement indiquée en Attract Mode
4. Textes d'indication adaptés au contexte (tactile vs clavier)
5. Le hint "Press S to change skin" devient "Tap 🎨 to change skin" sur mobile
6. Tous les boutons tactiles ont un feedback visuel au tap
7. Tests unitaires et lint/build passent

## Story 7.5: Optimisations Performance Mobile

**As a** mobile player,
**I want** the game to run smoothly on my phone,
**so that** the gameplay is enjoyable without lag or stutter.

### Acceptance Criteria

1. Détection de FPS bas et réduction automatique des effets coûteux (shadows, globalAlpha multiple)
2. Optimisation canvas : `will-change: transform` et `desynchronized` context hint
3. Réduction de la fréquence des calculs non-critiques (FPS counter, building recycling)
4. 60 FPS maintenu sur mobile récent (iPhone 12+, Android équivalent)
5. Pas de memory leaks sur sessions longues (obstacle recycling vérifié)
6. Tests unitaires et lint/build passent

## Dependencies

- Epics 1-6 terminés (foundation, gameplay, visuals, skins)

## Sequence

7.1 → 7.2 → 7.3 → 7.4 → 7.5

(7.1 en premier car les meta tags sont prerequis pour que le tactile fonctionne correctement)
