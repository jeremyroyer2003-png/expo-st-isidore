// Converti automatiquement depuis site/location.html (contenu d'origine du site statique)
import Link from "next/link";
import PhotoVivante from "@/components/site/PhotoVivante";

export const meta = { titre: "Location de salle – mariage, party, réunion | Expo St-Isidore", description: "Louez la salle de l'Expo St-Isidore à Saint-Isidore, en Beauce : tables, chaises et ambiance comprises. Mariage, party de famille, réunion, anniversaire. Demandez une date en ligne ou au 418 882-5649." };

export default function PageLocation({ calendrier, avis, fraisAnnulation, delaiHeures = 48, fraisMenage = null, fraisDepassement = null }: {
  calendrier: React.ReactNode; avis: string; fraisAnnulation: string | null; delaiHeures?: number;
  /** Montants des conditions de location; null = pas encore validé par le comité, donc pas affiché. */
  fraisMenage?: string | null; fraisDepassement?: string | null;
}) {
  return (
    <>


    {/* ===== Héros ===== */}
    <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>Toute l&apos;année</span><span>Saint-Isidore</span></p>
          <h1 id="titre-heros" className="heros__titre">
            <span>Louer</span>
            <span className="jaune">une salle</span>
          </h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">Mariage, party de famille, réunion ou anniversaire&nbsp;: le palais des commerces ou le Saloon de la grange 3, avec les <strong>tables, les chaises et l&apos;ambiance comprises</strong>. Choisissez une date libre dans le calendrier et réservez en ligne.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="#demande">Voir les dates libres <span className="fleche" aria-hidden="true">→</span></a>
            <a className="bouton bouton--contour" href="tel:+14188825649">418 882-5649</a>
          </div>
        </div>
      </div>
    </section>

    {/* ===== Les deux salles ===== */}
    <section className="section-papier" aria-labelledby="titre-salles">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-salles" className="titre-affiche">Deux salles</h2>
          <p>Une grande salle pour recevoir beaucoup de monde, une plus chaleureuse au décor western. Choisissez dans le formulaire, ou demandez-nous conseil.</p>
        </div>
        <div className="salles">
          <article className="salle">
            <figure className="salle__photo">
              <img src="/images/photos/kiosques-interieurs-800.webp" srcSet="/images/photos/kiosques-interieurs-800.webp 800w, /images/photos/kiosques-interieurs.webp 1400w" sizes="(max-width: 900px) 100vw, 600px" alt="Le palais des commerces : grand bâtiment intérieur au plafond haut, ici rempli de kiosques pendant l'Expo" width="800" height="533" loading="lazy" />
              <figcaption>Pendant l&apos;Expo, il accueille les kiosques intérieurs</figcaption>
            </figure>
            <div className="salle__texte">
              <h3>Le palais des commerces</h3>
              <p>Le grand bâtiment de l&apos;Expo&nbsp;: beaucoup d&apos;espace, un plafond haut et un plancher de béton. Pour les grands mariages, les soupers de groupe et les événements d&apos;entreprise.</p>
              <Link className="bouton bouton--marine" href="/location?salle=palais#demande">Choisir cette salle <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article className="salle">
            <figure className="salle__photo">
              <img src="/images/photos/soiree-saloon-800.webp" srcSet="/images/photos/soiree-saloon-400.webp 400w, /images/photos/soiree-saloon-800.webp 800w, /images/photos/soiree-saloon.webp 1080w" sizes="(max-width: 900px) 100vw, 600px" alt="Le Saloon de la grange 3, façade en bois illuminée de guirlandes le soir, avec des invités devant l'entrée" width="800" height="640" loading="lazy" />
              <PhotoVivante video="/videos/saloon-soir.mp4" />
              <figcaption>Le Saloon, un soir d&apos;Expo. Photo animée par IA.</figcaption>
            </figure>
            <div className="salle__texte">
              <h3>Le Saloon <small>grange 3</small></h3>
              <p>Façade de bois, guirlandes lumineuses et ambiance western. Pour les partys de famille, les anniversaires et les soirées qui finissent en danse.</p>
              <Link className="bouton bouton--marine" href="/location?salle=saloon#demande">Choisir cette salle <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>
      </div>
    </section>

    {/* ===== Ce qui est compris ===== */}
    <section className="section-papier-2" aria-labelledby="titre-compris">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-compris" className="titre-affiche">Ce qui<br />est compris</h2>
          <p>Vous arrivez avec vos invités. Le reste est déjà là.</p>
        </div>
        <dl className="liste-questions">
          <div><dt>Les tables et les chaises</dt><dd>Installées pour votre nombre d&apos;invités.</dd></div>
          <div><dt>L&apos;ambiance</dt><dd>La décoration de la salle fait partie de la location.</dd></div>
          <div><dt>Pour quels événements?</dt><dd>Mariages, partys de famille, réunions, anniversaires, soupers de groupe. Pour autre chose, demandez-nous.</dd></div>
          <div><dt>Le prix</dt><dd>Il s&apos;affiche dans le calendrier dès que vous choisissez votre salle et votre date. S&apos;il n&apos;y est pas encore, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</dd></div>
          <div><dt>Où?</dt><dd>Au palais des commerces ou au Saloon de la grange 3, sur le site de l&apos;Expo, 132, route Coulombe, Saint-Isidore. Stationnement sur place.</dd></div>
        </dl>
      </div>
    </section>

    {/* ===== Formulaire ===== */}
    <section id="demande" className="section-papier" aria-labelledby="titre-demande">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-demande" className="titre-affiche">Réserver<br />une date</h2>
          <p>Choisissez la salle, une date libre et vos heures, puis payez en ligne&nbsp;: la date est à vous tout de suite. {avis}</p>
        </div>
        {calendrier}
        <aside className="ensuite ensuite--bande espace-haut" aria-labelledby="titre-conditions" id="conditions">
          <h3 id="titre-conditions">Conditions de location</h3>
          <ol>
            <li><strong>La salle est rendue dans l&apos;état où vous l&apos;avez prise.</strong> Vous ramassez vos déchets, enlevez votre décoration et repartez avec ce que vous avez apporté.</li>
            <li><strong>Ménage&nbsp;:</strong> si la salle n&apos;est pas rendue propre, des frais de ménage sont facturés{fraisMenage ? <> (à partir de {fraisMenage})</> : null}.</li>
            <li><strong>Bris&nbsp;:</strong> un bris au bâtiment ou au matériel (tables, chaises, murs, lumières) est facturé au coût réel de la réparation ou du remplacement.</li>
            <li><strong>Heure de fin&nbsp;:</strong> un départ après la fin de votre créneau est facturé{fraisDepassement ? <> ({fraisDepassement} par heure entamée)</> : null}.</li>
          </ol>
          <p className="note">Chaque frais vous est expliqué par courriel, avec des photos, avant d&apos;être facturé.</p>
        </aside>
        <aside className="ensuite ensuite--bande espace-haut" aria-labelledby="titre-annulation" id="annulation">
          <h3 id="titre-annulation">Annulation</h3>
          <ol>
            <li><strong>Vous annulez vous-même</strong> avec le bouton «&nbsp;Gérer ou annuler ma réservation&nbsp;» de votre courriel de confirmation, jusqu&apos;à {delaiHeures}&nbsp;heures avant l&apos;événement.</li>
            <li><strong>On vous rembourse</strong> le montant payé{fraisAnnulation ? <>, moins {fraisAnnulation} de frais d&apos;annulation</> : <>, moins les frais d&apos;annulation indiqués par le bureau</>}. Le remboursement apparaît sur votre carte d&apos;ici 5 à 10 jours ouvrables.</li>
            <li><strong>Si c&apos;est l&apos;Expo qui annule</strong>, vous êtes remboursé au complet, sans frais.</li>
            <li><strong>Pour changer de date</strong>, ou à moins de {delaiHeures}&nbsp;heures de l&apos;événement, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</li>
          </ol>
        </aside>
      </div>
    </section>
  
    </>
  );
}
