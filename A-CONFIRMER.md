# À confirmer avec le comité de l'Expo

Ces informations manquent sur le site. Depuis le 4 novembre 2026, **plus aucun crochet n'est visible au public** (conseil du coach) : chaque trou est remplacé par une phrase neutre (« annoncées au printemps », « appelez le bureau », « on vous rappelle avec le prix »). Une fois la réponse obtenue, remplacer la phrase neutre par la vraie information dans le fichier indiqué.

## Application avec réservations en ligne (ajouté le 10 novembre 2026)
Les prix ci-dessous sont des **valeurs fictives de départ**, marquées « à confirmer » dans Admin > Prix : le public voit « Prix sur demande » tant qu'un éditeur ne les a pas validées.
- [ ] Location : prix du palais des commerces (fictif : 1 200 $ le créneau) et du Saloon (fictif : 600 $); créneaux réellement offerts (seed : vendredis et samedis, 17 h à 1 h)
- [ ] Kiosque intérieur (fictif : 350 $) et prix de départ d'un kiosque extérieur (fictif : 750 $)
- [ ] Danse : forfait mensuel (75 $, donné en exemple par Jérémy) et forfait saison d'environ 3 mois (fictif : 180 $). La session à 20 $ est confirmée.
- [ ] Remisage : tarif au pied (fictif : 15 $); le dépôt minimum de 100 $ est confirmé. Comment se paie le solde?
- [ ] Frais d'annulation : salle (fictif : 50 $), kiosque (fictif : 50 $), remisage (fictif : 25 $); politique d'annulation (délais)
- [ ] **Taxes (TPS 5 % et TVQ 9,975 %)** : aucune taxe n'est calculée pour l'instant dans les paiements en ligne. À demander au comité :
  - L'Expo est-elle inscrite aux fichiers de la TPS et de la TVQ, ou « petit fournisseur » (moins de 30 000 $ de ventes taxables par année; seuil différent pour un organisme de bienfaisance ou un OBNL : à vérifier avec le comptable)?
  - Si elle est inscrite : quels services sont taxables (location de salle, kiosques, danse, remisage)? Les prix affichés sont-ils taxes incluses ou en sus? Numéros de TPS et de TVQ (à afficher sur les reçus et les factures)
  - Taux fixes dans Stripe (gratuit, suffisant pour le Québec) ou Stripe Tax (calcul automatique, frais d'environ 0,5 % par transaction)?
- [ ] **Plan officiel du palais des commerces** : le plan en ligne est indicatif (32 emplacements de 10 pi × 10 pi, généré)
- [ ] Capacité des salles (pour l'afficher au calendrier)
- [ ] Compte Stripe de l'Expo (au nom du comité) pour la mise en ligne; qui reçoit les virements
- [ ] Noms et courriels des 3 éditeurs et des lecteurs de l'administration
- [ ] Courriel d'envoi (domaine expobassinchaudiere.com à vérifier dans Resend)
- [ ] Loi 25 : Supabase, Stripe et Netlify hébergent les données hors Québec. Évaluation des facteurs relatifs à la vie privée et mise à jour de la politique de confidentialité avant la mise en ligne
- [ ] Photos de la page Facebook : récupérées de la page publique (le comité est admin, mais l'accès n'est pas encore donné), importées **non publiées** par `web/scripts/importer-photos-fb.py`. Avant de publier chaque photo : droits du photographe nommé dans le crédit, aucun enfant reconnaissable. Quand le comité donnera l'accès, l'export officiel de la page remplacera ces copies.
  - 31 photos importées le 11 novembre 2026, dont les crédits ont été lus dans les filigranes : **Lyse Neuville Photography** (jugements 2024-2025), **Cynthia Fillion Photographe** (BBQ, saloon), **Gagné Photographie** (tracteur en balles de foin), **ELZEPHOTO** (2018). Les autres photos (tire 2015, quelques photos de 2016 et 2018) n'ont pas de filigrane : il faut retrouver qui les a prises.
  - Écartées : photos avec enfants ou jeunes éleveurs reconnaissables, affiches et visuels de programmation.
- [ ] **Année de fondation** : la page Facebook dit « Créée en 1982 », le site dit « depuis 1983 ». Laquelle est la bonne?
- [ ] Un **plan papier du palais des commerces** a été publié sur Facebook le 1er février 2017 (copie gardée dans le dépôt privé `expo-fb-photos`). C'est un point de départ pour le plan officiel des kiosques, à faire valider par le comité.
- [ ] Cahier Beauce Média 2010 (archives BAnQ) : copie gardée dans `docs/archives/`, citée dans Notre histoire; ne pas la publier en ligne sans permission

## Soulevé par la critique de design (4 novembre 2026)
- [ ] **Délai de réponse** aux demandes (remisage, location, exposants) : « on vous rappelle d'ici 2 jours ouvrables »? Pour l'ajouter aux messages de confirmation et à « Ce qui arrive ensuite » (`remisage.html`, `location.html`)
- [ ] L'Expo est-elle fermée le **mercredi**? L'horaire 2026 saute du mardi au jeudi (`programmation.html`)
- [ ] **Capacité** du palais des commerces et du Saloon (nombre de personnes assises / debout) (`location.html`)
- [ ] Une photo de l'**intérieur du Saloon** et du palais **monté pour une réception**
- [ ] Une version **une couleur** du logo (crème ou brune) pour le thème Grange & rodéo
- [ ] Orthographe du groupe « Show Lex Roses » (`programmation.html`)
- [ ] La photo « Tire de pick-ups » porte le filigrane du photographe (tirsQC.com) : on le laisse visible (c'est son crédit) tant qu'on n'a pas une version sans filigrane avec permission
- [ ] Quand le tarif au pied sera inscrit, la ligne « Estimation » du billet et la phrase « Votre estimation apparaît… » réapparaissent toutes seules (`data-prix-par-pied`)

## Nouveautés à documenter (ajoutées le 4 novembre 2026)
- [ ] **Rodéo 2027**, la semaine avant l'Expo : dates, heure, lieu, prix, billetterie (`index.html`, `programmation.html`). L'accueil dit « Monte de taureaux, sur le site de l'Expo » : à confirmer. La photo est une **photo d'illustration** libre de droits (Joey Chacon, Unsplash), à remplacer par une vraie photo du rodéo après l'événement.
- [x] Chiens permis en laisse, bingo, mini-ferme, salle de dégustation, aire de pique-nique, camion de rue (fiche Bonjour Québec, confirmé par Jérémy) : ajoutés à l'accueil et à Infos pratiques.
- [ ] **Danse country en ligne**, grange 2, 19 h à 21 h, 20 $ la session : quel jour de la semaine? date de début et de fin (environ un mois après la sortie des roulottes, un mois avant leur rentrée)? inscription requise? (`index.html`)
- [x] **Location de salle** : deux salles, le palais des commerces et le Saloon de la grange 3 (confirmé par Jérémy).
- [ ] Location : capacité de chaque salle? tarif ou fourchette de prix? traiteur et bar permis? (`location.html`)
- [ ] Photos des deux salles montées pour une réception (pour l'instant : le palais pendant l'Expo, le Saloon de l'extérieur), et une photo du rodéo

## Dates et horaires
- [ ] Dates de l'Expo 2027 (`index.html`, `contact.html`, `tire-de-tracteurs.html`)
- [ ] Date de dévoilement de la programmation 2027 (`programmation.html`)
- [ ] Heures d'ouverture du site pendant l'Expo (`contact.html`)
- [ ] Heures du bureau (`contact.html`)
- [ ] Place de la famille « sans surveillance de 10 h à 16 h » : sans animateurs? parents responsables? (`programmation.html`)
- [ ] Lieu de « La Championne se paie la traite » (`programmation.html`)
- [ ] Agri'Culture le dimanche : 11 h 30 ou 12 h? (le site actuel donne les deux)

## Visiter
- [ ] Animaux de compagnie permis? (`contact.html`)
- [ ] Accessibilité : fauteuil roulant, toilettes adaptées (`contact.html`)
- [ ] Paiement sur place : comptant, carte (`contact.html`)

## Tire de tracteurs
- [ ] Dates et prix des billets 2027 (`tire-de-tracteurs.html`)
- [ ] Lien de la billetterie en ligne (`tire-de-tracteurs.html`)
- [ ] Liste des pilotes 2027
- [ ] Nom du tracteur Pro Farm de Steven Gagné; orthographe « Argosy » ou « Argos » (camion de Mario Racicot)
- [ ] Signification complète de l'acronyme ASTTQ

## Exposants
- [ ] Tarifs des kiosques 2027 (`exposants.html`)
- [ ] Documents 2027 : formulaire de réservation, invitations, plan du site (`exposants.html`)
- [ ] Les normes et règlements bovins de 2018 sont-ils toujours en vigueur?

## Remisage d'hiver
- [ ] Tarif au pied : l'inscrire dans `remisage.html`, attribut `data-prix-par-pied=""`
- [ ] Valider la règle « chaque véhicule est mesuré à l'arrivée; le prix final se base sur cette mesure »
- [ ] Les motos et Spyder sont-ils aussi facturés au pied?
- [ ] Accès au véhicule pendant l'hiver?
- [ ] Conseils de préparation avant l'entrée (antigel, batterie, réservoirs)
- [ ] Dates exactes d'entrée et de sortie 2026-2027
- [ ] Une photo de l'intérieur d'un bâtiment rempli de roulottes

## Histoire
- [ ] Prix du jury ExpoStar 2009 : éducation agricole (site actuel) ou menus santé (Beauce Média)?
- [ ] Consentement des membres du comité à voir leur nom et leur rôle publiés

## Photos et droits
- [ ] Droits d'utilisation : ELZEPHOTO, Lyse Neuville Photography, Cynthia Fillion Photographe, tirsQC.com
- [ ] Certaines photos de tire viennent d'autres événements de l'ASTTQ : en obtenir de Saint-Isidore
- [ ] Logo officiel en format vectoriel (SVG ou AI), pour remettre le moulinet

## Confidentialité (Loi 25)
- [ ] Nom et titre de la personne responsable de la protection des renseignements personnels (`confidentialite.html`)
- [ ] Durée de conservation des demandes reçues par formulaire
- [ ] Évaluation des facteurs relatifs à la vie privée pour l'hébergement Netlify (serveurs aux États-Unis), puis mention du transfert hors Québec dans les cases de consentement
- [ ] Faire relire la politique par une personne qualifiée
