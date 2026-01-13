# Project Brief: Jump Runner

## Executive Summary

**Jump Runner** est un mini-jeu web de type auto-scroller conçu comme projet démo pour valider la méthodologie BMAD. Le joueur incarne un petit bonhomme qui se déplace automatiquement de gauche à droite et doit sauter (action unique) pour éviter des obstacles qui apparaissent progressivement.

Le jeu utilise des graphismes volontairement simples pour se concentrer sur les mécaniques de base et le processus de développement. Ce projet vise à créer une expérience de jeu minimaliste mais engageante, accessible directement dans le navigateur, tout en servant de cas d'usage concret pour tester l'efficacité du workflow BMAD Method dans le développement de jeux vidéo.

**Cible principale** : Développeurs et créateurs souhaitant expérimenter avec BMAD Method
**Plateforme** : Navigateur web (HTML5/Canvas ou similaire)
**Valeur clé** : Démonstrateur simple et fonctionnel de la méthode BMAD appliquée au game dev

---

## Problem Statement

**État actuel :**
Les développeurs souhaitant adopter la méthodologie BMAD ont besoin de cas d'usage concrets et de projets de référence pour comprendre comment appliquer le workflow en pratique. Actuellement, il n'existe pas de projet démo simple et documenté qui illustre l'application complète de BMAD dans le contexte du développement de jeux web.

**Impact du problème :**
- Les nouveaux utilisateurs de BMAD peuvent hésiter à l'adopter sans exemple concret
- Le manque de cas d'usage simples rend difficile l'évaluation de la méthodologie
- Les développeurs perdent du temps à expérimenter sans guide de référence
- La courbe d'apprentissage de BMAD reste théorique sans projet pratique

**Pourquoi les solutions existantes ne suffisent pas :**
- La documentation BMAD est complète mais reste abstraite sans implémentation concrète
- Les projets complexes existants sont trop intimidants pour débuter
- Aucun projet démo "mini-jeu" n'illustre le workflow complet de A à Z

**Urgence :**
Ce projet permet de valider immédiatement l'efficacité de BMAD sur un cas simple et de créer un référentiel réutilisable pour d'autres développeurs.

---

## Proposed Solution

**Concept de base :**
Jump Runner est un jeu d'auto-scroller minimaliste accessible via navigateur web. Le joueur contrôle un petit bonhomme stylisé qui se déplace automatiquement de gauche à droite à vitesse constante. L'unique mécanique de gameplay est le saut (touche Espace ou clic/tap), permettant d'éviter les obstacles statiques qui apparaissent sur le parcours.

**Mécaniques de jeu :**
- **Score basé sur la survie** : Le score augmente avec le temps de jeu. Plus le joueur survit longtemps, plus son score est élevé.
- **Collision = Game Over** : Toucher un obstacle fige immédiatement le score et affiche l'écran de game over
- **Difficulté progressive** : Le jeu commence facile et devient progressivement plus difficile (obstacles plus fréquents, patterns plus complexes)
- **Parties courtes** : Durée maximale visée de ~5 minutes pour une session
- **Restart immédiat** : Possibilité de recommencer rapidement après un game over

**Différenciateurs clés :**
- **Ultra-simplicité intentionnelle** : Une seule action (sauter), graphismes minimalistes, animations basiques
- **Documentation complète du processus** : Chaque étape de développement sera documentée selon BMAD Method, créant un guide de référence
- **Code commenté et éducatif** : Le code source servira d'exemple pédagogique pour d'autres développeurs
- **Déploiement immédiat** : Jouable directement dans le navigateur sans installation (GitHub Pages ou similaire)

**Pourquoi cette solution fonctionnera :**
- La simplicité du gameplay permet de se concentrer sur le processus BMAD plutôt que sur la complexité technique
- Le format mini-jeu est suffisamment complet pour démontrer toutes les phases du workflow (planning, dev, QA)
- Le résultat final sera tangible et partageable (lien web direct)
- La progression de difficulté offre une expérience rejouable et addictive malgré la simplicité
- Les parties courtes encouragent les tentatives multiples ("just one more try")

**Vision produit :**
Un jeu fonctionnel et jouable en quelques minutes, avec système de score basé sur la survie, difficulté progressive, game over clair, et possibilité de restart immédiat. Le projet complet illustrera comment BMAD structure le développement depuis l'idée initiale jusqu'au déploiement web.

---

## Target Users

### Primary User: Vous-même (Développeur en apprentissage BMAD)

**Profil et contexte :**
- Développeur explorant et apprenant la méthodologie BMAD Method
- Projet personnel d'expérimentation et de formation
- Objectif : Maîtriser le workflow BMAD sur un cas concret et simple

**Comportements et besoins actuels :**
- Première utilisation complète de BMAD Method de A à Z
- Besoin d'un projet suffisamment simple pour se concentrer sur la méthode
- Volonté de documenter le processus pour référence future personnelle
- Apprentissage par la pratique

**Objectifs spécifiques :**
- Comprendre et appliquer chaque phase du workflow BMAD (planning, dev, QA)
- Tester l'efficacité de la méthode sur un projet game dev
- Créer un référentiel personnel pour de futurs projets
- Valider que BMAD convient à votre style de travail
- Produire un mini-jeu fonctionnel comme résultat tangible

**Critères de succès :**
- Avoir suivi le processus BMAD complet
- Comprendre les différents agents et workflows
- Obtenir un jeu déployable et fonctionnel
- Documentation claire pour réutilisation future

### Secondary User (optionnel): Testeurs personnels

**Profil :**
- Amis, collègues, ou vous-même en tant que joueur
- Utilisés pour tester le jeu et valider les mécaniques

**Besoins :**
- Jeu fonctionnel et jouable
- Contrôles intuitifs
- Expérience satisfaisante même si basique

**Note :** Ce segment existe uniquement pour la phase de test et validation, pas pour un déploiement public.

---

## Goals & Success Metrics

### Business Objectives (Objectifs d'apprentissage)

- **Compléter le workflow BMAD de bout en bout** : Passer par toutes les phases (Analyst → PM → Architect → SM → Dev → QA) et utiliser au moins 5 agents différents
- **Livrer rapidement une première version fonctionnelle** : Avoir une version MVP jouable en quelques jours, puis itérer avec des améliorations progressives
- **Documenter le processus** : Créer une documentation complète du workflow BMAD appliqué (PRD, Architecture, Stories, notes de développement)
- **Valider la qualité du processus BMAD** : Évaluer notamment si les tests et la documentation générés par BMAD sont pertinents et utiles
- **Acquérir une référence réutilisable** : Créer un template/pattern que vous pourrez réutiliser pour de futurs projets

### User Success Metrics (Expérience de jeu)

- **Temps de première partie** : Le joueur comprend les contrôles et lance une partie en moins de 10 secondes
- **Rejouabilité** : Le joueur fait au moins 3 tentatives consécutives après son premier game over
- **Durée de session** : Les parties durent entre 30 secondes et 5 minutes selon le niveau de compétence
- **Compréhension immédiate** : Aucune instruction n'est nécessaire pour comprendre le gameplay (auto-explicatif)
- **Fluidité technique** : Le jeu tourne à 60 FPS sans lag sur navigateur moderne

### Key Performance Indicators (KPIs) - Focus Qualitatif

**Processus BMAD :**
- **Complétude du workflow** : 100% des phases planification → développement → QA complétées
- **Agents BMAD utilisés** : Au moins 5 agents différents utilisés et testés
- **Qualité de la documentation BMAD** : PRD, Architecture, et Stories clairs, structurés et utiles pour le développement
- **Pertinence des tests** : Stratégie de test définie par l'agent QA et implémentée avec succès
- **Valeur ajoutée de la méthode** : Documentation et tests générés par BMAD démontrent leur utilité concrète

**Livrable technique :**
- **MVP fonctionnel** : Version initiale déployable en quelques jours avec features core
- **Qualité du code** : Code organisé, commenté, maintenable
- **Déploiement réussi** : Jeu accessible via URL et jouable
- **Évolutivité** : Architecture permettant d'ajouter facilement des améliorations post-MVP

**Timeline :** Première version MVP en quelques jours, avec possibilité d'itérations et améliorations progressives par la suite.

---

## MVP Scope

### Core Features (Must Have) - MVP

- **Auto-scroll visuel** : Le personnage reste à une position fixe à l'écran (typiquement à gauche), et c'est le décor/paysage qui défile de droite à gauche, créant l'illusion que le personnage avance

- **Saut unique** : Le joueur peut faire sauter le personnage avec la touche Espace ou clic/tap (physique de saut simple : hauteur et durée fixes)

- **Obstacles statiques** : Des obstacles apparaissent à droite de l'écran et défilent vers la gauche avec le décor. Le joueur doit les éviter en sautant (formes géométriques simples)

- **Détection de collision** : Le jeu détecte quand le personnage touche un obstacle et déclenche le game over

- **Système de score temporel** : Score qui augmente avec le temps de survie (affichage en temps réel à l'écran)

- **Game Over et Restart** : Écran de game over affichant le score final avec bouton "Restart" pour rejouer immédiatement

- **Difficulté progressive** : Augmentation graduelle de la fréquence d'apparition des obstacles au fil du temps

- **Graphismes minimalistes** :
  - **Personnage** : Bonhomme stylisé avec formes géométriques simples (tête ronde, corps rectangulaire, membres basiques) pour représenter clairement une personne
  - **Obstacles** : Formes géométriques simples (carrés, rectangles, triangles)
  - **Décor** : Fond défilant simple (sol/ligne d'horizon basique)

- **Animation basique du saut** : Animation simple du mouvement vertical du personnage lors du saut

- **Interface minimale** : Affichage du score actuel pendant le jeu, écran de game over avec score final et bouton restart

### Out of Scope for MVP

- ❌ High score persistant (sauvegarde entre sessions)
- ❌ Différents types d'obstacles avec comportements variés
- ❌ Power-ups ou bonus
- ❌ Niveaux ou étapes distinctes
- ❌ Musique ou effets sonores
- ❌ Animations complexes ou particules
- ❌ Menu principal élaboré
- ❌ Modes de difficulté sélectionnables
- ❌ Thèmes visuels alternatifs
- ❌ Support mobile tactile (peut être ajouté post-MVP si simple)
- ❌ Multiplayer ou classement en ligne
- ❌ Personnalisation du personnage

### MVP Success Criteria

Le MVP sera considéré comme réussi si :

1. **Jouabilité complète** : Un cycle de jeu complet est possible (start → play → die → restart)
2. **Zéro bug critique** : Aucun bug empêchant de jouer ou causant des crashs
3. **Performance acceptable** : Le jeu tourne fluidement à 60 FPS sur navigateur moderne
4. **Compréhension immédiate** : Un nouveau joueur comprend comment jouer en moins de 10 secondes
5. **Rejouabilité** : La difficulté progressive encourage à rejouer pour battre son score
6. **Code maintenable** : Architecture claire permettant d'ajouter facilement des features post-MVP

---

## Post-MVP Vision

### Phase 2 Features (Améliorations prioritaires)

**Enrichissement du gameplay :**
- **Variété d'obstacles** : Nouveaux types d'obstacles avec designs visuels différents (hauteurs variées, formes différentes, obstacles volants, etc.)
- **Power-ups et malus** :
  - **Power-up Invincibilité** : Le joueur peut traverser les obstacles pendant quelques secondes
  - **Malus Accélération** : Le défilement du paysage s'accélère temporairement, augmentant la difficulté
- **Effets sonores basiques** (optionnel) : Sons pour le saut, collision, et récupération de power-ups

**Variation visuelle :**
- **Thèmes d'environnement** : Changement de thème visuel tous les X points ou aléatoirement
  - **Désert** : Couleurs chaudes, obstacles type cactus/rochers
  - **Forêt** : Couleurs vertes, obstacles type troncs/buissons
  - **Ville** : Couleurs urbaines, obstacles type panneaux/poubelles
- **Transitions de thèmes** : Animation ou fondu simple lors du changement d'environnement

### Long-term Vision (Si poursuite du projet)

**Extensions possibles :**
- **Plus de thèmes** : Neige, espace, plage, etc.
- **Variété de power-ups supplémentaires** : Ralentissement du temps, double saut, bouclier
- **Amélioration des animations** : Animations de course du bonhomme plus fluides, effets de particules simples
- **Support mobile/tactile** : Adaptation des contrôles pour smartphones (tap pour sauter)
- **Progression de difficulté plus sophistiquée** : Patterns d'obstacles plus complexes, combinaisons stratégiques

### Expansion Opportunities

**Réutilisation de BMAD sur d'autres projets :**
- Utiliser Jump Runner comme template pour créer d'autres mini-jeux rapidement avec BMAD
- Documenter les patterns réutilisables (game loop, collision detection, state management, thème switching)
- Créer une bibliothèque de composants game dev documentés selon BMAD

**Apprentissage continu :**
- Expérimenter avec d'autres agents BMAD non utilisés dans le MVP
- Tester des workflows alternatifs ou des expansion packs BMAD
- Affiner la documentation pour de futurs projets plus complexes

---

## Technical Considerations

### Platform Requirements

- **Target Platforms** : Navigateurs web modernes (Chrome, Firefox, Safari, Edge)
- **Browser/OS Support** :
  - Versions récentes des navigateurs (dernières 2 versions majeures)
  - Desktop prioritaire (Windows, macOS, Linux)
  - Mobile optionnel en Phase 2
- **Performance Requirements** :
  - 60 FPS constant pendant le gameplay
  - Temps de chargement initial < 3 secondes
  - Réactivité des contrôles < 50ms

### Technology Preferences

**Frontend (jeu et interface) :**
- **Option recommandée** : HTML5 Canvas + JavaScript vanilla ou TypeScript
- **Alternative** : Framework léger type Phaser.js ou PixiJS si besoin de simplification du game loop
- **Justification** : Simplicité, pas de dépendances lourdes, contrôle total, apprentissage des bases

**Build & Tooling :**
- **Module bundler** : Vite ou Parcel (setup minimal, dev server rapide)
- **Package manager** : npm ou pnpm
- **TypeScript** : Optionnel mais recommandé (meilleure maintenabilité)

**Hosting/Déploiement :**
- **Option simple** : GitHub Pages (gratuit, intégration directe avec repo)
- **Alternative** : Netlify, Vercel, ou Cloudflare Pages
- **CI/CD** : Déploiement automatique via GitHub Actions (optionnel)

**Assets & Graphismes :**
- **Pas de framework 3D** : Tout en 2D
- **Pas de sprites complexes** : Dessins géométriques via Canvas ou SVG inline
- **Palette de couleurs** : Définie en CSS/constantes pour faciliter le theming

### Architecture Considerations

**Repository Structure :**
```
jump-runner/
├── src/
│   ├── game/          # Game logic
│   │   ├── entities/  # Player, obstacles, power-ups
│   │   ├── systems/   # Physics, collision, scoring
│   │   └── states/    # Game states (menu, playing, gameover)
│   ├── rendering/     # Canvas rendering
│   ├── input/         # Keyboard/mouse handling
│   └── main.js        # Entry point
├── assets/            # Minimal assets (if any)
├── docs/              # BMAD documentation
└── dist/              # Build output
```

**Service Architecture :**
- **Monolithic client-side** : Pas de backend nécessaire pour MVP
- **Modularité** : Code organisé en modules ES6 pour faciliter l'ajout de features
- **State management** : Pattern simple (pas de Redux/Vuex, juste un game state object)

**Integration Requirements :**
- Aucune intégration externe pour MVP (pas d'analytics, pas d'API)
- Tout fonctionne offline une fois chargé

**Security/Compliance :**
- Pas de données utilisateur collectées
- Pas de cookies ou localStorage pour MVP
- Code source privé (repository GitHub privé)

---

## Constraints & Assumptions

### Constraints

**Budget :**
- Budget total : 0€ (projet personnel gratuit)
- Hébergement : Gratuit (GitHub Pages, Netlify, etc.)
- Outils : Uniquement outils gratuits et open-source
- Pas d'achat d'assets (graphismes créés en code)

**Timeline :**
- **MVP** : Quelques jours de développement
- **Post-MVP** : Aucune deadline, itérations au rythme souhaité
- Disponibilité : Temps libre personnel (pas de pression externe)

**Resources :**
- **Équipe** : Développeur solo (vous) assisté par les agents BMAD
- **Compétences disponibles** : Développement web, JavaScript/TypeScript
- **Compétences à développer** : Game development basics, BMAD Method workflow
- **Design graphique** : Limité aux formes géométriques simples (pas de designer)

**Technical :**
- Pas de serveur backend (client-side uniquement)
- Navigateur moderne requis (pas de support IE)
- Pas d'accès à des API payantes ou services tiers
- Code doit rester simple et maintenable par une seule personne

### Key Assumptions

**Sur le projet :**
- La simplicité du jeu est suffisante pour valider la méthode BMAD
- Les graphismes minimalistes n'empêchent pas une expérience jouable
- Un gameplay addictif peut être créé avec une seule action (sauter)
- Le code sera suffisamment documenté pour être repris plus tard

**Sur la méthode BMAD :**
- BMAD Method est adapté au développement de jeux vidéo simples
- Les agents BMAD fourniront une structure et une documentation utiles
- Le workflow BMAD n'alourdira pas le processus pour un petit projet
- La documentation générée sera pertinente et réutilisable
- **L'agent QA créera des tests automatisés pertinents et utiles** pour valider les features avant tests manuels

**Sur la technique :**
- HTML5 Canvas est suffisant pour les besoins du jeu
- Pas besoin de moteur de jeu complet (Phaser, Unity, etc.)
- Les performances seront acceptables sans optimisations poussées
- Le déploiement sur GitHub Pages sera simple et suffisant

**Sur le développement :**
- Le projet peut être complété en solo avec aide IA
- Les features MVP sont réalisables en quelques jours
- Aucun blocage technique majeur n'est anticipé
- **Une suite de tests automatisés sera mise en place** (framework type Jest/Vitest) pour valider le comportement du jeu
- Les tests automatisés détecteront les régressions avant les tests manuels

---

## Risks & Open Questions

### Key Risks

- **Courbe d'apprentissage BMAD** : Première utilisation complète de BMAD Method - possible ralentissement initial pour comprendre le workflow
  - *Impact* : Peut allonger la timeline de quelques jours
  - *Mitigation* : Documentation BMAD disponible, accepter le temps d'apprentissage

- **Complexité game dev sous-estimée** : Les mécaniques de jeu peuvent être plus complexes que prévu (physics, collision, timing)
  - *Impact* : Risque de dépassement de la timeline MVP
  - *Mitigation* : Scope MVP volontairement minimal, possibilité de simplifier encore si nécessaire

- **Overhead du processus BMAD** : Le workflow BMAD pourrait sembler trop lourd pour un petit projet
  - *Impact* : Frustration, abandon de certaines phases BMAD
  - *Mitigation* : C'est justement ce qu'on teste, documenter l'expérience positive ou négative

- **Qualité des tests générés** : L'agent QA pourrait générer des tests peu pertinents ou incomplets
  - *Impact* : Tests inutiles, faux sentiment de sécurité
  - *Mitigation* : Review manuelle des tests, ajustement des prompts à l'agent QA

- **Performance Canvas** : Risque de frame drops si le rendering n'est pas optimisé
  - *Impact* : Expérience de jeu dégradée
  - *Mitigation* : Profiling précoce, optimisations ciblées si nécessaire

### Open Questions

- **Framework game ou vanilla ?** : Utiliser Phaser.js/PixiJS ou tout coder from scratch ?
  - *À décider avec* : Agent Architect lors de la phase architecture

- **TypeScript vs JavaScript ?** : Quel langage privilégier pour le MVP ?
  - *À décider avec* : Agent Architect, considérer le trade-off setup time vs maintenabilité

- **Stratégie de tests** : Quels aspects tester en priorité (collision, scoring, game states) ?
  - *À décider avec* : Agent QA lors de la définition de la stratégie de test

- **Progression de difficulté** : Algorithme précis pour augmenter la difficulté (linéaire, exponentielle, par paliers) ?
  - *À affiner durant* : Phase de développement avec l'agent Dev

- **Hébergement** : GitHub Pages, Netlify, ou autre ?
  - *À décider* : Lors du setup initial du projet

- **Physique du saut** : Gravité réaliste ou stylisée/arcade ?
  - *À affiner durant* : Phase de développement, potentiellement avec des tests utilisateur

### Areas Needing Further Research

- **Best practices game loop en JavaScript** : Rechercher les patterns standards (requestAnimationFrame, delta time, etc.)

- **Collision detection efficace** : Algorithmes de détection de collision simples mais performants pour 2D

- **Testing de game logic** : Comment tester efficacement du code game dev (mock du canvas, simulation de frames, etc.)

- **Déploiement web optimisé** : Bonnes pratiques pour optimiser le chargement et les performances d'un jeu web

---

## Next Steps

### Immediate Actions

1. **Valider ce Project Brief** : Review finale et approbation du document par vous

2. **Initialiser le repository Git** :
   - Créer le repository GitHub privé
   - Structure de dossiers initiale
   - README.md basique

3. **Handoff vers PM Agent** : Passer ce Project Brief à l'agent PM pour création du PRD (Product Requirements Document)

4. **PRD Creation (avec agent PM)** :
   - Transformer le brief en PRD détaillé avec spécifications fonctionnelles
   - Définir les epics et user stories
   - Établir les critères d'acceptation pour chaque feature
   - Documenter les exigences non-fonctionnelles (performance, accessibilité)

5. **Architecture Definition (avec agent Architect)** :
   - Créer le document d'architecture technique
   - Définir la stack technologique finale (vanilla vs framework)
   - Concevoir la structure du code et les patterns
   - Établir les standards de code et conventions

6. **PO Validation & Sharding** :
   - Valider l'alignement PRD/Architecture avec l'agent PO
   - Fragmenter (shard) les documents en epics et stories exploitables
   - Prioriser les stories pour le sprint 1

7. **Begin Development Cycle** :
   - L'agent SM prépare la première story
   - L'agent Dev implémente selon les specs
   - L'agent QA valide et teste
   - Itération jusqu'au MVP complet

### PM Handoff

**Ce Project Brief fournit le contexte complet pour Jump Runner.**

**Prochaine étape :** Démarrer l'agent PM en mode "PRD Generation" avec la commande `/pm` pour créer le Product Requirements Document section par section basé sur ce brief.

Le PM devra :
- Transformer les features MVP en spécifications détaillées avec critères d'acceptation
- Créer des epics logiques (Setup & Infrastructure, Core Gameplay, UI/UX, Scoring & Progression, etc.)
- Définir des user stories actionnables pour chaque epic
- Documenter les exigences non-fonctionnelles (60 FPS, temps de chargement, etc.)
- Maintenir la cohérence avec ce brief tout en ajoutant les détails techniques nécessaires

---

**Document créé par :** Mary (Business Analyst)
**Date :** 2026-01-13
**Version :** 1.0
