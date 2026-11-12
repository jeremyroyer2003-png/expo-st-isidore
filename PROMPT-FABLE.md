# Mission : faire passer le site de l'Expo St-Isidore au niveau supérieur

Tu reprends un projet qui fonctionne déjà bien. Ton travail : le rendre **nettement plus agréable et plus simple à utiliser**, autant pour le public que pour les bénévoles qui gèrent l'admin. On ne repart pas de zéro et on ne change pas l'identité visuelle : on polit, on simplifie, on enlève les frictions.

## 1. Avant de toucher au code

Lis, dans cet ordre :
1. `CLAUDE.md` : les décisions de design et les règles. Elles font foi.
2. `REPRISE.md` : l'état exact du projet et les commandes.
3. `A-CONFIRMER.md` : ce qui attend une réponse du comité. Ne l'invente pas.
4. `web/AGENTS.md` : la version de Next.js est récente. Vérifie la doc dans `node_modules/next/dist/docs/` avant d'écrire du code Next.

Ensuite, démarre le serveur (`cd web && npm run dev`) et **utilise vraiment le site** dans le navigateur, à 1280 px et à 390 px. Pour avoir des données réalistes dans l'admin, génère l'échantillon de test (section 2 b de `REPRISE.md`).

## 2. Qui utilise le site

**Le public.** Des familles de la Beauce, beaucoup de gens de 50 ans et plus, souvent sur téléphone, parfois peu à l'aise avec le Web. Ils veulent savoir rapidement : quand, quoi, combien, comment s'y rendre. Certains réservent une salle, s'inscrivent à la danse, demandent un kiosque ou une place de remisage, et paient en ligne.

**L'admin.** Des bénévoles et des employés de l'Expo, pas des informaticiens. Ils approuvent des kiosques et du remisage, envoient des factures, annulent et remboursent, répondent aux messages, gèrent la programmation, les prix, les photos et les comptes. Chaque appel téléphonique évité leur fait gagner du temps.

## 3. Ce que je te demande

### Étape A : audit (aucune modification de code)

Fais chaque parcours de bout en bout en te mettant à la place de ces personnes :
- **Public :** trouver la programmation d'une journée; réserver une salle et payer avec la carte 4242; annuler cette salle depuis le courriel de confirmation; s'inscrire à la danse; demander un kiosque intérieur, puis un kiosque extérieur; demander du remisage; écrire au bureau.
- **Admin :** le matin, savoir quoi faire en premier; approuver un kiosque et envoyer sa facture; annuler une réservation (par le client, puis par l'Expo); retrouver un client par son nom; modifier un prix; ajouter une activité; téléverser une photo; lire la boîte d'envoi.

Note chaque friction : étape inutile, texte flou, bouton difficile à trouver, cible trop petite au doigt, message d'erreur peu clair, absence de confirmation, information qui manque, lenteur, mise en page brisée à 390 px, problème d'accessibilité (contraste, clavier, lecteur d'écran).

Livre-moi un **plan classé par impact**. Pour chaque point, indique le problème observé, la correction proposée, qui en profite (public ou admin) et l'effort (petit, moyen, gros). Regroupe en trois lots : gains rapides, améliorations moyennes, gros chantiers.

**Arrête-toi là et attends mon approbation** avant de coder.

### Étape B : réalisation (après mon OK)

- Un lot à la fois, un commit par amélioration, avec un message en français.
- Après chaque changement : `npm run lint` et `npm run build` sans erreur, puis vérification dans le navigateur à 1280 px et à 390 px.
- Pour tout ce qui touche l'argent (paiement, remboursement, annulation) : régénère l'échantillon et lance `npm run verifier-paiements`. Le résultat doit être « 0 problème ».
- À la fin de chaque lot : mets à jour `REPRISE.md` et `PROGRESS.md`, et fais-moi un court résumé de ce qui a changé et de ce que je dois tester moi-même.

## 4. Pistes de départ (à valider par ton audit, pas à appliquer sans réfléchir)

Côté public :
- Une vraie réponse à « qu'est-ce qui se passe aujourd'hui / ce soir » pendant l'Expo.
- Des formulaires plus courts et plus tolérants (format du téléphone, messages d'erreur près du champ, données conservées après une erreur).
- Un récapitulatif clair avant de payer, et une page de remerciement qui dit quoi faire ensuite.
- Le client gère lui-même ce qu'il a réservé, sans appeler (le lien d'annulation de salle existe déjà; voir si kiosque, remisage et danse en ont besoin).

Côté admin :
- Un tableau de bord qui dit « voici les 3 choses à faire maintenant ».
- Une recherche globale (client, courriel, téléphone) qui mène directement à la bonne fiche.
- Des actions en un clic avec annulation possible (« Annuler » pendant quelques secondes) plutôt que des confirmations en chaîne.
- Des listes filtrables par statut et par date, et un export CSV pour la comptabilité.
- Des textes d'aide courts à côté des actions sensibles (remboursement, frais).

## 5. Règles à ne jamais enfreindre

- **Aucun déploiement Netlify, aucun push GitHub, aucun merge dans `main`** sans mon approbation explicite. On travaille sur la branche `rebuild`, en local.
- **Stripe en mode test seulement.** Ne colle jamais une clé ou un mot de passe dans le chat : ils restent dans `web/.env.local`.
- **Aucune nouvelle dépendance npm** sans me demander avant.
- **Le site reste en français** (Loi 96). Tout formulaire qui recueille des renseignements personnels garde sa case de consentement (Loi 25).
- **Design :** garde la direction « Grange & rodéo » décrite dans `CLAUDE.md`. Pas d'illustrations ni d'icônes dessinées en code, pas d'images floues agrandies, pas d'émojis comme icônes, pas de dégradés violets. Toutes les animations s'arrêtent avec `prefers-reduced-motion`.
- **Photos :** aucun enfant identifiable. Les photos Facebook ne doivent pas quitter le dépôt local tant que je n'ai pas décidé comment les publier.
- **Ne réponds pas à la place du comité :** les dates, les prix réels et les délais d'annulation vont dans `A-CONFIRMER.md`.
- **Textes :** phrases courtes et concrètes, vouvoiement pour le public. Vérifie chaque grand titre à 390 px : le lettrage d'affiche déborde facilement.
- **Ne supprime rien d'important sans me le montrer avant** (pages, données, photos).

## 6. Ce que je veux sentir à la fin

Une personne de 65 ans réserve une salle sur son téléphone sans aide. Une bénévole arrive le matin, sait en 10 secondes quoi faire, et le fait sans appeler personne. Le site a l'air fait à la main pour l'Expo, pas sorti d'un gabarit.
