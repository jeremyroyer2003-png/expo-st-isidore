# Où on en est

Journal de bord du projet. **À lire au début de chaque session** (Claude Code ou autre), et à mettre à jour à la fin de chaque étape, avant le commit.

Les décisions de fond (couleurs, règles, contenu) sont dans `CLAUDE.md`. Ce qui manque du côté du comité est dans `A-CONFIRMER.md`.

---

## Étape en cours (10 novembre 2026) : reconstruction en application Next.js (branche `rebuild`)

**Demande de Jérémy** : application française complète avec back-office (Next.js + Supabase + Stripe en mode test), **en local seulement, aucun déploiement Netlify avant son approbation**. Le site statique `site/` reste intact (tag Git `baseline` = état d'avant). Le nouveau code est dans `web/`.

Décisions (10 novembre) : Node LTS installé en version portable (sans droits admin) dans `%LOCALAPPDATA%\Programs
ode-v26.13.0-win-x64`; base Supabase = **projet gratuit en ligne** (pas Docker); photos Facebook = Jérémy les télécharge lui-même; prix inconnus = **valeurs fictives marquées « à confirmer »**, cachées au public (« Prix sur demande »), visibles en dev seulement avec `AFFICHER_PRIX_FICTIFS=true`.

Phases (un commit chacune) :
- [x] 1. Scaffold : Next 16 + TS + Tailwind, schéma SQL avec RLS (`web/supabase/migrations/0001_schema.sql`), seed (`seed.sql`), clients Supabase/Stripe, courriels simulés (boîte d'envoi)
- [x] 2. Site public : pages converties du site statique (même CSS), programmation animée depuis la base, galerie/vidéos depuis la médiathèque, contact/exposants en actions serveur
- [x] 3. Flux de réservation : salles (calendrier libre-service), kiosques intérieurs (plan + approbation), kiosques extérieurs (entente + facture), danse (forfaits), remisage (approbation + dépôt)
- [x] 4. Paiements Stripe (test), webhook, page de confirmation
- [x] 5. Admin : rôles super_admin / editeur / lecteur, réservations, calendrier, prix, médias, contenu, boîte d'envoi, annulations et remboursements
- [x] 6. Finition et docs : `docs/DEVELOPPEUR.md`, `docs/GUIDE-PERSONNEL.md`, nouveaux points dans `A-CONFIRMER.md`

**Prochaine étape (Jérémy)** : créer un projet Supabase et un compte Stripe en mode test, remplir `web/.env.local`, exécuter la migration et le seed, créer son compte super-admin (`npm run creer-admin`), puis tester chaque flux de bout en bout (voir `docs/DEVELOPPEUR.md`). Rien n'a encore été testé contre une vraie base ni contre Stripe : seuls le typecheck, le lint, le build et le rendu des pages ont été vérifiés.

Notes techniques : le serveur de dev se lance avec `npm run dev` dans `web/` (ajouter Node au PATH si le terminal était ouvert avant l'installation). Captures à 390 px : passer par un iframe (Chrome sans interface impose ~500 px minimum).

---

## Étape précédente : refonte « plein été » (plus de contraste, meilleures couleurs)

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

### Critique impeccable et corrections (4 novembre 2026, soir)
- Skill `impeccable` : `critique` lancée en double évaluation (agent design + agent détecteur). **Note : 26/40.** Rapport dans `.impeccable/critique/`.
- Choix de Jérémy : formulaires d'abord, ton « foire agricole », tout corriger (même le mineur).
- Fait : formulaires et horaire au style grange (cocardes, étiquettes d'inscription, talons de billet) · pochoir Big Shoulders Stencil pour bandeau/billets/étiquettes, Rye réservé au Saloon/danse/rodéo · plus de surtitres ni de glyphes ★ · cocardes sur les grandes dates · promesse de prix cohérente (estimation masquée sans tarif) · « ex. » dans les exemples · « Infos et contact » · **héros selon la saison** (hiver = remisage, été = Expo; classe posée dans le `<head>` de index.html) · moulinet retiré du thème · mini-billet collant sur téléphone · erreurs sous chaque champ (code partagé `Expo.afficherErreur` dans site.js) · dates sans passé + date de rechange · six jours visibles sur téléphone · « Ce qui arrive ensuite » sur la location · corrections mineures (survol, placeholders, contour « D'HIVER », text-wrap, bandeau en pause au survol).
- Prochaine étape : relancer `critique` pour mesurer le gain.

### 2e critique (5 novembre 2026) : 27/40, puis ronde 2
- Fait : héros d'hiver en image fixe (photo aérienne) + « Entrées en cours » · remisage : « Prêt à envoyer » seulement si tout est valide, « Reçue » au lieu de « Admis », erreur du type visible, exemple propre à chaque mesure, erreur d'envoi au-dessus du bouton · cartes de véhicule à indicateur rond, 2 colonnes sur téléphone · **location : cartes de salle cliquables, boutons « Choisir cette salle », billet de réservation qui se remplit (`js/location.js`)**, date de rechange après la date souhaitée · catégories identiques accueil/programmation (+ Kiosques), « Avant » devenu une note, mercredi expliqué · tous les titres de cartes en Alfa Slab (Rye seulement pour l'étiquette du rodéo) · 200 espaces insécables (heures, $, : ; ? !) hors des scripts · hiérarchie des tailles sur téléphone.

### 3e critique (5 novembre 2026) : 29/40, puis ronde 3
- Fait : **typographie calmée** (Alfa Slab seulement pour h1/h2 d'affiche; cartes, étapes, événements, questions en Barlow Condensed droit en minuscules normales; pochoir seul accent; Rye plus utilisé; plus aucun italique) · **accueil d'hiver plus court** (porte « Le remisage, comment ça marche », carte « L'Expo, c'est en juillet » à la place de « Six jours » et de la mosaïque, pas de photo en double; l'été garde tout) · **fin du remisage** : merci à côté du billet avec récapitulatif et « Gardez ce numéro », bande « Ce qui arrive ensuite », tampon en encre transparente · **formulaires harmonisés** : « Envoi en cours… » partout (site.js), mini-billet sur la location, pluriel, focus après « Choisir cette salle », coordonnées gardées pour une nouvelle demande, numéro « Coordination (cell.) » · **validation** : nombres stricts (« 32'6 » refusé), message de maximum, erreur qui s'efface pendant la saisie, téléphone de 10 ou 11 chiffres · **horaire** : filtre « Autres », un filtre montre toute la semaine groupée par jour, intro au passé, fondu sur les filtres.
- Dette technique signalée : `theme-grange.css` empile 3 rondes de corrections sur les mêmes sélecteurs; à consolider en une passe (risque de régression).

### 4e critique (5 novembre 2026) : 29/40 (plafond), puis ronde finale ciblée
- Tendance : 26 → 27 → 29 → 29. Le plafond vient surtout du contenu manquant (délai de rappel, photos d'intérieur, capacités) : voir `A-CONFIRMER.md`.
- Fait : remerciement identique sur les deux formulaires (récapitulatif, « Pas de nouvelles d'ici quelques jours ? Appelez… », « Faire une autre demande » en simple lien) · erreur d'envoi au-dessus du bouton sur les 4 formulaires · **remisage.html connaît la saison** (même script que l'accueil : « Entrées en cours », « Encore de la place cet hiver ? ») · choix « Entrée souhaitée » (dès que possible / date précise) repris sur le billet · mini-billet en minuscules (plus de « π ») · filtres de l'horaire sur plusieurs rangées sur téléphone · onglets non sélectionnés en mode semaine · voile plus léger sur la photo d'hiver au téléphone · danse : « dates annoncées sur Facebook et au bureau » · « Venir à l'Expo » sur deux colonnes en hiver.
- Décision de Jérémy : arrêter les critiques ici (pas de 5e).

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

## 12 novembre 2026 : audit, lot 1 et conditions de location

- Audit complet du site et de l'admin : `PLAN-AMELIORATIONS.md` (30 points classés en 3 lots).
- Lot 1 réalisé (12 corrections rapides, admin et public) : détail dans `REPRISE.md`, section 2 d.
- Conditions de location de salle : proposition dans `docs/CONDITIONS-LOCATION-SALLE.md`, affichée sur la page Location, case à cocher avant le paiement.
- Photo vivante du Saloon (Higgsfield) sur la page Location.
- Taxes : mises de côté par Jérémy.
