# REPRISE : où on en est (à lire en premier)

> **Pour Claude, au début de la prochaine conversation** : lis ce fichier en entier, puis `PROGRESS.md` et `CLAUDE.md`. Le travail se fait sur la branche **`rebuild`**, pas sur `main`. Reprends à la section « Prochaine étape ».

Dernière mise à jour : 11 novembre 2026 (poste du travail).
La prochaine séance aura lieu sur le **PC personnel de Jérémy**, où Node.js est disponible.

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
- **Ce qui a été vérifié :** le contrôle des types, le lint et le build passent, et les pages publiques s'affichent correctement à 1440 px et à 390 px.
- **Ce qui n'a jamais été testé :** rien n'a roulé contre une vraie base Supabase ni contre Stripe, parce que les comptes n'existent pas encore. Les réservations, les paiements et l'admin sont écrits, pas essayés. Il faut s'attendre à quelques bogues.
- **Règle absolue :** aucun déploiement Netlify et aucune fusion dans `main` sans l'approbation explicite de Jérémy. Stripe reste en mode test.

## 1 b. Fait le 11 novembre 2026

- **Comptes branchés en local** : Supabase (schéma et données de départ exécutés), Stripe en mode test, super-admin créé. Le webhook Stripe n'est pas encore branché (il faut la CLI Stripe).
- **Stripe revu** : les remboursements et les factures ne peuvent plus partir en double, et une confirmation interrompue est reprise. Le flux facture, paiement et remboursement partiel a été vérifié contre Stripe en mode test.
- **Photos Facebook** :
  - 31 photos de la page de l'Expo sont importées **non publiées** dans Admin > Médiathèque ;
  - un éditeur les publie après avoir vérifié les droits (voir `A-CONFIRMER.md`) ;
  - les copies brutes sont dans le dépôt **privé** `expo-fb-photos` (branche `scrape-raw`), jamais dans ce dépôt public ;
  - script d'import : `web/scripts/importer-photos-fb.py`.
- **Accueil version 2** à http://localhost:3000/accueil-v2 (refait le 11 novembre en fin de journée, à la demande de Jérémy : il n'aimait pas le héros à défilement) :
  - héros **vidéo** : une vraie photo animée par IA (Higgsfield, Kling 3.0, clips de 5 s) joue en fond; deux lecteurs se relaient avec un fondu pour boucler. Hiver = survol de drone du site (photo aérienne agrandie en 4K par Higgsfield); été = tire de nuit (photo ELZEPHOTO). Le message de la saison est visible tout de suite, bouton « Arrêter la vidéo », photo fixe si « réduire les animations »;
  - sur téléphone, la vidéo devient un bandeau 3:2 (scène entière) et le texte passe dessous;
  - **pellicule** « L'Expo en images » sous le héros : 10 photos de la page Facebook qui défilent (pause au survol et bouton);
  - tester l'autre saison avec `?saison=ete` ou `?saison=hiver` dans l'adresse;
  - vidéos dans `web/public/videos/` (7 à 8 Mo chacune) : **à compresser** avant toute mise en ligne (il faut `ffmpeg`, absent du poste du travail);
  - **Jérémy compare `/` et `/accueil-v2`, puis décide**.
- **Photos Facebook dans l'app** : 20 nouvelles photos dans `web/public/images/photos/` remplacent les doublons (accueil, programmation, exposants). ⚠ Elles sont maintenant dans ce dépôt **public** : ne pas pousser sur GitHub avant que Jérémy décide (droits à confirmer, voir `A-CONFIRMER.md`).
- **Programmation : une photo par activité** (bingo = carte de bingo, feux = feux d'artifice, messe = la vraie messe sous le chapiteau, etc.), choisie par le titre dans `Programmation.tsx`; le bandeau de chaque jour montre son activité vedette. 11 photos libres de Wikimedia Commons comblent les trous, créditées au bas de la page et dans `docs/CREDITS-PHOTOS.md`.
- **À faire ensuite** :
  - Ajustements du héros vidéo selon les commentaires de Jérémy (crédits Higgsfield restants : 120).
  - Puis les tests de bout en bout de la section 3.
- **Serveur local** : il s'arrête quand la conversation se ferme. Le relancer dans `web/` avec `npm run dev`.

## 2. Ce soir sur le PC personnel : mise en route

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
