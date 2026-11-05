---
target: site (accueil, remisage, location, programmation)
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
target_fingerprint: "sha256:81431bb409deafb0367fe90e971b408057e674b819798f9fa0b42fbd044beb36"
target_path: "C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
timestamp: 2026-11-05T11-39-48Z
slug: site-index-html
---
Method: dual-agent (A: design review, fresh · B: detector CLI + Puppeteer 1440/390)
Pages : index, remisage, location, programmation (Grange & rodéo, après la 1re ronde de corrections)

## Design Health Score : 27/40 (Bon, bas de la fourchette) — 1re critique : 26/40
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité | 3 | Mini-billet « Prêt à envoyer » malgré téléphone invalide; « Admis » = réservé? |
| 2 | Langage | 3 | Heures coupées sur téléphone (10 h / 30) |
| 3 | Contrôle | 3 | Pas de « nouvelle demande » sur la location |
| 4 | Cohérence | 2 | Cartes radio à cases carrées; catégories accueil ≠ filtres; Rye/Alfa voisins |
| 5 | Prévention | 3 | Dates sans passé, limites par véhicule |
| 6 | Reconnaissance | 3 | Salle non sélectionnable depuis sa carte |
| 7 | Efficacité | 2 | Rien pour les clients du remisage qui reviennent |
| 8 | Esthétique | 3 | 11 contrôles avant le 1er événement de la programmation |
| 9 | Récupération | 2 | Soumission vide : focus sur Roulotte qui semble choisie, message hors écran |
| 10 | Aide | 3 | Bon à savoir, aide par mesure |

## Priority Issues
- [P1] Héros d'hiver sur diaporama d'été → image fixe (aérienne / intérieur), ligne retardataires — adapt/clarify
- [P1] Faux signaux du remisage : « Prêt » trop tôt, « Admis », erreur hors écran, ex. 28 partout — harden
- [P2] Cartes radio en cases carrées; 6 cartes empilées sur téléphone — polish/layout
- [P2] Taxonomie et rôles typographiques incohérents; espaces insécables — typeset
- [P2] Location de seconde classe : cartes de salle non sélectionnables, pas de billet — shape/delight
- [P3] Programmation surchargée hors saison — distill

## Détecteur
Réel : flat-type-hierarchy à 390 (index, remisage), line-length ~89 car. (FAQ remisage), em-dash-overuse (remisage). Le reste = voulu (crème, ombres, planches, bandeau) ou faux positif (7,2 px « grange 3 », tight-leading sur titres).

## Questions
Photo intérieure du remisage? Location = cartes de salles? Raison de revenir avant le printemps?
