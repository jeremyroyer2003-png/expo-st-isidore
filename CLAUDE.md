# Projet : refonte du site de l'Expo St-Isidore / Bassin de la Chaudière

Ce fichier est lu automatiquement par Claude Code. Il résume tout ce qui a été décidé avant le début de la programmation.

> **Reprise de session** : lire `PROGRESS.md` en premier, il dit où le travail est rendu. À la fin de chaque étape, mettre `PROGRESS.md` à jour et faire un commit Git, pour qu'aucune session perdue ne fasse perdre le fil.

## Contexte

- Exercice de refonte réalisé par Jérémy dans le cadre d'une formation en création de sites Web.
- Site actuel : https://expobassinchaudiere.com (WordPress, Madison Solutions Web). Barre latérale qui gaspille l'écran, texte minuscule, contenu périmé (pages 2024 encore en ligne), page Tire de tracteurs brisée.
- Expo agricole gratuite à Saint-Isidore (Beauce), 132, route Coulombe, G0S 2S0. 44e édition du 14 au 19 juillet 2026. Prochaine : juillet 2027, dates à confirmer.
- On est hors saison (novembre) : l'accueil dit « Merci pour 2026, on se revoit en juillet 2027 ». Le remisage d'hiver est mis en avant.
- Tout reste une **maquette de démonstration** tant que le comité de l'Expo n'a pas dit oui. Garder la mention « Maquette de démonstration » dans le pied de page.

## Langue et lois

- Site en **français** (Loi 96). L'anglais pourra s'ajouter plus tard, jamais à la place du français.
- `<html lang="fr">`, titre de page et description en français.
- **Loi 25** : tout formulaire qui recueille des renseignements personnels a une case de consentement et un lien vers une politique de confidentialité. Pas de Google Analytics sans bannière de consentement.

## Direction visuelle retenue : « affiche de foire agricole »

La référence est `maquettes/accueil-v2.html`. Ouvre-la dans un navigateur avant de coder.

- **Couleurs** (tirées du logo) :
  - Marine foncé `#1B2E3D`, marine `#263F53` (fond du logo), presque noir `#15202A` / `#0E1820`
  - Orange `#EE7A22`, jaune `#FDB913`, vert `#7DBB42`, bleu `#19A7E0` (les 4 pales du moulinet)
  - Papier `#F2EFE8` et `#E8E1D2` pour les sections claires
  - Texte gris sur clair `#3E4C58` ; liens `#1B6FA8`
- **Typo** : Barlow Condensed (titres, italique 800-900, majuscules) + Barlow (texte). Fichiers dans `maquettes/fonts/`. En production, héberger les polices localement (pas de Google Fonts, pour la Loi 25 et la vitesse).
- **Motifs signature** :
  - ~~Le moulinet du logo qui tourne dans le héros~~ : en attente du SVG officiel (voir retours plus bas). Le bandeau défilant utilise un simple point comme séparateur.
  - Photos présentées comme des tirages imprimés penchés, avec légende.
  - Billet « Entrée gratuite | depuis 1983 » avec ligne perforée.
  - Bandeau orange défilant des activités.
  - Rubans de champion (rosettes) pour les grandes dates.
  - Photo d'archive en sépia avec ruban adhésif.
  - Page encadrée dans un conteneur aux coins arrondis.
- Toutes les animations s'arrêtent avec `prefers-reduced-motion: reduce`.
- À éviter : dégradés violets, police Inter, trois cartes identiques, émojis comme icônes.
- **Retours de Jérémy (novembre 2026)** :
  - Pas d'illustrations ni d'icônes dessinées en code (véhicules, bâtiment, schémas) : jugées laides. Préférer la typographie d'affiche et de vraies photos.
  - Pas d'images floues ou basse résolution agrandies : mieux vaut aucune image.
  - Le moulinet dessiné ne ressemble pas à celui du logo (pales de papier plié) : retiré partout. Le remettre seulement à partir du fichier vectoriel officiel (SVG) du logo, à demander au comité.
  - Les mesures doivent offrir le choix pieds / mètres.

## Pages à construire, dans cet ordre

1. **Accueil** : reproduire `maquettes/accueil-v2.html`.
2. **Remisage d'hiver** : contenu de `maquettes/remisage.html`, mais restylé dans la direction v2.
3. **Notre histoire** : fondation, ligne du temps, bâtisseurs, activités disparues (voir `recherche/recherche-expo.md`).
4. **Programmation** : onglets par jour, filtres (Spectacles, Animaux, Famille, Tire), heure, lieu, prix.
5. **Tire de tracteurs** : dates, prix, bouton billets, classes, galerie des pilotes.
6. **Exposants** : pourquoi exposer, documents à jour, inscription.
7. **Photos** et **Contact** (téléphones cliquables, courriel visible, carte, formulaire).

Construire **une page à la fois**, la faire valider, puis passer à la suivante.

## État (3 novembre 2026)

- Toutes les pages existent dans `site/` : `index`, `remisage`, `histoire`, `programmation`, `tire-de-tracteurs`, `exposants`, `photos`, `contact`, `confidentialite`. HTML simple, sans étape de compilation.
- CSS : `site.css` (commun), `composants.css` (héros texte, formulaires, « Bon à savoir »), `pages.css` (pages intérieures), `remisage.css`. JS : `site.js` (menu + formulaires simples), `remisage.js`, `programmation.js` (onglets et filtres), `photos.js` (visionneuse).
- L'en-tête et le pied de page sont copiés dans chaque page : une modification du menu se fait dans les 9 fichiers.
- Photos : `site/images/photos/` (versions 1600 px et `-800`), tirées du site actuel (ELZEPHOTO, tirsQC.com). Originaux dans `images-sources/site-actuel/`. Droits à obtenir. Certaines photos de tire viennent d'autres événements ASTTQ (ex. Racicot : Grand National de St-Hyacinthe 2018), c'est indiqué dans les légendes.
- Programmation : celle de 2026 est affichée comme archive en attendant 2027.
- Politique de confidentialité : modèle à faire valider (responsable, durée de conservation, hébergement Netlify hors Québec).

## Passe de nettoyage et de restructuration (3 novembre 2026)

- Skills installés dans `.claude/skills/` : `ce-simplify-code` (EveryInc, 4 agents de nettoyage) et `frontend-design` (Anthropic). Revue faite par 6 agents : réutilisation, qualité, efficacité, commentaires, direction artistique, vérification des faits.
- Menu : Programmation · Tire de tracteurs · Exposants · Photos · Notre histoire · Infos pratiques (`contact.html`, avec `#visiter`) · Remisage d'hiver.
- Tout ce qui manque est listé dans `A-CONFIRMER.md` (racine). Plus de « Note pour le comité » visible sur les pages publiques.
- Règles de style : mot en couleur seulement dans les titres h1 (et sur l'accueil, qui suit la maquette); h2 en une seule couleur. Pas de numéros 01, 02… sauf pour une vraie suite (ordre de passage, étapes).
- Classes neutres réutilisables : `heros__grille--texte`, `entete-section`, `liste-questions` (`--grille`, version foncée automatique dans `.section-nuit`), `formulaire--etroit`, `espace-haut`, `espace-bas`, `sans-coupure`. Aucun `style=""` dans le HTML.
- JS : `site.js` expose `Expo` (validation du téléphone, envoi Netlify), réutilisé par `remisage.js`. `site.js` est chargé en `defer`; la classe `js` est ajoutée par un petit script en ligne dans le `<head>`.
- Photos : versions `-400` (vignettes de galerie, avec srcset), `-800` et 1600 px (visionneuse seulement). Photos d'enfants reconnaissables retirées (petit train, place de la famille).
- Ne pas réaffirmer : « milliers de visiteurs », « 20 minutes de Québec » (aucune source).

## Remisage d'hiver : faits confirmés

- Remisage **intérieur** dans les bâtiments de l'Expo, assuré, plus de 20 ans d'expérience.
- Accepte : roulottes, VR, autos, pick-ups, bateaux, motos et Spyder.
- Entrée vers la **mi-octobre**, sortie vers la **mi-mai**.
- Réservation : 418 882-9619.
- **Aucun compteur de places restantes.** L'espace dépend de la taille de chaque véhicule.
- Formulaire : nom, téléphone, courriel, type de véhicule, marque et modèle (facultatif), **longueur, largeur, hauteur en pieds**, commentaires, case de consentement. Schéma qui montre comment mesurer une roulotte.
- Après l'envoi : message de confirmation (« On regarde l'espace disponible et on vous rappelle »).
- Prix : **facturé selon la longueur** (confirmé par Jérémy). Le tarif au pied s'inscrit à un seul endroit : l'attribut `data-prix-par-pied` du formulaire dans `site/remisage.html`. Vide = « [Tarif à confirmer] ». Le billet affiche une estimation.
- Règle proposée, à faire valider : chaque véhicule est mesuré à l'arrivée et le prix final se base sur cette mesure (des clients donnent une mauvaise longueur).
- À confirmer : accès au véhicule pendant l'hiver, conseils de préparation, dates exactes.

## Coordonnées

- Bureau : 418 882-5649 · Cellulaire : 418 386-0484 · Remisage : 418 882-9619
- info@expobassinchaudiere.com
- Facebook : https://www.facebook.com/expostisidorebassinchaudiere/

## Contenu et images

- Faits historiques, bâtisseurs, activités disparues, sources : `recherche/recherche-expo.md` et le PDF du Beauce Média de 2010.
- Ne rien inventer : un fait manquant devient un repère entre crochets, comme `[Dates 2027 à confirmer]`.
- Images de la maquette : `maquettes/images/`. Elles viennent de captures de l'ancien site et du journal (basse résolution, droits à obtenir). Les vraies photos arriveront plus tard : prévoir des emplacements faciles à remplacer.
- Pas de photos d'enfants identifiables.
- Logo : `maquettes/images/logo.png` (lettres noires sur fond marine). Une version blanche ou SVG serait idéale.

## Technique suggérée

- Site statique simple : HTML + CSS (ou Astro si on veut des gabarits partagés pour l'en-tête et le pied de page).
- Hébergement gratuit : Netlify ou Cloudflare Pages. Formulaire de remisage via Netlify Forms ou Formspree.
- Mobile d'abord : tout doit fonctionner à 390 px de large, menu hamburger sur téléphone.
- Accessibilité : vrais `<button>`, `<a>`, `<label>` ; contraste 4,5:1 ; cibles tactiles de 44 px minimum ; `alt` sur toutes les images.

## Vérification avant de dire qu'une page est finie

- Captures sur ordinateur (1440 px) et sur téléphone (390 px), aucun débordement horizontal.
- Score Lighthouse (performance, accessibilité, SEO).
- Liens et téléphones cliquables, formulaire testé.
- Titre et description de page en place.
- Texte relu : aucune faute, aucun jargon.
