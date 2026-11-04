---
target: site (accueil, remisage, location, programmation)
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
target_fingerprint: "sha256:7226c51c066bdb5e35546c2974074cfc4156d5e7370aa7f511c64407302266cc"
target_path: "C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
timestamp: 2026-11-04T19-12-06Z
slug: site-index-html
---
Method: dual-agent (A: design review · B: detector CLI + Puppeteer + CDP)
Pages : index, remisage, location, programmation (thème Grange & rodéo)

## Design Health Score : 26/40 (Acceptable, presque Bon)
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Billet vivant excellent, mais sous le bouton Envoyer sur téléphone |
| 2 | Langage du visiteur | 3 | « Infos pratiques » au lieu de Contact; « Louer la salle » vs « Deux salles » |
| 3 | Contrôle | 3 | Pause diaporama, conversion pieds/mètres, nouvelle demande |
| 4 | Cohérence | 2 | Deux systèmes visuels; promesses de prix contradictoires |
| 5 | Prévention des erreurs | 2 | Placeholders 28/8/11 qui semblent remplis; date de location sans min |
| 6 | Reconnaissance | 3 | Étapes numérotées, aide par champ |
| 7 | Efficacité | 2 | Téléphone partout, liens profonds vers les jours |
| 8 | Esthétique | 3 | Affiche forte, accueil long, titres tous au même volume |
| 9 | Récupération d'erreurs | 2 | Une seule erreur globale, loin du champ |
| 10 | Aide | 3 | Bon à savoir, Ce qui est compris |

## Verdict de spécificité
Authored pour l'Expo sur la vitrine; les écrans Operate (remisage, programmation, location) gardent l'ancien style plein été (coins 12 px, gris-bleu, italique, tampon vert). Logo 4 couleurs et moulinet qui volent l'attention. Lettrage western un peu Far West pour une foire laitière beauceronne.
Détecteur : survol de lien 3,0:1 (rouge vif sur moutarde, theme-grange.css:42); placeholders 4,49:1; avis-mesure carte imbriquée + side-tab; FAQ remisage ~106 caractères; hiérarchie plate à 390 px (1,23); marquee sans pause; stragglers. Faux positifs : ombres décalées, rayures, crème (voulus), 7,2 px « grange 3 », contenu caché (onglet en arrière-plan), onglets qui défilent.

## Priority Issues
- [P1] Formulaires et horaire dans l'ancien style → polish
- [P1] Promesse de prix contradictoire (estimation vs « tarif au téléphone »; « Aucun prix » au-dessus de 15 $) → clarify
- [P1] Mobile : billet et erreurs hors de vue; onglets Ven./Sam./Dim. cachés → adapt, harden
- [P2] Héros accueil : titre juillet vs bouton remisage; moulinet distrayant → distill
- [P2] Location : capacité, photo intérieure, délai, date min/rechange, colonne vide → clarify, layout

## Persona Red Flags
Jordan : dates 2026 lues comme actuelles, pas de mercredi expliqué, pas de « Contact ». Riley : date 2020 acceptée, 1 personne pour un mariage, une erreur à la fois. Casey : placeholders trompeurs, billet invisible, onglets coupés. Sam : « D'HIVER » en contour, erreur non liée au champ, 13 px dans le billet.

## Minor Observations
Filigrane tirsQC dans la mosaïque; encodage brisé des commentaires de remisage.css; préchargement d'une police italique inutile; « Show Lex Roses » à vérifier; citation de l'histoire trop terne.

## Questions
Lettrage Far West vs foire laitière? Le billet comme formulaire sur téléphone? Accueil de novembre deux fois plus court?
