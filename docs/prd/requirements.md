# Requirements

## Functional Requirements

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

## Non-Functional Requirements

- **NFR1**: Le jeu doit tourner à 60 FPS constant sur navigateurs modernes (Chrome, Firefox, Safari, Edge)
- **NFR2**: Le temps de chargement initial doit être inférieur à 3 secondes
- **NFR3**: La latence entre l'input (saut) et la réaction visuelle doit être inférieure à 50ms
- **NFR4**: Le jeu doit fonctionner sans backend (100% client-side)
- **NFR5**: Le code doit être modulaire et documenté pour faciliter les itérations post-MVP
- **NFR6**: Aucune donnée utilisateur ne doit être collectée (pas de cookies/localStorage pour MVP)
- **NFR7**: Le jeu doit être jouable offline une fois chargé
- **NFR8**: Les livrables intermédiaires (docs, code) doivent être lisibles et auto-suffisants

---
