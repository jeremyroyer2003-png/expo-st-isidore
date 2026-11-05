---
target: site (accueil, remisage, location, programmation)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
target_fingerprint: "sha256:d4d6844cbd86e0603b2d2e1be955faf407776bb0b3ffc0329d9e637020d0ac7a"
target_path: "C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
timestamp: 2026-11-05T11-53-05Z
slug: site-index-html
---
Method: dual-agent (A: design review, fresh · B: detector static + Puppeteer 1440/390)
Pages : index (hiver), remisage, location, programmation — après la ronde 2

## Design Health Score : 29/40 (Bon) — tendance 26 → 27 → 29
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité | 3 | Pas d'« Envoi en cours » sur la location |
| 2 | Langage | 4 | « Surface au sol » laisse croire à un prix au pied carré |
| 3 | Contrôle | 3 | Nouvelle demande efface les coordonnées |
| 4 | Cohérence | 2 | Deux formulaires divergents; 3 numéros sans étiquette |
| 5 | Prévention | 3 | « 32'6 » lu comme 32 |
| 6 | Reconnaissance | 3 | Billet miroir |
| 7 | Efficacité | 3 | Téléphone partout, flèches sur les jours |
| 8 | Esthétique | 2 | Tout en majuscules d'affiche; accueil répétitif |
| 9 | Récupération | 3 | 65 pi : mauvais message |
| 10 | Aide | 3 | Chauffage, accès, paiement absents |

## Verdict
Spécifique dans l'idée, bruyant dans l'exécution. 5 familles de polices empilées; Rye survit sur une étiquette.
Détecteur : réel = survol 3,0:1 (liens hors bouton sur moutarde), « grange 3 » 7,2 px (statique), flat-type-hierarchy remisage 390. Le reste = voulu.

## Priority Issues
- [P1] Fin du remisage peu rassurante (pas d'« ensuite », pas de récap, tampon qui couvre le texte sur téléphone) — clarify/harden
- [P1] Tout crie : Alfa pour h1/h2 seulement, un seul accent (pochoir), plus d'italique, stats du héros remisage réduites — typeset/quieter
- [P2] Accueil d'hiver répétitif et long — distill/layout
- [P2] Deux formulaires incohérents (mini-billet, envoi en cours, pluriel, coordonnées, numéros étiquetés) — harden
- [P3] Programmation : « Autres », filtre sur la semaine, fondu, intro au passé — clarify/adapt

## Questions
Accueil de novembre centré sur le remisage? Confirmation = billet tamponné avec référence? Formulaires plus calmes?
