# Où on en est

Journal de bord du projet. **À lire au début de chaque session** (Claude Code ou autre), et à mettre à jour à la fin de chaque étape, avant le commit.

Les décisions de fond (couleurs, règles, contenu) sont dans `CLAUDE.md`. Ce qui manque du côté du comité est dans `A-CONFIRMER.md`.

---

## Étape en cours : refonte « plein été » (plus de contraste, meilleures couleurs)

**Demande de Jérémy (4 novembre 2026)** : plus de contraste, un meilleur choix de couleurs, tout en gardant le côté authentique de la page d'origine (affiche de foire agricole, couleurs du moulinet, typo Barlow Condensed).

### Fait
- Skills de design installés dans `.claude/skills/` (trouvés avec `find-skills`) : `impeccable`, `taste-skill`, `emil-design-eng`, `web-design-guidelines` (en plus de `frontend-design` et `ce-simplify-code`).
- Nouvelle direction dans `site/css/site.css` :
  - Fond blanc au lieu du papier beige; sections alternées en bleu ciel pâle `#EAF4FA`.
  - En-tête blanc collant avec le **logo officiel en couleur** (`images/logo-expo.png`); ombre quand on défile.
  - Pied de page bleu `#0B67A8` (comme le site actuel) avec logo blanc (`images/logo-expo-blanc.png`).
  - Les 4 couleurs du moulinet utilisées en aplats (onglets, cartes des grandes dates).
  - Boutons et liens avec petites animations; tout s'arrête avec « réduire les animations ».
- Accueil (`index.html` + nouveau `js/accueil.js`) :
  - Héros en diaporama plein écran avec bouton pause et légendes.
  - Moulinet tiré du logo officiel (`images/moulinet.png`) qui tourne sur le bandeau orange.
  - « Six jours, six ambiances » en onglets de couleur avec photo.
  - Mosaïque « L'été 2026 en images », archives, grandes dates, « Venir à l'Expo » (photo aérienne).
- En-tête et pied de page mis à jour dans les 9 pages; favicon ajouté.
- Apparition des blocs au défilement (`js/site.js`).
- Vérifié par captures à 1440 px : accueil, histoire, remisage, programmation. Rendu cohérent.

### Vérifié et corrigé (4 novembre 2026, 2e passe)
- Captures des 9 pages sur ordinateur (1440 px) et sur téléphone (390 px, dans un cadre de 390 px car Chrome sans fenêtre ne descend pas sous ~500 px). Aucun débordement horizontal.
- Programmation : au chargement, le script ajoutait `#jour-jeu-16` à l'adresse trop tôt; le navigateur sautait à l'horaire et lui donnait le focus (contour orange). Corrigé dans `js/programmation.js` : l'adresse change seulement quand on clique un jour.
- Accueil sur téléphone : la légende du diaporama était coincée sur 4 lignes; elle a maintenant sa propre ligne au-dessus des boutons.
- Contrastes vérifiés (WCAG) : texte foncé sur vert 7,1, bleu 6,0, jaune 9,5, orange 5,9; blanc sur pied de page bleu 6,0; tout passe 4,5:1. L'orange `#C75E10` (4,2) est réservé aux grands titres.
- `CLAUDE.md` mis à jour avec la nouvelle direction.

### À faire ensuite
- [ ] Jérémy regarde le rendu dans son navigateur et donne ses retours.
- [ ] Score Lighthouse (performance, accessibilité, SEO) une fois la direction validée.
- [ ] Toujours en attente du comité : voir `A-CONFIRMER.md`.

---

## Historique

- **3 novembre 2026** : maquette complète des 9 pages (commit `d33ff6a`), passe de nettoyage avec 6 agents de revue.
- **4 novembre 2026** : refonte « plein été » (voir plus haut). La session d'origine (VS Code) a été perdue; reprise à partir des fichiers modifiés et création de ce journal.
