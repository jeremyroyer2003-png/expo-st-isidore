# REPRISE : où on en est (à lire en premier)

> **Pour Claude, au début de la prochaine conversation** : lis ce fichier en entier, puis `PROGRESS.md` et `CLAUDE.md`. Le travail se fait sur la branche **`rebuild`**, pas sur `main`. Reprends à la section « Prochaine étape ».

Dernière mise à jour : 17 novembre 2026 (poste du travail). Le travail du 17 novembre est commité en local, **pas poussé** sur GitHub.
Tout est poussé sur GitHub (branche `rebuild`). Le dépôt est **privé** depuis le 12 novembre 2026.
Sur un autre ordinateur : `git pull origin rebuild`, puis remplir `web/.env.local` (il n'est pas dans GitHub).

---

## 1. L'état en une minute

- Le site statique (`site/`) est toujours en ligne sur Netlify (https://celebrated-sorbet-3dce34.netlify.app). Il vient de la branche `main` et **n'a pas changé**.
- Une **application Next.js complète** est construite dans `web/`, sur la branche `rebuild`. Elle comprend :
  - le site public ;
  - les réservations (salles, kiosques, danse, remisage) ;
  - les paiements Stripe en mode test ;
  - un back-office avec 3 rôles ;
  - des courriels simulés.
- Les 6 phases demandées sont faites, avec un commit par phase. Le tag Git `baseline` marque l'état d'avant.
- **Ce qui a été vérifié :**
  - le contrôle des types, le lint et le build passent;
  - les pages publiques et l'admin s'affichent sans débordement à 390 px;
  - les réservations, les paiements, les remboursements et l'annulation roulent contre la vraie base Supabase et contre Stripe en mode test (échantillon de 62 réservations, montants concordants au cent près : sections 2 b à 2 e).
- **Ce qui reste à essayer à la main :** la liste de la section 3 (surtout le kiosque extérieur avec le webhook Stripe, le rôle « lecteur », la médiathèque et l'affichage d'un prix confirmé).
- **Règle absolue :** aucun déploiement Netlify et aucune fusion dans `main` sans l'approbation explicite de Jérémy. Stripe reste en mode test.

## 1 b. Fait le 11 novembre 2026

- **Comptes branchés en local** : Supabase (schéma et données de départ exécutés), Stripe en mode test, super-admin créé. Le webhook Stripe n'est pas encore branché (il faut la CLI Stripe).
- **Stripe revu** : les remboursements et les factures ne peuvent plus partir en double, et une confirmation interrompue est reprise. Le flux facture, paiement et remboursement partiel a été vérifié contre Stripe en mode test.
- **Photos Facebook** :
  - 31 photos de la page de l'Expo sont importées **non publiées** dans Admin > Médiathèque ;
  - un éditeur les publie après avoir vérifié les droits (voir `A-CONFIRMER.md`) ;
  - les copies brutes sont dans le dépôt **privé** `expo-fb-photos` (branche `scrape-raw`) ;
  - script d'import : `web/scripts/importer-photos-fb.py`.
- **Accueil version 2** à http://localhost:3000/accueil-v2 (refait le 11 novembre en fin de journée, à la demande de Jérémy : il n'aimait pas le héros à défilement) :
  - héros **vidéo** : une vraie photo animée par IA (Higgsfield, Kling 3.0, clips de 5 s) joue en fond; deux lecteurs se relaient avec un fondu pour boucler. Hiver = survol de drone du site (photo aérienne agrandie en 4K par Higgsfield); été = tire de nuit (photo ELZEPHOTO). Le message de la saison est visible tout de suite, bouton « Arrêter la vidéo », photo fixe si « réduire les animations »;
  - sur téléphone, la vidéo devient un bandeau 3:2 (scène entière) et le texte passe dessous;
  - **pellicule** « L'Expo en images » sous le héros : 10 photos de la page Facebook qui défilent (pause au survol et bouton);
  - tester l'autre saison avec `?saison=ete` ou `?saison=hiver` dans l'adresse;
  - vidéos dans `web/public/videos/` (7 à 8 Mo chacune) : **à compresser** avant toute mise en ligne (il faut `ffmpeg`, absent du poste du travail);
  - Décision de Jérémy : la version 2 est gardée, c'est maintenant l'accueil `/` (voir 2 b).
- **Photos Facebook dans l'app** : 20 nouvelles photos dans `web/public/images/photos/` remplacent les doublons (accueil, programmation, exposants). Elles sont dans ce dépôt, que Jérémy a rendu **privé** le 12 novembre 2026 avant de pousser. ⚠ Ne pas le remettre public tant que les droits des photos ne sont pas confirmés (voir `A-CONFIRMER.md`).
- **Programmation : une photo par activité** (bingo = carte de bingo, feux = feux d'artifice, messe = la vraie messe sous le chapiteau, etc.), choisie par le titre dans `Programmation.tsx`; le bandeau de chaque jour montre son activité vedette. 11 photos libres de Wikimedia Commons comblent les trous, créditées au bas de la page et dans `docs/CREDITS-PHOTOS.md`.
- **À faire ensuite** : les tests de bout en bout de la section 3, puis le lot 2 de `PLAN-AMELIORATIONS.md`. Crédits Higgsfield restants : 110.
- **Serveur local** : il s'arrête quand la conversation se ferme. Le relancer dans `web/` avec `npm run dev`.

## 2. Mise en route sur un autre ordinateur

```bash
git clone https://github.com/jeremyroyer2003-png/expo-st-isidore.git
cd expo-st-isidore
git switch rebuild
cd web
npm install
cp .env.example .env.local
```

- Il faut Node.js 20 ou plus récent (`node --version`). La version LTS de nodejs.org convient.
- Le fichier `web/.env.local` **n'est pas dans GitHub**, et c'est voulu : il contient les clés secrètes. Il faut le remplir sur chaque ordinateur.

### Créer les comptes (une seule fois)

1. **Supabase**
   - Créer un projet gratuit sur supabase.com (région Canada si offerte).
   - Dans Project Settings > API, copier l'URL, la clé `anon` et la clé `service_role` dans `.env.local`.
   - Dans SQL Editor, exécuter `web/supabase/migrations/0001_schema.sql`, **puis** `web/supabase/seed.sql`.
2. **Stripe**
   - Créer un compte et rester en **mode test**.
   - Dans Développeurs > Clés API, copier la clé `sk_test_…` dans `STRIPE_SECRET_KEY`.
3. Garder `COURRIEL_FOURNISSEUR=console` et `AFFICHER_PRIX_FICTIFS=true`.
4. Créer le compte super-admin :
   ```bash
   npm run creer-admin -- ton@courriel.com "UnMotDePasseLong" super_admin "Jérémy Royer"
   ```
5. Lancer le site avec `npm run dev`, puis ouvrir http://localhost:3000 (site public) et http://localhost:3000/admin (administration).

> Ne jamais coller les clés dans une conversation avec Claude. Elles restent dans `.env.local`.

## 2 b. Échantillon de test (11 novembre 2026, en soirée)

- **Accueil** : la version 2 (héros vidéo + pellicule) est maintenant l'accueil `/`; `/accueil-v2` redirige vers `/`.
- **Échantillon** : 62 réservations et demandes de tous les types, créées par le vrai code de l'app (formulaires publics, actions admin, gabarits de courriels) avec de vrais paiements Stripe de **test**. Toutes les adresses sont en `@example.com`.
  - Salles : 8 confirmées, 2 annulées avec 50 $ de frais, 1 annulée sans frais, 2 abandonnées (retour de Stripe), 1 en cours de paiement.
  - Kiosques intérieurs : 5 payés (dont un à 700 $ et un à 425 $), 2 approuvés en attente de paiement, 2 en attente, 1 refusé, 1 payé puis annulé avec frais.
  - Kiosques extérieurs : 2 factures Stripe payées, 1 facture envoyée non payée, 1 entente notée, 1 en attente, 1 refusé.
  - Danse : 7 payées (session, mois, saison, 1 à 4 personnes), 1 abandonnée, 1 annulée sans frais.
  - Remisage : 5 dépôts payés (dont un en mètres), 2 approuvés non payés, 2 en attente, 2 refusés, 1 annulé avec 25 $ de frais; un dépôt sous le minimum est bien refusé.
  - 4 messages (2 traités). 160 courriels dans la boîte d'envoi.
- **Vérifié** (`npm run verifier-paiements`) : la base et Stripe concordent au cent près. Encaissé 16 190 $, remboursé 2 735 $, frais gardés 175 $, **net 13 455 $**, le même chiffre que le tableau de bord.
- **Commandes** (serveur `npm run dev` lancé, développement seulement) :
  - créer l'échantillon : `POST /api/dev/echantillon`, depuis une session admin (les étapes admin passent par la session);
  - l'effacer : `DELETE /api/dev/echantillon` (efface seulement les adresses `@example.com` et les avis admin envoyés pendant l'échantillon);
  - vérifier : `npm run verifier-paiements` dans `web/`.
- **Pas encore testé à la main** : la page Checkout de Stripe elle-même (carte 4242) et le retour sur `/paiement/merci`. Le générateur paie par l'API Stripe à la place. À faire dans le navigateur : une salle et une danse.

## 2 c. Annulation des salles (11 novembre 2026, en soirée)

- **Par le client** : le courriel de confirmation de salle a un bouton « Gérer ou annuler ma réservation » (lien signé, `/annuler/…`). La page montre le montant payé, les frais et le remboursement; le client confirme et tout se fait seul : remboursement Stripe moins les frais, date libérée, courriel au client, avis à l'admin. Possible jusqu'à 48 h avant (à confirmer, voir `A-CONFIRMER.md`).
- **Par l'admin** : « Annuler et rembourser » demande maintenant **qui annule**. Le client : frais retenus. L'Expo : remboursement complet, aucuns frais, courriel d'excuse.
- Code partagé : `web/src/lib/annulation.ts` (admin et client), liens signés : `web/src/lib/jeton.ts` (aucun changement à la base).
- **Testé** : annulation en ligne (1 150 $ remboursés sur 1 200 $, date libérée, 2 courriels), lien rouvert (« déjà annulée », pas de double remboursement), lien modifié refusé, annulation par l'Expo (frais ignorés, 600 $ remboursés au complet). Échantillon régénéré : 127 étapes sans échec.
- Le courriel de confirmation de la réservation de Jérémy (20 novembre, son Gmail) a été effacé par erreur par l'ancien nettoyage de l'échantillon (corrigé). La réservation elle-même est intacte.

## 2 d. Lot 1 du plan d'améliorations (12 novembre 2026)

Le plan complet est dans `PLAN-AMELIORATIONS.md` (30 points, 3 lots). Le **lot 1 est fait**, ainsi que les conditions de location.

- **Admin**
  - Sur téléphone, le menu est replié derrière un bouton « Menu ».
  - Pastilles dans le menu : nombre à traiter pour Kiosques, Remisage et Messages.
  - Tableau de bord : bloc « À faire maintenant » (nom, depuis quand, bouton), « Prochaines locations de salle », « Paiements qui tardent » (lien envoyé depuis 7 jours ou plus), nom du client dans les derniers paiements.
  - Kiosques et Remisage : boutons « Copier le lien » et « Renvoyer le courriel » pour le lien de paiement.
  - Boîte d'envoi : recherche par adresse ou sujet, filtre clients / bureau, aperçu chargé à l'ouverture.
- **Location de salle**
  - Bouton « Prochaine date libre » dans le calendrier; sur téléphone, la page défile jusqu'à l'étape suivante.
  - Nouvelle section « Conditions de location » et case à cocher obligatoire avant le paiement (vérifiée aussi par le serveur). Texte : `docs/CONDITIONS-LOCATION-SALLE.md`.
  - Les montants (ménage, dépassement, dépôt) sont dans Admin > Prix, cochés « À confirmer » : le public ne les voit pas tant que le comité ne les a pas validés. **Le dépôt de garantie n'est pas encore perçu par le site.**
  - La section « Annulation » décrit maintenant l'annulation en ligne; le délai et les frais sont rappelés sous le bouton de paiement.
  - « Photo vivante » du Saloon (vidéo Higgsfield, `web/public/videos/saloon-soir.mp4`, 5,4 Mo, chargée seulement quand elle arrive à l'écran). Composant : `web/src/components/site/PhotoVivante.tsx`.
- **Page de remerciement** : « Et ensuite? », « Ajouter à mon calendrier » (fichier .ics, lien signé, `/api/calendrier/…`), « Imprimer », lien d'annulation pour une salle.
- **Danse** : le champ du nombre de personnes ne revient plus à 1 pendant la saisie.
- **Stripe** : le reçu officiel de carte est demandé (`receipt_email`); Stripe ne l'envoie qu'en mode réel.
- **Vérifié** : types, lint et compilation sans erreur; réservation de salle testée jusqu'à la page Stripe (puis libérée); `npm run verifier-paiements` : même résultat qu'avant (un seul écart connu, le courriel effacé de la réservation de Jérémy).
- **Pas refait** : l'échantillon complet n'a pas été régénéré après ces changements.
- **Suite proposée** (lot 2) : recherche de client avec fiche, export CSV, plan du palais sur téléphone.

## 2 e. Carte blanche : ce qui fait vendre le site (12 novembre 2026)

- **Accueil** : le voile du héros est plus foncé (titre plus lisible) et, sur un écran d'ordinateur peu haut, le titre rapetisse pour que les boutons soient visibles sans défiler (`HerosVideo.css`).
- **Admin > Trouver un client** (`/admin/recherche`, aussi un champ en haut de chaque page) : recherche par nom, entreprise, courriel ou téléphone dans les salles, kiosques, remisage, danse et messages. Une fiche par client, avec le total payé en ligne et un lien vers ses courriels.
- **Export Excel** (`/admin/export/salles|kiosques|remisage|danse|paiements`) : fichier CSV au format français (point-virgule, virgule décimale). Bouton sur chaque liste et sur le tableau de bord. Vérifié : l'export des paiements donne encaissé 17 390 $, remboursé 2 735 $, frais 175 $, net 14 655 $, comme Stripe.
- **Plan du palais sur téléphone** : sous le plan, les emplacements libres se choisissent par numéro (gros boutons, dans l'ordre).
- **Admin sur téléphone** : plus aucun débordement horizontal (les cartes ne s'élargissent plus avec les tableaux).
- **Pour le comité** : `docs/PRESENTATION-COMITE.md` résume ce que le site fait pour les visiteurs et pour le bureau, ce qui a été vérifié et ce qu'il attend d'eux.
- **Vérifié** : types, lint et compilation sans erreur; recherche, exports et plan testés dans le navigateur à 390 px et sur ordinateur.

## 2 f. Mise en ligne d'essai sur Netlify (demandée par Jérémy le 12 novembre 2026)

- But : voir la nouvelle application sur Internet **sans remplacer** le site statique en ligne. On utilise un « branch deploy » de `rebuild`; `main` n'est pas touchée.
- Fait dans le dépôt : `netlify.toml` de la branche `rebuild` bâtit `web/` (base `web`, `npm run build`, Node 22).
- À faire par Jérémy dans Netlify (Claude ne saisit pas les clés) :
  1. ~~Activer les branch deploys pour `rebuild`~~ : fait le 12 novembre 2026 (la branche de production reste `main`).
  2. ~~Variables d'environnement~~ : entrées par Jérémy le 12 novembre 2026 (5 visibles, 2 secrètes : `SUPABASE_SERVICE_ROLE_KEY` et `STRIPE_SECRET_KEY`). Les `NEXT_PUBLIC_…` ne doivent **pas** être marquées secrètes, sinon le build échoue. Liste : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` (clé de **test**), `NEXT_PUBLIC_URL_SITE` (l'adresse du branch deploy), `COURRIEL_FOURNISSEUR=console`, `COURRIEL_ADMIN`. Ne pas définir `AFFICHER_PRIX_FICTIFS`.
  3. Pousser `rebuild`, puis suivre le build dans l'onglet Deploys.
- À savoir : en ligne, les prix « À confirmer » sont cachés (« Prix sur demande »), donc seuls la danse à la session et le dépôt de remisage se paient. La version en ligne utilise la même base de test que le poste local. Les photos Facebook deviennent visibles sur le Web.
- Adresse d'essai : https://rebuild--celebrated-sorbet-3dce34.netlify.app
- Le premier build publiait les fichiers bruts (404 partout) : corrigé en déclarant `@netlify/plugin-nextjs` dans `netlify.toml`. Depuis, les pages publiques répondent et l'ancien site n'a pas bougé.
- Après un changement de variable dans Netlify, il faut un nouveau build (un push ou « Trigger deploy ») : les `NEXT_PUBLIC_…` sont figées au build.

## 2 g. Lot 2 du plan d'améliorations (17 novembre 2026, en local)

Fait à la demande de Jérémy (« fais tout ce que tu es capable de faire, en local »). Points 15 et 17 à 22 de `PLAN-AMELIORATIONS.md`.

- **Fait le 17 novembre 2026 par Jérémy :** exécution de `web/supabase/migrations/0002_journal.sql` dans Supabase > SQL Editor (table de l'historique). Sur un nouveau projet Supabase, l'exécuter après 0001.
  - Elle crée la table de l'historique.
  - Sans elle, tout fonctionne quand même : l'historique reste vide, et la console du serveur affiche « [journal] non enregistré ».
- **20. « Ma demande »** (`/ma-demande/kiosque|remisage/<lien signé>`) :
  - Le client voit les étapes de sa demande (faite, en cours, à venir) et le bouton pour payer quand c'est le moment.
  - Si sa demande est refusée ou annulée, la page le lui dit.
  - Le lien est dans tous les courriels de kiosque et de remisage : réception, approbation, facture, paiement et rappel.
  - Aucune colonne n'a été ajoutée dans la base : le lien est signé comme celui de l'annulation (`web/src/lib/suivi.ts`).
  - Les demandes envoyées avant ce changement n'ont pas reçu le lien dans leur courriel. L'admin peut ouvrir leur page depuis la carte de la demande (Historique > « Voir la page Ma demande du client »).
- **15. Filtres des listes** (Salles, Kiosques, Remisage, Danse) :
  - Filtres par statut et par période, et tri.
  - Vues toutes prêtes, par exemple « Payées ce mois-ci » et « À payer depuis plus de 7 jours ».
  - Les filtres sont dans l'adresse de la page : on peut garder la vue en favori.
  - Code : `web/src/lib/filtres.ts` et `web/src/components/admin/Filtres.tsx`.
- **17. Calendrier admin** : la grille du mois montre les créneaux de chaque jour en couleur, et les dates verrouillées sont hachurées. Un clic sur un jour montre ses créneaux en dessous et règle les formulaires « Ajouter » et « Verrouiller » sur cette date.
- **18. Relance** :
  - Un bouton « Envoyer un rappel » est sur le tableau de bord (bloc « Paiements qui tardent ») et sous chaque lien de paiement.
  - Le rappel est un courriel distinct, avec le lien de paiement et le lien « Ma demande ».
  - Le tableau de bord affiche la date du dernier rappel.
- **19. Historique** : chaque réservation et demande a un bloc « Historique », qui dit qui a fait quoi et quand.
  - Côté admin : approuvée, refusée, entente, facture, lien renvoyé, rappel, annulation et remboursement.
  - Côté client : paiement reçu par Stripe, annulation en ligne.
  - Le journal ne peut pas être modifié ni effacé. Code : `web/src/lib/journal.ts`.
- **21. Programmation pendant l'Expo** :
  - L'onglet du jour s'ouvre de lui-même.
  - Un bloc « En ce moment / Plus tard aujourd'hui » s'affiche.
  - Un bouton « Ajouter à mon calendrier » (fichier .ics) apparaît sur chaque activité à venir.
  - Pour l'essayer hors saison : `/programmation?simuler=2026-07-16T19:30`.
- **22. Référencement** :
  - `/sitemap.xml` et `/robots.txt` sont en place.
  - Données structurées pour Google : l'organisme (adresse, téléphones, Facebook) et l'Expo de l'année (seulement quand ses dates sont connues et à venir).
  - **Le site demande aux moteurs de ne pas l'indexer** (maquette et site d'essai). Pour le vrai site seulement, ajouter `PERMETTRE_INDEXATION=true` dans Netlify.
- **Pas fait :**
  - **23 (vidéos)** : `ffmpeg` est absent du poste du travail.
  - **31 (remisage par grange)** : il faut la liste de l'an dernier.
- **Vérifié :**
  - le contrôle des types, le lint et le build;
  - « Ma demande » pour les 15 combinaisons de type et de statut de l'échantillon (étapes, bouton payer, lien modifié refusé);
  - les filtres du remisage dans le navigateur;
  - la grille du calendrier et le choix d'un jour;
  - un rappel envoyé (courriel simulé à une adresse `@example.com`);
  - le bloc « En ce moment » avec `?simuler`;
  - robots.txt, sitemap.xml et les données structurées de l'accueil.
- **Pas vérifié :**
  - l'affichage à 390 px des nouveaux écrans admin (la fenêtre Chrome ne se réduisait pas);
  - l'historique rempli (la migration 0002 n'est pas encore exécutée).
- **Piège rencontré :** lancer `npm run build` pendant que `npm run dev` tourne fait recharger les pages en boucle dans le navigateur. Il faut arrêter le serveur de dev, puis le relancer.

## 3. Prochaine étape : tester chaque flux de bout en bout

Pour chaque flux, noter ce qui casse, puis corriger avec Claude. Carte de test Stripe : `4242 4242 4242 4242`, une date future et n'importe quel CVC.

- [ ] **Site public**
  - Accueil, programmation (vient de la base), photos (vient de la médiathèque).
  - Formulaires Contact et Exposants : le message apparaît dans Admin > Messages et dans la Boîte d'envoi.
- [ ] **Salle** (`/location`)
  - Choisir une date en jaune, un créneau, remplir le formulaire, payer.
  - Résultat attendu : page « Votre salle est réservée », créneau « Réservé » dans Admin > Calendrier, 2 courriels dans la Boîte d'envoi.
  - Abandonner un paiement (bouton retour de Stripe) : la date doit redevenir libre.
- [ ] **Kiosque intérieur** (`/kiosques`)
  - Choisir un emplacement sur le plan et envoyer la demande.
  - Dans Admin > Kiosques, cliquer sur Approuver. Ouvrir le lien `/payer/…` de la Boîte d'envoi et payer.
  - Résultat attendu : demande « Confirmée », emplacement hachuré sur le plan public.
- [ ] **Kiosque extérieur**
  - Envoyer la demande, puis dans l'admin : Noter l'entente, puis Envoyer la facture.
  - Payer la facture Stripe. Sans webhook, le statut ne se met pas à jour tout seul (voir section 5).
- [ ] **Danse** (`/danse`) : choisir un forfait, indiquer le nombre de personnes, payer. Résultat attendu : inscription « Payée » dans Admin > Danse.
- [ ] **Remisage** (`/remisage`)
  - Envoyer les dimensions.
  - Dans Admin > Remisage, cliquer sur Approuver ; le dépôt doit être d'au moins 100 $.
  - Payer le dépôt par le lien. Résultat attendu : « Dépôt payé ».
- [ ] **Annulation et remboursement** : sur une réservation payée, cliquer sur « Annuler et rembourser » avec des frais. Vérifier dans Stripe que le remboursement partiel est là, et que la date ou l'emplacement est libéré.
- [ ] **Rôles**
  - Créer un compte « lecteur » dans Admin > Utilisateurs et se connecter avec.
  - Résultat attendu : aucun bouton de modification, et la base refuse toute écriture.
- [ ] **Médiathèque** : téléverser une photo et vérifier qu'elle apparaît sur `/photos`.
- [ ] **Prix** : décocher « À confirmer » sur un prix et vérifier qu'il s'affiche au public.

## 4. Où trouver quoi

| Besoin | Fichier |
|---|---|
| Installation, variables, schéma, sécurité, Stripe, déploiement | `docs/DEVELOPPEUR.md` |
| Mode d'emploi de l'admin pour le comité | `docs/GUIDE-PERSONNEL.md` |
| Infos manquantes du comité (prix fictifs, plan officiel, Loi 25…) | `A-CONFIRMER.md` |
| Historique complet du projet | `PROGRESS.md` |
| Règles de design et de contenu | `CLAUDE.md` |
| Schéma de la base + RLS | `web/supabase/migrations/0001_schema.sql` |
| Données de départ | `web/supabase/seed.sql` |
| Actions publiques (réserver, demander) | `web/src/actions/reservations.ts`, `messages.ts`, `paiement.ts` |
| Actions admin | `web/src/actions/admin/` |
| Confirmation des paiements (idempotente) | `web/src/lib/paiements.ts` |
| Gabarits de courriels | `web/src/lib/courriel/gabarits.ts` |
| Pages reprises du site statique | `web/src/contenu-statique/` |

## 5. Points à surveiller pendant les tests

- **Webhook Stripe :** sans lui, un paiement Checkout est quand même confirmé au retour sur `/paiement/merci`. Par contre, la **facture du kiosque extérieur** et l'**expiration d'une session abandonnée** dépendent du webhook. Pour les tester :
  1. installer la CLI Stripe ;
  2. lancer `stripe listen --forward-to localhost:3000/api/stripe/webhook` ;
  3. copier le secret `whsec_…` dans `STRIPE_WEBHOOK_SECRET`.
- **Requêtes Supabase non typées :** le contrôle des types ne vérifie pas les noms de colonnes. Une faute de nom ne se verra qu'à l'exécution, alors lire les erreurs du terminal.
- **Fuseau horaire :** les créneaux sont calculés en heure du Québec (`America/Toronto`). Vérifier qu'un créneau ajouté à « 17:00 » s'affiche bien à 17 h.
- **Version de l'API Stripe :** le SDK `stripe` v23 utilise sa version par défaut. Les factures (`invoicePayments`, `invoiceItems.amount`) sont l'endroit le plus probable d'une incompatibilité.
- **Poste du travail seulement :** l'antivirus Acronis peut annuler des modifications en lot. Sur ce poste, faire un commit avant toute opération en lot. Sur le PC personnel, ce n'est pas un problème.

## 6. Décisions déjà prises (ne pas les redemander)

- Base Supabase : projet gratuit en ligne, pas Docker.
- Prix inconnus : valeurs fictives marquées « à confirmer ». Le public voit « Prix sur demande » ; les prix fictifs sont visibles seulement en développement.
- Photos Facebook : Jérémy les télécharge lui-même, puis les ajoute dans la Médiathèque. Les droits sont à confirmer.
- Éditeurs : ils peuvent aussi approuver les demandes et rembourser. Le super-admin gère en plus les comptes.
- Dépôt minimum de 100 $ : seulement pour le remisage. La danse n'a pas de frais d'annulation par défaut.
- Courriel obligatoire au remisage : il sert à envoyer le lien de dépôt.
- Plan du palais : celui du comité de 2017 (51 emplacements), transcrit depuis la page Facebook. Les dimensions restent à confirmer.
- Année de fondation : 1982 (« depuis 1982 »). La ligne du temps garde les lettres patentes et la 1re édition en 1983.
- Dépendances ajoutées : `@supabase/supabase-js`, `@supabase/ssr` et `stripe`. Signaler à Jérémy toute autre dépendance avant de l'ajouter.

## 7. Après les tests (à décider avec Jérémy)

1. Corriger les bogues trouvés, avec un commit par correction.
2. Remplacer les prix fictifs et le plan quand le comité répond (`A-CONFIRMER.md`).
3. Faire une passe Lighthouse et vérifier l'accessibilité sur les nouvelles pages (calendrier, plan, admin).
4. Seulement avec l'approbation de Jérémy :
   - fusionner `rebuild` dans `main` ;
   - adapter `netlify.toml` pour bâtir `web/` ;
   - créer les comptes de production ;
   - faire l'évaluation exigée par la Loi 25.

## 25 novembre 2026 : `rebuild` fusionnée dans `main` (demande de Jérémy)

- `main` = `rebuild` (fusion directe, commit 92cec18). Le site de production Netlify (celebrated-sorbet-3dce34.netlify.app) bâtit maintenant l'application Next.js de `web/` (netlify.toml de `rebuild`). L'ancien site statique reste dans `site/` et au tag `baseline`.
- Vérifier dans Netlify que les variables d'environnement s'appliquent aussi au contexte **Production** (pas seulement aux branches) et que `NEXT_PUBLIC_URL_SITE` pointe vers l'adresse de production.
- Stripe toujours en mode test; indexation toujours désactivée (PERMETTRE_INDEXATION).
- Désormais : travailler sur `rebuild`, puis pousser `rebuild` et `main` ensemble quand Jérémy le demande.
