# Epic 5: Obstacles Aériens

**Goal** : Enrichir le gameplay en ajoutant des obstacles aériens que le joueur doit éviter en restant au sol ou en ne sautant pas. Créer une dynamique de jeu plus riche avec des patterns mixtes sol/aérien.

## Story 5.1: Lampadaires (Obstacle Aérien)

**As a** player,
**I want** to avoid streetlight tops while running,
**so that** the gameplay has more variety.

### Acceptance Criteria

1. Lampadaire composé de :
   - **Poteau** : élément décoratif (pas de collision), rectangle vertical fin
   - **Partie haute** : obstacle avec hitbox (rectangle + halo lumineux `#FFF3B0`)
2. Position de la partie haute : au-dessus de la hauteur du joueur au sol
3. Le joueur **au sol** passe en dessous sans collision
4. Le joueur **en saut** entre en collision avec la partie haute
5. Couleurs distinctes pour identifier rapidement le danger
6. Tests unitaires : collision détectée seulement quand joueur en l'air
7. Tests E2E : vérifier le comportement au sol vs en saut

### Technical Notes

- Hitbox uniquement sur la partie supérieure du lampadaire
- Le poteau est rendu mais sans collision (élément décoratif)
- Hauteur de la zone de danger : Y < groundY - PLAYER.HEIGHT

---

## Story 5.2: Autres Obstacles Aériens

**As a** player,
**I want** variety in aerial obstacles,
**so that** the game stays interesting.

### Acceptance Criteria

1. Au moins 2 types d'obstacles aériens en plus du lampadaire :
   - **Panneau de signalisation** : rectangle avec poteau
   - **Branche d'arbre** : forme irrégulière (ou simplifiée en rectangle)
   - **Enseigne de magasin** : rectangle suspendu
2. Chaque obstacle a une hitbox appropriée à sa forme
3. Couleurs/formes distinctes des obstacles au sol
4. Spawn aléatoire parmi les types disponibles
5. Tests pour chaque type d'obstacle aérien

### À Définir

- Choix final des obstacles aériens (2-3 types)
- Proportions et couleurs exactes
- Fréquence de spawn relative aux obstacles sol

---

## Story 5.3: Validation des Patterns (Garantir Passage)

**As a** player,
**I want** to always have a way to pass obstacles,
**so that** the game is challenging but fair.

### Acceptance Criteria

1. Système de validation des patterns :
   - Ne jamais spawner obstacle sol + obstacle aérien au même moment qui bloque tout passage
   - Minimum d'espace entre obstacle sol et obstacle aérien consécutifs
2. Règles de spawn :
   - Si obstacle sol présent, délai minimum avant obstacle aérien
   - Si obstacle aérien présent, le joueur doit avoir le temps de retomber au sol
3. Configuration des contraintes dans constants.ts
4. Tests unitaires : vérifier qu'aucun pattern impossible n'est généré
5. Test E2E : jouer 60 secondes sans pattern bloquant

### Technical Notes

#### Contraintes de Spawn

```typescript
const SPAWN_RULES = {
  // Distance minimum entre obstacle sol et aérien
  MIN_GROUND_TO_AERIAL_GAP: 150, // pixels

  // Temps minimum pour que le joueur retombe
  MIN_LANDING_TIME: 0.3, // secondes

  // Probabilité d'obstacle aérien vs sol
  AERIAL_PROBABILITY: 0.25, // 25% aérien, 75% sol
};
```

#### Logique de Validation

1. Avant de spawner un obstacle, vérifier :
   - Type du dernier obstacle spawné (sol ou aérien)
   - Distance/temps depuis le dernier obstacle
   - Si combinaison bloque le passage → retarder ou changer le type

2. Patterns autorisés :
   - Sol seul ✅
   - Aérien seul ✅
   - Sol → Aérien (avec gap suffisant) ✅
   - Aérien → Sol (avec gap suffisant) ✅
   - Sol + Aérien simultané ❌ (INTERDIT)

---

## Dependencies

- Epic 4 (Ville de Nuit) devrait être complétée avant pour avoir le thème visuel
- Story 5.1 doit être faite avant 5.2 (établir le pattern de base)
- Story 5.3 peut être développée en parallèle avec 5.1/5.2

## Technical Notes

### Obstacle Types Enum

```typescript
type ObstacleType = 'ground' | 'aerial';

interface ObstacleConfig {
  type: ObstacleType;
  hitbox: Hitbox;
  renderFn: (ctx: CanvasRenderingContext2D, pos: Position) => void;
}
```

### Collision Detection Update

Le système de collision existant doit prendre en compte :
- Position Y du joueur (au sol vs en l'air)
- Type d'obstacle (sol vs aérien)

```typescript
// Pseudo-code
if (obstacle.type === 'aerial') {
  // Collision seulement si joueur en l'air
  if (player.isJumping() || player.isFalling()) {
    checkCollision(player, obstacle);
  }
} else {
  // Obstacle sol : collision normale
  checkCollision(player, obstacle);
}
```

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-18 | 1.0 | Epic créée | PM Agent |
