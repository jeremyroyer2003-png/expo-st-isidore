# Plan d'améliorations (audit du 11 novembre 2026)

Résultat de l'étape A de `PROMPT-FABLE.md`. **Aucun code n'a été modifié.** Rien ne se fait avant l'accord de Jérémy.

## Comment l'audit a été fait

- Les 12 pages publiques ont été ouvertes à 390 px et mesurées : aucun débordement horizontal, formulaires bien étiquetés, claviers de téléphone adaptés (tél., courriel, chiffres).
- Les parcours de réservation ont été suivis à l'écran et dans le code : salle, kiosque, danse, remisage, annulation par courriel, page de remerciement.
- L'admin a été parcouru avec l'échantillon de test (62 réservations), sur ordinateur et à 390 px.
- Non refait cette fois-ci : le paiement dans la page Stripe elle-même (l'extension du navigateur n'y a pas accès; Jérémy l'a testé à la main le 11 novembre).

## Ce qui est déjà solide (à ne pas toucher)

- Le calendrier des salles, les messages d'erreur sous chaque champ, les données conservées après une erreur.
- Les paiements, les remboursements et l'annulation par le client : vérifiés au cent près contre Stripe.
- L'identité visuelle « Grange & rodéo ».

---

## Lot 1 : gains rapides (petit effort chacun)

| # | Problème observé | Correction proposée | Pour qui |
|---|---|---|---|
| 1 | **Admin sur téléphone :** le menu complet (14 liens) occupe tout le premier écran de chaque page. Il faut défiler avant de voir quoi que ce soit. | Menu replié derrière un bouton « Menu » sous 1024 px, comme sur le site public. | Admin |
| 2 | **Le menu admin ne dit pas où il y a du travail.** Il faut ouvrir chaque section pour le savoir. | Pastille avec le nombre à traiter à côté de Kiosques, Remisage et Messages. | Admin |
| 3 | **Le tableau de bord donne des chiffres, pas des tâches.** « 3 kiosques à approuver » ne dit pas lesquels ni depuis quand. « Derniers paiements » montre un courriel, pas un nom. | Bloc « À faire maintenant » : chaque demande en attente avec le nom, l'âge de la demande (« depuis 3 jours ») et un bouton qui mène à la fiche. Nom du client dans les paiements. | Admin |
| 4 | **Liens de paiement affichés en code brut** (`/payer/abc…`) dans Kiosques et Remisage. Impossible de le renvoyer à un client qui l'a perdu sans le recopier à la main. | Boutons « Copier le lien » et « Renvoyer le courriel ». | Admin |
| 5 | **Calendrier des salles :** il s'ouvre sur le mois courant même s'il n'a aucune date libre. Le client doit cliquer de mois en mois. | Phrase « Prochaine date libre : samedi 21 novembre » qui y saute d'un clic. | Public |
| 6 | **Sur téléphone, après le choix de l'heure, le formulaire apparaît plus bas, hors de l'écran.** Rien n'indique qu'il faut défiler. | Défilement automatique jusqu'au formulaire (sans animation si « mouvement réduit »). | Public |
| 7 | **La page Location dit encore** « Le prix dépend de la date… On vous le donne en vous rappelant », alors que le prix s'affiche et se paie en ligne. | Harmoniser le texte avec le calendrier. | Public |
| 8 | **Avant de payer une salle, les frais et le délai d'annulation ne sont pas à côté du bouton.** Il y a seulement un lien vers la politique. | Une ligne claire sous le bouton : « Annulation en ligne possible jusqu'à 48 h avant, frais de 50 $ ». | Public |
| 9 | **Page de remerciement :** elle confirme, puis propose seulement « Retour à l'accueil ». | Ajouter « Et ensuite? » (qui vous appelle, quand), « Ajouter à mon calendrier » (fichier .ics), « Imprimer », et le lien d'annulation pour une salle. | Public |
| 10 | **Danse :** si on efface le nombre de personnes pour en taper un autre, le champ revient tout seul à 1. | Laisser le champ vide pendant la saisie; valider à l'envoi. | Public |
| 11 | **Boîte d'envoi :** 200 courriels chargés d'un coup, sans recherche. Retrouver le courriel d'un client demande de tout lire. | Recherche par destinataire, filtre par type, aperçu chargé seulement à l'ouverture. | Admin |
| 12 | **Aucun reçu officiel Stripe** n'est demandé. Le client a notre courriel, mais pas le reçu de carte. | Activer le reçu Stripe par courriel (à vérifier dans le code du paiement avant). | Public |

## Lot 2 : améliorations moyennes

| # | Problème observé | Correction proposée | Pour qui |
|---|---|---|---|
| 13 | **Impossible de retrouver un client.** Aucune recherche; salles, kiosques, remisage et danse sont quatre listes séparées. | Recherche globale (nom, courriel, téléphone, entreprise) dans l'en-tête de l'admin. Résultat : une **fiche client** avec toutes ses réservations, ses paiements et ses courriels. | Admin |
| 14 | **Pas d'export pour la comptabilité.** | Bouton « Exporter en CSV » (ouvrable dans Excel) sur chaque liste et sur les paiements, avec filtre par dates. | Admin |
| 15 | **Listes limitées à deux ou trois filtres.** Aucune vue « payé ce mois-ci » ou « en attente de paiement depuis 7 jours ». | Filtres par statut et par période; tri par colonne. | Admin |
| 16 | **Plan du palais sur téléphone :** les cases font environ 22 px, trop petites pour un doigt (minimum recommandé : 44 px). La liste existe, mais elle est cachée en dessous. | Sur téléphone, montrer la liste des emplacements libres en premier et le plan comme repère, ou permettre de zoomer le plan. | Public |
| 17 | **Calendrier admin :** une longue liste de dates. Difficile de voir un mois d'un coup d'œil. | Vue en grille mensuelle (libre, réservé, verrouillé), clic sur un jour pour agir. | Admin |
| 18 | **Aucune relance.** Un lien de paiement non payé reste en attente sans que personne le sache. | Dans « À faire » : « Lien envoyé il y a 7 jours, non payé » avec un bouton « Relancer ». L'envoi automatique viendra avec l'hébergement (lot 3). | Admin |
| 19 | **Aucun historique.** On ne sait pas qui a approuvé, refusé ou remboursé, ni quand. | Journal par réservation (« Approuvé par Marie le 12 nov. »). Demande une petite migration de la base. | Admin |
| 20 | **Kiosque, remisage et danse :** le client doit appeler pour connaître l'état de sa demande. | Page « Ma demande » par lien signé (comme l'annulation de salle) : statut, lien de paiement, coordonnées. | Public |
| 21 | **Programmation :** rien ne répond à « qu'est-ce qui se passe maintenant? » pendant l'Expo. | Pendant les dates de l'Expo : onglet du jour ouvert d'office, bloc « En ce moment / À venir ce soir », bouton « Ajouter à mon calendrier ». | Public |
| 22 | **Référencement :** pas de plan du site (sitemap), pas de données structurées. Google ne peut pas afficher les dates et l'adresse de l'Expo dans ses résultats. | `sitemap.xml`, `robots.txt`, données « Événement » et « Organisme local ». | Public |
| 23 | **Vidéos du héros : 7 à 8 Mo chacune.** Lent sur réseau cellulaire. | Compression avec ffmpeg (sur le PC de la maison), puis passe Lighthouse sur toutes les pages. | Public |

## Lot 3 : gros chantiers (plusieurs demandent une décision du comité)

| # | Sujet | Détail |
|---|---|---|
| 24 | **Taxes (TPS/TVQ)** | Aucun montant du site ne mentionne les taxes. Un OBNL doit s'inscrire et percevoir les taxes si ses ventes taxables dépassent 50 000 $ sur quatre trimestres ([Revenu Québec](https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/inscription-aux-fichiers-de-la-tps-et-de-la-tvq/organismes-de-services-publics/)). **Question au comité :** l'Expo est-elle inscrite, et quels services sont taxables? Selon la réponse : prix « taxes en sus », détail sur les reçus, numéros de taxes. À ajouter dans `A-CONFIRMER.md`. |
| 25 | **Contrat de location de salle** | Aujourd'hui le client paie sans accepter de conditions (heures, ménage, alcool, bris). Proposer : conditions à cocher avant le paiement, copie jointe au courriel, et au besoin un dépôt de garantie. Le texte vient du comité. |
| 26 | **Acompte et solde** | Payer une salle à 1 200 $ d'un coup peut freiner. Option : acompte à la réservation, solde payable en ligne avant la date, rappel automatique. |
| 27 | **Liste d'attente et dates non offertes** | Quand une date est prise ou absente : « Avisez-moi si elle se libère » ou « Demander cette date ». |
| 28 | **Remisage : renouvellement** | Chaque automne, inviter les clients de l'an dernier à reprendre leur place en un clic (dimensions déjà connues). Solde payable en ligne à l'entrée. |
| 29 | **Billetterie** (tire de tracteurs, rodéo 2027) | Vente de billets en ligne avec Stripe. Gros chantier; à décider avec le comité. |
| 30 | **Mise en service** | Vrais courriels (Resend), webhook Stripe, relances automatiques, hébergement. **Seulement avec l'approbation de Jérémy.** |

---

## Recommandation

1. **Faire le lot 1 au complet d'abord.** Douze petites corrections, visibles tout de suite, sans risque pour les paiements.
2. **Ensuite, dans le lot 2 :** la recherche avec fiche client (13), l'export CSV (14) et le plan sur téléphone (16). Ce sont les trois qui évitent le plus d'appels et de temps perdu.
3. **Poser dès maintenant au comité** les questions 24 (taxes) et 25 (contrat) : elles changent ce qui s'affiche avant le paiement.

## Sources consultées

- [Revenu Québec : organismes de services publics, inscription à la TPS et à la TVQ](https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/inscription-aux-fichiers-de-la-tps-et-de-la-tvq/organismes-de-services-publics/)
- [Agence du revenu du Canada : petits fournisseurs](https://www.canada.ca/fr/agence-revenu/services/formulaires-publications/publications/2-2/petits-fournisseurs.html)
- [Bonjour Québec : Exposition agricole de Victoriaville](https://www.bonjourquebec.com/en-ca/listing/events/exposition-agricole-de-victoriaville/0p6l) (comparaison avec d'autres expos)
