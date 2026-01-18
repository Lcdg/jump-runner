# Epic 4: Ville de Nuit - Polish Visuel

**Goal** : Implémenter le thème visuel "Ville de Nuit" défini dans le front-end-spec.md. Transformer les formes géométriques basiques en éléments reconnaissables d'un environnement urbain nocturne.

## Story 4.1: Palette Couleurs "Ville de Nuit"

**As a** player,
**I want** to see a cohesive night city color palette,
**so that** the game has a distinct visual identity.

### Acceptance Criteria

1. Couleur ciel : `#0D1B2A` (bleu nuit profond)
2. Couleur sol/trottoir : `#415A77` (gris béton)
3. Couleur personnage : `#FF6B35` (corps) et `#FF8C42` (tête)
4. Toutes les couleurs du front-end-spec.md intégrées dans constants.ts
5. Tests visuels : le jeu affiche les nouvelles couleurs
6. Aucune régression de performance (60 FPS maintenu)

---

## Story 4.2: Décor - Immeubles Arrière-Plan

**As a** player,
**I want** to see building silhouettes with lit windows in the background,
**so that** the night city atmosphere is established.

### Acceptance Criteria

1. Silhouettes d'immeubles rectangulaires en arrière-plan (`#1B263B`)
2. Fenêtres éclairées (petits carrés jaunes `#FFD60A`) placées aléatoirement
3. Parallaxe : immeubles défilent à 30-50% de la vitesse du sol
4. Maximum 5-6 immeubles visibles simultanément (performance)
5. Immeubles générés procéduralement (hauteurs et largeurs variées)
6. Tests : vérifier le défilement parallaxe

---

## Story 4.3: Décor - Sol avec Passages Piétons

**As a** player,
**I want** to see crosswalk stripes on the ground,
**so that** the urban environment feels authentic.

### Acceptance Criteria

1. Bandes blanches horizontales (`#E0E1DD`) sur le trottoir
2. Passages piétons espacés régulièrement (tous les X pixels)
3. Défilement à 100% de la vitesse (avec les obstacles)
4. Bordure de trottoir visible (ligne claire)
5. Tests : vérifier l'espacement et le défilement

---

## Story 4.4: Obstacles Sol - Poubelle, Cône, Voiture

**As a** player,
**I want** to see recognizable urban obstacles,
**so that** I can quickly identify what to avoid.

### Acceptance Criteria

1. **Poubelle** : Rectangle vert (`#386641`) + couvercle, ~30x50px, petit saut
2. **Cône de chantier** : Triangle orange (`#FF9F1C`) + bandes blanches, ~25x40px, petit saut
3. **Voiture garée** : Corps coloré (`#9B2335` ou `#3D5A80`) + roues noires + phares jaunes, ~100x45px, grand saut
4. Hitbox adaptée à chaque forme d'obstacle
5. Spawn aléatoire parmi les types d'obstacles
6. Tests unitaires pour chaque type d'obstacle
7. Tests E2E : vérifier que les obstacles sont reconnaissables

---

## Story 4.5: Personnage - Jambes + Animation Course

**As a** player,
**I want** to see my character running with animated legs,
**so that** the gameplay feels more alive.

### Acceptance Criteria

1. Personnage avec jambes (2 rectangles `#FF6B35`, 6x20px chacune)
2. Animation de course : alternance des jambes (loop 200ms)
3. Animation active uniquement quand le personnage est au sol
4. Jambes statiques/groupées pendant le saut
5. Aucun impact sur les hitbox existantes
6. Tests : vérifier l'alternance des jambes

---

## Story 4.6: Personnage - Animation Saut (Squash/Stretch)

**As a** player,
**I want** visual feedback when jumping and landing,
**so that** my actions feel responsive.

### Acceptance Criteria

1. Légère compression (squash) à l'atterrissage (~50ms)
2. Jambes groupées pendant le saut
3. Optionnel : légère extension (stretch) au début du saut
4. Animation subtile, ne pas distraire
5. Tests : vérifier les frames d'animation

---

## Dependencies

- front-end-spec.md : source de vérité pour les couleurs et dimensions
- Story 4.1 doit être complétée avant les autres (palette de base)
- Story 4.4 peut être parallélisée avec 4.2 et 4.3

## Technical Notes

### Rendering Layers (Z-order)

1. Ciel (fond statique)
2. Immeubles (parallaxe lent)
3. Lampadaires décoratifs (si ajoutés)
4. Sol + passages piétons
5. Obstacles
6. Personnage
7. UI (score, overlays)

### Performance Considerations

- Object pooling pour les éléments de décor
- Limiter les éléments visibles (5-6 immeubles, 3-4 lampadaires max)
- Couleurs pleines uniquement (pas de gradients complexes)
- Formes géométriques natives Canvas (`fillRect`, `arc`, `moveTo/lineTo`)

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-18 | 1.0 | Epic créée | PM Agent |
