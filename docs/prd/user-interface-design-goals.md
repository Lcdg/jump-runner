# User Interface Design Goals

## Overall UX Vision

Une expérience de jeu **immédiate et sans friction**. Le joueur doit comprendre le gameplay en moins de 10 secondes sans aucune instruction. L'interface est épurée à l'extrême : seul le score est visible pendant le jeu. L'accent est mis sur la lisibilité (personnage et obstacles clairement distincts) et la réactivité des contrôles.

## Key Interaction Paradigms

- **One-button gameplay** : Toute l'interaction se résume à un seul input (saut)
- **Instant feedback** : Réponse visuelle immédiate à chaque action
- **Fail-fast, retry-fast** : Game over clair, restart en un clic
- **Progressive challenge** : Courbe de difficulté naturelle sans sélection de niveau

## Core Screens and Views

1. **Écran titre (Attract Mode)** : Le jeu tourne en arrière-plan en mode démo (décor qui défile, personnage qui saute automatiquement pour éviter les obstacles). Overlay "Press Space to Start" affiché.

2. **Écran de jeu (principal)** : Le joueur contrôle le personnage, le score s'affiche et augmente en temps réel, les obstacles défilent.

3. **Écran Game Over** : Le décor continue de défiler mais le personnage a disparu. Overlay affichant le score final + "Press Space to Restart". Le vide laissé par le personnage absent renforce visuellement l'échec.

## Accessibility

Pas d'exigences WCAG spécifiques pour le MVP. Le jeu repose sur la réactivité et le timing.

## Branding

Style **géométrique minimaliste** :
- Personnage : Formes simples (cercle pour la tête, rectangles pour le corps)
- Obstacles : Formes géométriques basiques (rectangles, triangles)
- Palette : Couleurs contrastées et lisibles (à définir avec l'Architect)
- Pas de logo ou d'identité de marque

## Target Devices and Platforms

- **Priorité** : Desktop (clavier pour le saut)
- **Navigateurs** : Chrome, Firefox, Safari, Edge (2 dernières versions)
- **Mobile** : Hors scope MVP (pourrait être ajouté en Phase 2 avec tap)

---
