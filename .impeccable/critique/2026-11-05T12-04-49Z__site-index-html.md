---
target: site (accueil, remisage, location, programmation)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
target_fingerprint: "sha256:e0e584a8ef1339a638453071372d922ff7c4a7e05625b8818ea5cd1d1aecb8f7"
target_path: "C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\site\\index.html"
timestamp: 2026-11-05T12-04-49Z
slug: site-index-html
---
Method: dual-agent (A: design review, fresh · B: detector static + Puppeteer 1440/390)
Pages : index (hiver), remisage, location, programmation — après la ronde 3

## Design Health Score : 29/40 (Bon) — tendance 26 → 27 → 29 → 29
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité | 3 | Onglet de jour à moitié sélectionné en mode semaine |
| 2 | Langage | 3 | « Espace au sol », « entre la sortie et la rentrée des roulottes » |
| 3 | Contrôle | 3 | Pas de correction après envoi; choisir un jour efface le filtre |
| 4 | Cohérence | 2 | Erreur placée différemment; récap seulement au remisage; 2 couleurs de sélection |
| 5 | Prévention | 3 | Maximums + téléphone, date de rechange contrôlée |
| 6 | Reconnaissance | 3 | Aide par véhicule |
| 7 | Efficacité | 3 | Téléphone à côté de chaque bouton |
| 8 | Esthétique | 3 | Répétitions de l'accueil d'hiver, cadres uniformes |
| 9 | Récupération | 3 | Erreur à deux lignes du champ sur téléphone |
| 10 | Aide | 3 | Bon à savoir |

## Priority Issues
- [P1] Fin des formulaires incohérente, sans « quand » — clarify/harden
- [P1] Remisage ne sait pas qu'on est en novembre (Entrée mi-octobre) — clarify
- [P2] Programmation : onglets et filtres en conflit — layout/distill
- [P2] Accueil d'hiver : 3 CTA identiques, danse pour initiés, moitié vide dans Venir, voile trop opaque — distill/layout
- [P3] Cadrage uniforme, cartes d'années arc-en-ciel, titres-phrases en Alfa — quieter/typeset

## Détecteur
Réel : flat-type-hierarchy remisage 390 (1,13). Le reste = voulu ou artefact statique.

## Questions
Billet rempli comme preuve dans le héros? Novembre = remisage seulement? Archive par activité?
