# Guide du personnel : l'administration du site de l'Expo

Ce guide explique les gestes de tous les jours dans l'administration du site. Aucune connaissance technique n'est nécessaire.

> **Pour l'instant, tout est en mode test** : les paiements sont fictifs (Stripe test) et aucun courriel ne part vraiment. Les courriels que le site aurait envoyés sont dans **Boîte d'envoi**.

## Se connecter

1. Allez à l'adresse du site suivie de `/admin` (en test : http://localhost:3000/admin).
2. Entrez votre courriel et votre mot de passe.
3. Pour sortir, cliquez sur **Se déconnecter**, en bas du menu de gauche.

Votre rôle est écrit sous votre nom :

- **Éditeur** : calendrier, prix, programmation, photos, textes, approbations et remboursements.
- **Lecteur** : vous voyez tout, mais vous ne pouvez rien modifier.
- **Super-admin** : tout, plus la gestion des comptes.

## Le tableau de bord

C'est la première page. Les cases en jaune vous disent ce qui attend une décision : les kiosques et les remisages à approuver, et les messages non traités. Cliquez sur une case pour y aller.

## Ajouter un événement à la programmation

1. Menu **Programmation**.
2. Remplissez le bloc **Ajouter un événement** : date, heure (ex. « 19 h » ou « 17 h à 21 h »), titre, lieu, prix (texte libre, ex. « Gratuit »).
3. Cochez une ou plusieurs catégories (Animaux, Tire, Spectacles…).
4. Laissez **Publié** coché pour le montrer tout de suite. Décochez-le pour préparer l'événement sans le montrer.
5. Cliquez sur **Ajouter l'événement**.

Pour modifier un événement, cliquez sur sa ligne pour l'ouvrir, changez les champs, puis **Enregistrer**.

> La page Programmation du site montre toujours l'année la plus récente qui a des événements publiés. Pour préparer 2027 sans faire disparaître 2026, gardez les événements 2027 décochés jusqu'au dévoilement.

## Ouvrir des dates de location de salle

1. Menu **Calendrier des salles**.
2. Dans **Ajouter des créneaux** :
   - cochez la salle (palais, Saloon, ou les deux);
   - pour **une seule date** : remplissez « Du » seulement;
   - pour **plusieurs dates** : remplissez « Du » et « Au », puis cochez les jours de la semaine (ex. vendredi et samedi);
   - indiquez les heures (ex. de 17 h à 1 h).
3. Cliquez sur **Ajouter**.

Les créneaux ouverts apparaissent en jaune dans le calendrier public, et les clients peuvent les réserver et payer en ligne.

## Verrouiller une date

Une date verrouillée ne peut plus être réservée en ligne, par exemple pour de l'entretien ou un événement du comité.

- **Toute une journée** : dans **Dates verrouillées**, choisissez la date et la salle (ou « Toutes »), écrivez la raison pour l'équipe, puis cliquez sur **Verrouiller la date**.
- **Un seul créneau** : dans la liste du mois, cliquez sur **Verrouiller** à côté du créneau. **Rouvrir** le remet en vente.
- Pour débloquer une journée, cliquez sur **Déverrouiller**.

Une date déjà réservée et payée ne se verrouille pas : il faut d'abord annuler la réservation (voir « Rembourser »).

## Approuver un kiosque

1. Menu **Kiosques**. Les demandes en attente sont en haut.
2. **Kiosque intérieur** (choisi sur le plan) :
   - vérifiez le montant proposé (le prix de l'emplacement ou du kiosque intérieur), puis cliquez sur **Approuver … et envoyer le lien**;
   - le client reçoit un courriel avec un lien pour payer;
   - l'emplacement est **retenu pour lui** dès l'approbation : personne d'autre ne peut l'obtenir;
   - il devient **Confirmé** une fois payé.
3. **Kiosque extérieur** :
   - appelez l'entreprise pour vous entendre;
   - cliquez sur **Noter l'entente**, avec le montant convenu et les détails (superficie, électricité…);
   - cliquez sur **Envoyer la facture** : le client reçoit un lien pour payer en ligne, et la demande passe à **Confirmée** au paiement.
4. Pour **refuser** une demande, ouvrez « Refuser la demande », écrivez la raison (elle est envoyée au client), puis cliquez sur **Refuser**.

L'onglet **Emplacements du plan** sert à changer le plan : code, position, prix particulier, ou retirer un emplacement (décocher « Actif »).

## Approuver un remisage

1. Menu **Remisage**.
2. Le prix de la saison est calculé tout seul (longueur × tarif au pied). Corrigez-le au besoin.
3. Le **dépôt** doit être d'au moins le minimum (100 $ par défaut).
4. Cliquez sur **Approuver et envoyer le lien du dépôt**. La place est gardée une fois le dépôt payé.

## Rembourser (annuler une réservation)

Cela fonctionne pour les salles, les kiosques, le remisage et la danse.

1. Trouvez la réservation :
   - salles : menu **Salles**;
   - kiosques : menu **Kiosques**;
   - remisage : menu **Remisage**;
   - danse : menu **Danse**.
2. Cliquez sur **Annuler et rembourser**.
3. Vérifiez les **frais retenus**. Ils sont pré-remplis avec les frais d'annulation du menu Prix, et vous pouvez les changer (0 = remboursement complet).
4. Laissez **Aviser le client** coché pour lui envoyer le courriel d'annulation.
5. Confirmez.

Le remboursement passe tout de suite par Stripe. Une date de salle redevient libre, et un emplacement de kiosque aussi.

## Changer un prix

1. Menu **Prix**.
2. Changez le montant, puis cliquez sur **Enregistrer**.
3. Un prix encadré en pointillé orange porte la mention **À confirmer** : c'est une valeur de départ fictive. Le public voit « Prix sur demande » et ne peut pas payer en ligne. Une fois le prix validé par le comité, **décochez « À confirmer »**.

## Ajouter des photos

1. Menu **Médiathèque**, bloc **Ajouter une photo**.
2. Choisissez le fichier (JPEG, PNG ou WebP, 8 Mo au plus).
3. Écrivez une **description** de ce qu'on voit (ex. « Tracteur vert qui tire le traîneau devant la foule »). Elle sert aux personnes aveugles et à Google.
4. Choisissez l'**album** et écrivez le **crédit** du photographe.
5. Cliquez sur **Téléverser**.

Règles à respecter :

- seulement des photos dont l'Expo a les droits;
- **aucune photo d'enfant reconnaissable**;
- pas de photo floue ou trop petite.

Pour une **vidéo**, collez le lien YouTube ou Facebook dans **Ajouter une vidéo**.

## Modifier un texte du site

Le menu **Textes du site** contient les phrases qui changent souvent : l'horaire de la danse, la saison de remisage, les avis. Modifiez le texte, puis cliquez sur **Enregistrer**.

## Messages et boîte d'envoi

- **Messages** : ce que les visiteurs envoient par les formulaires Contact et Exposants. Cliquez sur **Marquer comme traité** une fois la réponse donnée.
- **Boîte d'envoi** : tous les courriels que le site a envoyés (ou simulés en mode test). Cliquez sur un courriel pour le voir comme le client le reçoit.

## Gérer les comptes (super-admin seulement)

1. Menu **Utilisateurs**.
2. Pour ajouter un admin : son nom, son courriel, son rôle et un mot de passe temporaire. Donnez ce mot de passe **de vive voix**, jamais par courriel.
3. Pour changer un rôle, utilisez la liste à côté du nom.
4. **Supprimer** retire l'accès.
