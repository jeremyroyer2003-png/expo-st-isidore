# Le nouveau site de l'Expo St-Isidore : ce qu'il fait pour vous

Document de présentation pour le comité. Le site est une **maquette de démonstration** : rien n'est en ligne, aucun vrai paiement n'est possible, et plusieurs prix sont fictifs en attendant vos chiffres.

## En une phrase

Le site répond aux questions des visiteurs à votre place, prend les réservations et les paiements jour et nuit, et vous montre chaque matin quoi faire.

## Ce que le visiteur peut faire seul, sans appeler

| Besoin | Ce que le site fait |
|---|---|
| Louer une salle | Il voit les dates libres, choisit ses heures, accepte les conditions, paie par carte. La date est bloquée tout de suite. |
| Annuler sa salle | Un bouton dans son courriel de confirmation. Le remboursement se fait seul, moins les frais d'annulation. |
| Réserver un kiosque intérieur | Il choisit son emplacement sur le plan du palais (ou par numéro sur un téléphone). Vous approuvez, il paie. |
| Demander un kiosque extérieur | Il envoie sa demande. Vous notez l'entente et le site envoie la facture. |
| Remiser un véhicule pour l'hiver | Il entre ses dimensions et voit une estimation. Vous approuvez, il paie son dépôt en ligne. |
| S'inscrire à la danse country | Il choisit un forfait et paie. Son nom est sur votre liste. |
| Savoir quoi faire à l'Expo | Programmation par jour avec filtres, page de la tire de tracteurs, photos, histoire, itinéraire. |

Tout fonctionne sur téléphone, avec de gros boutons et du texte lisible.

## Ce que le bureau y gagne

- **Moins d'appels.** Dates libres, prix, conditions, annulation : le client trouve la réponse et agit seul.
- **L'argent entre avant l'événement.** Le paiement par carte confirme la réservation. Pas de chèque à attendre.
- **Une liste de tâches chaque matin.** Le tableau de bord montre les demandes à approuver, depuis combien de jours elles attendent, et les paiements qui tardent.
- **Un client se retrouve en une recherche.** Par nom, entreprise, courriel ou téléphone : sa fiche montre tout ce qu'il a réservé, payé ou écrit.
- **La comptabilité en un clic.** Chaque liste et tous les paiements s'exportent vers Excel.
- **Vous gardez le contrôle.** Vous ouvrez les dates des salles, approuvez les kiosques et le remisage, changez les prix, la programmation et les photos vous-mêmes, sans programmeur.
- **Trois niveaux d'accès.** Super-admin (gère les comptes), éditeur (approuve et rembourse), lecteur (consulte seulement).
- **Chaque courriel envoyé est conservé.** Vous pouvez relire ce que le client a reçu, et lui renvoyer son lien de paiement.

## Ce qui a été vérifié

- Un échantillon de 62 réservations de tous les types a été créé avec des paiements de test.
- Les montants de la base de données et ceux de Stripe concordent au cent près, remboursements et frais compris.
- L'annulation par le client a été testée : remboursement moins les frais, date libérée, courriels envoyés, aucun double remboursement.
- Toutes les pages ont été vérifiées à la largeur d'un téléphone.

## Ce que le site attend de vous

La liste complète est dans `A-CONFIRMER.md`. L'essentiel :

1. **Les vrais prix** : salles, kiosques, remisage au pied, forfaits de danse.
2. **Les règles d'annulation** : délai (48 h proposé) et frais (50 $ proposé).
3. **Les conditions de location de salle** : voir `docs/CONDITIONS-LOCATION-SALLE.md` (ménage, bris, dépassement, dépôt de garantie).
4. **Le plan du palais** : numéros et dimensions des emplacements pour 2027.
5. **Les dates de 2027** et la programmation quand elle sera prête.
6. **Les droits des photos** et l'accord pour les deux photos animées par ordinateur (accueil et Saloon).
7. **Les taxes** (TPS et TVQ) : à régler avant la mise en service.

## Ce qu'il reste à faire avant la mise en ligne

- Brancher l'envoi réel des courriels et le compte Stripe de l'Expo.
- Faire valider la politique de confidentialité (Loi 25).
- Choisir l'hébergement et le nom de domaine.

Les frais de fonctionnement (hébergement, envoi de courriels, frais de carte prélevés par Stripe sur chaque paiement) sont à chiffrer avec les tarifs à jour de chaque fournisseur avant la décision.

## Pour l'essayer

Jérémy peut vous faire une démonstration en dix minutes : une réservation de salle du début à la fin côté client, puis ce que le bureau voit de son côté.
