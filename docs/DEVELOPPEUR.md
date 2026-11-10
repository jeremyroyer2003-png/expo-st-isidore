# Guide du développeur : application Expo St-Isidore (`web/`)

Application Next.js qui remplace le site statique `site/`. Le site statique reste dans le dépôt comme version de repli (tag Git `baseline`).

> **Rien n'est déployé tant que le comité n'a pas approuvé la version finale.** Tout roule en local, Stripe est en mode test, et les courriels sont simulés.

## 1. Pile technique

| Élément | Rôle |
|---|---|
| Next.js 16 (App Router) + TypeScript | Pages, actions serveur, webhook |
| Tailwind CSS 4 | Nouveaux composants (calendrier, plan, admin). Les pages reprises du site statique gardent leurs feuilles CSS d'origine (`src/styles/base-statique/`). |
| Supabase | Postgres, connexion des admins, stockage des photos, sécurité au niveau des lignes (RLS) |
| Stripe (mode **test** seulement) | Paiements Checkout, remboursements, factures |
| Courriels | Simulés (console + boîte d'envoi de l'admin); Resend s'active par variable d'environnement |

Dépendances ajoutées au gabarit Next : `@supabase/supabase-js`, `@supabase/ssr` (cookies de session avec Next), `stripe`. Aucune autre.

## 2. Installation locale

Prérequis : Node.js 20 ou plus récent. Sur le poste de Jérémy, Node 26 LTS est installé en version portable dans `%LOCALAPPDATA%\Programs\node-v26.13.0-win-x64`, et ce dossier est ajouté au PATH de l'utilisateur.

```bash
cd web
npm install
cp .env.example .env.local   # puis remplir (section 3)
npm run dev                  # http://localhost:3000
```

Sans `.env.local`, le site public s'affiche quand même avec les données de départ (programmation 2026 et galerie en JSON). Les réservations, les paiements et l'admin demandent Supabase.

## 3. Variables d'environnement (`web/.env.local`)

| Variable | Où la trouver | Note |
|---|---|---|
| `NEXT_PUBLIC_URL_SITE` | `http://localhost:3000` | Sert aux liens dans les courriels |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem, clé `anon` | Publique, protégée par la RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | idem, clé `service_role` | **Serveur seulement.** Ne jamais la préfixer par `NEXT_PUBLIC_`. |
| `STRIPE_SECRET_KEY` | Stripe > Développeurs > Clés API, **mode test** | Le serveur refuse toute clé qui ne commence pas par `sk_test_` |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` (facultatif en local) | Section 5 |
| `COURRIEL_FOURNISSEUR` | `console` ou `resend` | Section 6 |
| `COURRIEL_EXPEDITEUR`, `COURRIEL_ADMIN` | | L'admin reçoit les avis de nouvelles demandes |
| `RESEND_API_KEY` | resend.com | Seulement si `COURRIEL_FOURNISSEUR=resend` |
| `AFFICHER_PRIX_FICTIFS` | `true` en dev | Montre les prix « à confirmer » au public pour tester le paiement. **Toujours ignoré en production.** |

## 4. Base de données Supabase

1. Créer un projet gratuit sur supabase.com (région Canada si offerte).
2. SQL Editor : exécuter `web/supabase/migrations/0001_schema.sql`, puis `web/supabase/seed.sql`.
3. Créer le premier super-admin :
   ```bash
   npm run creer-admin -- courriel@exemple.com "MotDePasseLong" super_admin "Jérémy Royer"
   ```
   Les autres comptes se créent ensuite dans Admin > Utilisateurs.

### Schéma (résumé)

| Table | Contenu |
|---|---|
| `profils` | Comptes admin et rôle (`super_admin`, `editeur`, `lecteur`) |
| `prix` | Tous les prix, modifiables dans l'admin; `a_confirmer` = valeur fictive cachée au public |
| `salles`, `creneaux_salle`, `dates_verrouillees`, `reservations_salle` | Location libre-service (4a) |
| `emplacements_kiosque`, `demandes_kiosque` | Kiosques intérieurs sur plan (4b) et extérieurs (4c) |
| `inscriptions_danse` | Danse country (4d) |
| `demandes_remisage` | Remisage d'hiver (4e) |
| `paiements` | Une ligne par session Checkout ou facture Stripe; montants payés, frais retenus, remboursés |
| `evenements` | Programmation |
| `contenus`, `medias` | Textes modifiables, médiathèque (bucket de stockage `medias`) |
| `messages`, `courriels_sortants` | Formulaires Contact/Exposants, boîte d'envoi |

### Sécurité

- Le public (`anon`) **ne lit** que le contenu publié et **n'écrit rien** directement : les demandes passent par des actions serveur qui valident tout, puis écrivent avec la clé service.
- Les admins écrivent avec **leur session**. La RLS permet l'écriture aux éditeurs et au super-admin seulement, alors un lecteur ne peut rien modifier, même en contournant l'interface.
- La clé service ne sert qu'aux flux publics, aux webhooks, à la boîte d'envoi et à la création de comptes, toujours après vérification du rôle.
- Anti double-réservation :
  - salles : la fonction `retenir_creneau` (mise à jour atomique) et un index unique;
  - kiosques : un index unique sur (emplacement, année) pour les demandes approuvées ou confirmées.

## 5. Stripe (mode test)

- Cartes de test : `4242 4242 4242 4242`, n'importe quelle date future, n'importe quel CVC.
- **Sans webhook** : au retour du client, la page `/paiement/merci` vérifie la session auprès de Stripe et confirme le paiement. C'est suffisant pour tester en local.
- **Avec webhook** (recommandé avant la mise en ligne) :
  1. Installer la CLI Stripe.
  2. Lancer `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
  3. Copier le secret `whsec_…` dans `STRIPE_WEBHOOK_SECRET`.
- Événements traités :
  - `checkout.session.completed` et `checkout.session.async_payment_succeeded` : paiement confirmé;
  - `checkout.session.expired` : la date est libérée;
  - `invoice.paid` : facture de kiosque extérieur payée.
- La finalisation est idempotente (`lib/paiements.ts`) : le webhook et la page de retour peuvent tous deux passer sans double courriel.

## 6. Courriels

- Gabarits : `src/lib/courriel/gabarits.ts`. Fournisseurs : `src/lib/courriel/index.ts`.
- `COURRIEL_FOURNISSEUR=console` : rien ne part. Chaque courriel s'affiche dans le terminal et dans Admin > Boîte d'envoi.
- Pour l'envoi réel :
  1. Vérifier le domaine dans Resend.
  2. Mettre `COURRIEL_FOURNISSEUR=resend` et `RESEND_API_KEY=…`.
  3. Ajuster `COURRIEL_EXPEDITEUR`.

  Aucun changement de code n'est nécessaire.

## 7. Vérifications

```bash
npm run verifier   # typecheck + lint + build
```

## 8. Déploiement sur Netlify (seulement après l'approbation finale)

Le `netlify.toml` actuel publie encore le site statique (`publish = "site"`); ne pas le changer avant l'approbation.

Au moment de basculer :

1. Créer un projet Supabase de production et exécuter la migration. Exécuter le seed, puis remplacer les prix fictifs.
2. Passer Stripe en mode réel. Le garde-fou `sk_test_` dans `src/lib/env.ts` doit alors être retiré **volontairement**.
3. Netlify : base `web`, commande `npm run build`. Le runtime Next.js de Netlify est détecté automatiquement.
4. Copier les variables d'environnement dans Netlify. Ne pas définir `AFFICHER_PRIX_FICTIFS`.
5. Créer le webhook Stripe vers `https://<domaine>/api/stripe/webhook`.
6. Loi 25 : Supabase, Stripe et Netlify hébergent des données hors Québec. Faire l'évaluation des facteurs relatifs à la vie privée et mettre à jour la politique de confidentialité avant la mise en ligne (voir `A-CONFIRMER.md`).

## 9. Organisation du code

```
web/src/
  app/(public)/        pages publiques (layout avec en-tête et pied de page du site d'origine)
  app/admin/           connexion + pages protégées (admin/(protege))
  app/api/stripe/      webhook
  actions/             actions serveur publiques (reservations, messages, paiement) et admin/
  components/          site, programmation, photos, reservation, formulaires, admin
  contenu-statique/    pages converties du site statique (contenu d'origine)
  lib/                 env, supabase, stripe, paiements, courriel, validation, format, donnees
  donnees/             données de départ en JSON (sans Supabase)
web/supabase/          migration SQL et seed
```
