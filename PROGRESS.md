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

### À faire ensuite
- [ ] Captures sur téléphone (390 px) de toutes les pages : vérifier le menu, le diaporama, la mosaïque, aucun débordement.
- [ ] Captures ordinateur des pages pas encore revues : tire de tracteurs, exposants, photos, contact, confidentialité.
- [ ] Programmation : un contour orange apparaît autour de la liste de l'horaire au chargement (style `:focus-visible` global). À vérifier/corriger.
- [ ] Vérifier les contrastes (4,5:1) des petits textes sur les aplats vert, bleu et jaune.
- [ ] Mettre à jour la section « Direction visuelle » de `CLAUDE.md` (elle décrit encore le fond papier beige et le moulinet retiré).
- [ ] Faire valider la direction par Jérémy, puis pousser sur GitHub.

---

## Historique

- **3 novembre 2026** : maquette complète des 9 pages (commit `d33ff6a`), passe de nettoyage avec 6 agents de revue.
- **4 novembre 2026** : refonte « plein été » (voir plus haut). La session d'origine (VS Code) a été perdue; reprise à partir des fichiers modifiés et création de ce journal.
