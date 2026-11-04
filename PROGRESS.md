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

### Retours du coach appliqués (4 novembre 2026, 3e passe)
Le coach a lu le dossier (`Downloads/dossier-refonte-expo-st-isidore.pdf`). Fait :
- **Accueil** : « Remiser mon véhicule cet hiver » devient le bouton principal (hors saison); « Revivre 2026 en photos » passe en secondaire.
- **Nouvelle section « L'Expo, toute l'année »** sous le bandeau : remisage (bande pleine largeur), location de salle, danse country (grange 2, 19 h–21 h, 20 $ la session, l'été), et bandeau « Nouveau en 2027 : rodéo, la semaine avant l'Expo ». Le bloc remisage du bas de l'accueil est retiré (doublon).
- **Nouvelle page `location.html`** (Location de salle) avec formulaire Netlify `location`; ajoutée au menu et au pied de page des 10 pages, et à la politique de confidentialité.
- **Plus aucun crochet visible au public** : remplacés par des phrases neutres; tout ce qui manque reste dans `A-CONFIRMER.md`.
- **Confidentialité** : notes internes retirées; responsable = la présidence (règle par défaut de la Loi 25).
- **Images en WebP** (12 Mo → 7,9 Mo), grandes photos à 1400 px; **image de partage 1200 × 630** (`images/partage/`) sur chaque page, avec adresse absolue Netlify (à changer si le nom de domaine change).
- **Tire** : étiquette « 2024 » sur la liste des pilotes.
- Menu un peu plus serré pour tenir sur une ligne avec 8 liens (menu hamburger sous 1240 px).

- **Deux salles à louer** (confirmé par Jérémy) : le palais des commerces et le Saloon de la grange 3. Section « Deux salles » avec photos sur `location.html`, choix de la salle dans le formulaire, photo du Saloon sur la carte de l'accueil et dans l'image de partage.

### Essai de nouvelle direction « Grange & rodéo » (branche `design-grange-rodeo`)
- Choisie par Jérémy parmi 4 options (Grange & rodéo, Nuit d'Expo, Journal de campagne, changement partiel).
- Tout le thème est dans **un seul fichier** : `site/css/theme-grange.css`, chargé après les autres. Retirer cette ligne des pages = retour au thème « plein été ».
- Palette : crème `#F3EAD8`, kraft `#E8D9BA`, planches brunes `#2A1D14`, rouge grange `#8E2A1E` (bouton principal), moutarde `#D9A441`, olive `#8A9A4B`, jean `#6A97A3`, rouille `#C8622A`. Contrastes vérifiés (tous ≥ 4,5:1).
- Polices locales : **Alfa Slab One** (grands titres d'affiche) et **Rye** (lettrage western : billets, bandeau, surtitres); Barlow reste pour le texte et les étiquettes.
- Cartes en cadres d'affiche (bordure brune + ombre décalée), coins carrés, planches de grange sur les sections foncées, grain de papier sur les sections claires.
- Skill `ui-ux-pro-max` ajouté (`.claude/skills/`); sa proposition par défaut (violet + Inter + Google Fonts) a été écartée : contraire à `CLAUDE.md` et à la Loi 25.
- **4 novembre 2026 : Jérémy choisit « Grange & rodéo » comme version finale.** Fusionnée dans `main` et mise en ligne. L'essai « Nuit d'Expo » reste sur la branche `design-nuit-expo` (non retenu, gardé pour référence).
- Billet de remisage collant : descend maintenant sous l'en-tête (`top:124px`), et rapetisse un peu sur les écrans peu hauts (`remisage.css`).

### À faire ensuite
- [x] Choix du thème final : Grange & rodéo.
- [ ] Mettre à jour la section « Direction visuelle » de `CLAUDE.md` pour décrire Grange & rodéo (palette, polices Alfa Slab One et Rye).
- [ ] **Formulaires en ligne : ne fonctionnent pas encore.** Netlify ne les a pas détectés (l'attribut `data-netlify` est encore dans le HTML servi). Jérémy doit activer la détection des formulaires dans Netlify et une notification courriel, puis on teste les 4 formulaires.
- [ ] Le coach recommande de garder le lien privé tant que les droits des photos ne sont pas obtenus (le site Netlify est public depuis le 4 novembre).
- [ ] Idée du coach : bouton principal de l'accueil qui change selon la saison (remisage de mi-octobre à mi-mai, Expo et billets le reste de l'année).
- [ ] Score Lighthouse après la conversion WebP.
- [ ] Toujours en attente du comité : voir `A-CONFIRMER.md`.

### ⚠ Piège technique : Acronis
L'antirançongiciel Acronis de l'ordinateur surveille les programmes qui lisent beaucoup d'images, écrivent de nouvelles versions et suppriment les originaux. Il a bloqué un script Python de conversion WebP et **a restauré tous les fichiers que Python avait modifiés**, y compris le HTML. Pour toute conversion en lot : travailler sur des copies dans un dossier temporaire, puis copier les résultats et supprimer les originaux avec `git rm`. Faire un commit avant chaque opération en lot.

---

## Historique

- **3 novembre 2026** : maquette complète des 9 pages (commit `d33ff6a`), passe de nettoyage avec 6 agents de revue.
- **4 novembre 2026** : refonte « plein été » (voir plus haut). La session d'origine (VS Code) a été perdue; reprise à partir des fichiers modifiés et création de ce journal.
