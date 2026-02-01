# Epic 6: Character Upgrade - Personnage Détaillé & Système de Skins

**Goal** : Remplacer le personnage géométrique basique (rectangle + cercle + traits) par un personnage humain détaillé rendu via sprite sheets, avec des animations fluides et réalistes. Mettre en place un système de skins permettant de conserver et switcher entre les différentes versions du personnage.

## Story 6.1: Système de Skins (Architecture)

**As a** developer,
**I want** a modular skin architecture,
**so that** multiple character designs can coexist and be swapped at runtime.

### Acceptance Criteria

1. Interface `PlayerSkin` définissant le contrat de rendu (render idle, run, jump, fall, land)
2. Classe `ClassicSkin` encapsulant le rendu actuel (rectangle + cercle + jambes)
3. Le `Game` utilise le skin actif via l'interface au lieu du rendu en dur dans `renderPlayer()`
4. Le jeu fonctionne exactement comme avant avec le `ClassicSkin` (aucune régression visuelle)
5. Factory ou registre de skins pour ajouter de nouveaux skins facilement
6. Tests unitaires vérifiant que le ClassicSkin est appelé correctement
7. `npm run lint` passe
8. `npm run test:run` passe
9. `npm run build` passe

---

## Story 6.2: Sprite Sheet du Personnage (Design Détaillé)

**As a** player,
**I want** a detailed, realistic-looking character,
**so that** the game has a polished, professional visual quality.

### Acceptance Criteria

1. Sprite sheets créées pour le personnage avec les frames suivantes :
   - **Idle** : 1-2 frames (personnage debout, léger mouvement)
   - **Course** : 6-8 frames (cycle de course complet)
   - **Saut montée** : 2-3 frames (impulsion → position aérienne)
   - **Chute** : 1-2 frames (bras/jambes en position de descente)
   - **Atterrissage** : 2-3 frames (flexion → recovery)
2. Système de chargement de sprite sheet (`SpriteSheet` class) avec découpage automatique des frames
3. Classe `DetailedSkin` implémentant `PlayerSkin` avec rendu par sprites
4. Le personnage est clairement identifiable comme un humain (proportions, couleurs, vêtements)
5. Les sprites respectent les dimensions existantes (hitbox ~40x60px)
6. Performance : `drawImage()` maintient 60 FPS constant
7. Tests unitaires pour le chargement et le découpage des sprites
8. `npm run lint` passe
9. `npm run test:run` passe
10. `npm run build` passe

---

## Story 6.3: Animations Fluides et Réalistes

**As a** player,
**I want** smooth and natural character animations,
**so that** the character feels alive and the gameplay is satisfying.

### Acceptance Criteria

1. **Cycle de course** : Animation fluide avec interpolation entre frames (pas de "snap")
2. **Saut** :
   - Frame d'impulsion au départ du saut
   - Transition fluide vers la position aérienne
   - Transition vers la pose de chute quand vélocité Y > 0
3. **Atterrissage** : Séquence flexion → recovery → reprise course
4. **Vitesse d'animation** : Le cycle de course s'accélère avec la difficulté (vitesse du jeu)
5. Transitions entre états sans changement brusque de frame
6. Squash & stretch maintenu sur les sprites (compression à l'atterrissage)
7. Tests unitaires pour les transitions d'animation et le timing des frames
8. `npm run lint` passe
9. `npm run test:run` passe
10. `npm run build` passe

---

## Story 6.4: Sélecteur de Skin en Jeu

**As a** player,
**I want** to choose my character skin from the game,
**so that** I can pick the visual style I prefer.

### Acceptance Criteria

1. Menu de sélection de skin accessible en **Attract Mode** via une touche dédiée (ex: `S` ou `Tab`)
2. Overlay affichant les skins disponibles avec aperçu animé du personnage
3. Navigation entre les skins (flèches ou clic)
4. Le choix du skin persiste entre les sessions (localStorage)
5. Le skin sélectionné est utilisé immédiatement (attract mode + gameplay)
6. Indication visuelle du skin actif
7. Minimum 2 skins disponibles : "Classic" (géométrique) et "Detailed" (sprites)
8. Tests unitaires pour la persistance et le changement de skin
9. Tests E2E pour le flow de sélection
10. `npm run lint` passe
11. `npm run test:run` passe
12. `npm run build` passe

---

## Dependencies

- Story 6.1 doit être complétée avant 6.2, 6.3, et 6.4
- Story 6.2 doit être complétée avant 6.3 (les sprites sont nécessaires pour animer)
- Story 6.4 nécessite 6.1 + au moins un skin additionnel (6.2)
- Cet epic est indépendant des Epics 4 et 5

## Séquence recommandée

```
6.1 (Architecture) → 6.2 (Sprites) → 6.3 (Animations) → 6.4 (Sélecteur UI)
```

## Technical Notes

### Architecture Skin

```typescript
interface PlayerSkin {
  init(): Promise<void>; // Chargement assets
  render(ctx: CanvasRenderingContext2D, state: PlayerState, position: Position, animationData: AnimationData): void;
  getName(): string;
  getThumbnail(): HTMLCanvasElement | null; // Pour le sélecteur
}
```

### Sprite Sheet Format

- Format PNG avec transparence
- Frames alignées horizontalement
- Taille par frame : ~64x64px ou ~128x128px (scalé au rendu)
- Nommage : `player-run.png`, `player-jump.png`, etc.

### Fichiers impactés

- `src/core/Game.ts` — Extraction de `renderPlayer()` vers le système de skin
- `src/entities/Player.ts` — Exposition des données d'animation
- `src/config/constants.ts` — Nouvelles constantes pour les skins
- Nouveau dossier : `src/skins/` (ClassicSkin, DetailedSkin, SkinManager)
- Nouveau dossier : `public/assets/sprites/` (sprite sheets PNG)

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-01 | 1.0 | Epic créée | PO Agent (Sarah) |
