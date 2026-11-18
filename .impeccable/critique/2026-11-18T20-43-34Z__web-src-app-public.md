---
target: pages publiques de l app web
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\jeremy.royer\\Downloads\\expo-st-isidore\\expo-st-isidore\\web\\src\\app\\(public)"
timestamp: 2026-11-18T20-43-34Z
slug: web-src-app-public
---
Method: dual-agent (A: design review · B: detector CLI + URL scan + browser overlay)
Pages : accueil (hiver), remisage, location, kiosques, danse, réserver, programmation, histoire, contact, exposants, tire

## Design Health Score : 29/40 (Bon)
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité | 3 | Saut au retrait de « Prochaine date libre »; étapes 1-2 absentes à /location |
| 2 | Langage | 3 | créneau, grange 2/3, Nos ExpoStar |
| 3 | Contrôle | 3 | Danse : session/mois payés sans date |
| 4 | Cohérence | 2 | Étape 3 orpheline; numéro d'emplacement dans le cercle d'étape; deux récits de la suite du remisage; 20 $ codé en dur |
| 5 | Prévention | 3 | Danse payée à l'aveugle |
| 6 | Reconnaissance | 3 | Dates de danse sur Facebook |
| 7 | Efficacité | 3 | — |
| 8 | Esthétique | 3 | Titres coupés en plein mot (/exposants, 1440); contraste 1,8:1 bande /location |
| 9 | Récupération | 3 | « Vérifiez le courriel » sur champ vide; exemples en gras en erreur |
| 10 | Aide | 3 | Taxes non mentionnées |

## Priority Issues
- [P1] Danse payable sans date ni mois — clarify/harden
- [P1] overflow-wrap:anywhere coupe les titres (pages.css:39); p.note 1,8:1 dans .ensuite--bande — typeset/audit
- [P2] Deux récits de la suite du remisage; numérotation d'étapes incohérente (location, kiosques) — clarify/layout
- [P2] Mobile : CTA du héros sous le pli; jours du calendrier 40 px; pied de page 36 px — adapt
- [P3] Taxes, libellé pendant la redirection Stripe, légende « Non offert », ordre saisonnier de /reserver — polish

## Détecteur
CLI source : 0 (regex seulement). URL : low-contrast accueil (#8e2a1e sur #d9a441, 3,7:1) et /location (1,8:1); skipped-heading h2→h4 (Programmation.tsx); flat-type-hierarchy /remisage 390. hard-offset-shadow, cream-palette, stripes, marquee = traits voulus.
