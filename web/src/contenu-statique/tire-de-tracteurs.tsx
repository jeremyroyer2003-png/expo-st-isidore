// Converti automatiquement depuis site/tire-de-tracteurs.html (contenu d'origine du site statique)
import Link from "next/link";
import PhotoVivante from "@/components/site/PhotoVivante";

export const meta = { titre: "Tire de tracteurs ASTTQ – billets, classes et pilotes | Expo St-Isidore", description: "Deux soirs de tire de tracteurs ASTTQ à l'Expo St-Isidore : Super Stock, Pro Farm, Hot Farm, 4x4 modifiés et semi-remorques. Prix des billets, classes et pilotes." };

export default function PageTireDeTracteurs() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--photo heros--video" aria-labelledby="titre-heros">
      {/* La tire de nuit (photo ELZEPHOTO) qui bouge, à droite; le texte reste à gauche, sur les planches */}
      <figure className="heros__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/photos/tire-fumee-soir.webp" srcSet="/images/photos/tire-fumee-soir-800.webp 800w, /images/photos/tire-fumee-soir.webp 1600w" sizes="(max-width: 760px) 100vw, 64vw" alt="Tracteur modifié rouge qui tire le traîneau le soir, une colonne de fumée noire au-dessus, devant les estrades pleines" width={1600} height={1067} fetchPriority="high" />
        <PhotoVivante video="/videos/heros-tire-nuit.mp4" />
        <span className="heros__voile" aria-hidden="true" />
        <figcaption className="heros__credit">Photo&nbsp;: ELZEPHOTO</figcaption>
      </figure>
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>ASTTQ</span><span>2 soirs</span></p>
          <h1 id="titre-heros" className="heros__titre">
            <span>Tire de</span>
            <span className="jaune">tracteurs</span>
          </h1>
          <p className="heros__intro">Deux soirs de compétition ASTTQ, le vendredi et le samedi de l&apos;Expo. Super Stock, Pro Farm, 4x4 modifiés et semi-remorques.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="#billets">Prix des billets</a>
            <a className="bouton bouton--contour" href="#pilotes">Les pilotes</a>
          </div>
        </div>
      </div>
    </section>


    {/* ===== Classes ===== */}
    <section className="section-papier" aria-labelledby="titre-classes">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-classes" className="titre-affiche">Une soirée<br />de tire</h2>
          <p>L&apos;ordre de passage du vendredi 19 juillet 2024. Il change d&apos;un soir à l&apos;autre.</p>
        </div>
        <ol className="classes">
          <li><span className="classes__num" aria-hidden="true">01</span><span className="classes__nom">4x4 modifiés</span></li>
          <li><span className="classes__num" aria-hidden="true">02</span><span className="classes__nom">Hot Farm</span></li>
          <li><span className="classes__num" aria-hidden="true">03</span><span className="classes__nom">Minis</span></li>
          <li><span className="classes__num" aria-hidden="true">04</span><span className="classes__nom">Pro Farm</span></li>
          <li><span className="classes__num" aria-hidden="true">05</span><span className="classes__nom">Mini Grand National</span></li>
          <li><span className="classes__num" aria-hidden="true">06</span><span className="classes__nom">Pro Stock</span></li>
          <li><span className="classes__num" aria-hidden="true">07</span><span className="classes__nom">Super Stock</span></li>
          <li><span className="classes__num" aria-hidden="true">08</span><span className="classes__nom">Camions semi</span></li>
        </ol>
      </div>
    </section>

    {/* ===== Pilotes ===== */}
    <section id="pilotes" className="section-papier-2" aria-labelledby="titre-pilotes">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-pilotes" className="titre-affiche">Les<br />pilotes <small className="annee-liste">2024</small></h2>
          <p>La plus récente liste publiée, celle de 2024. Celle de 2027 s&apos;ajoutera ici quand elle sera connue.</p>
        </div>
        <ul className="pilotes">
          <li><figure className="tirage">
            <img src="/images/photos/tire-giroux-express-800.webp" alt="Giroux Express, John Deere 7810 vert, en pleine tire" width="800" height="533" loading="lazy" />
            <figcaption><strong>Giroux Express</strong><span>Sylvain Giroux</span><span className="classe">Super Stock</span></figcaption>
          </figure></li>
          <li><figure className="tirage">
            <img src="/images/photos/tire-semi-racicot-800.webp" alt="Camion semi Freightliner rouge qui tire le traîneau dans un nuage de fumée, au Grand National de St-Hyacinthe en 2018" width="800" height="533" loading="lazy" />
            <figcaption><strong>Argosy Freightliner</strong><span>Mario Racicot</span><span className="classe">Semi</span><span className="pilotes__lieu">Photo prise au Grand National de St-Hyacinthe, 2018</span></figcaption>
          </figure></li>
          <li><figure className="tirage">
            <img src="/images/photos/tire-toy-farmer-800.webp" alt="Tracteur Toy Farmer bleu et blanc en action, fumée noire" width="800" height="533" loading="lazy" />
            <figcaption><strong>Toy Farmer</strong><span>Eric Boissonneault</span><span className="classe">Hot Farm</span></figcaption>
          </figure></li>
          <li><figure className="tirage">
            <img src="/images/photos/tire-thunder-deere-800.webp" alt="Tracteur Thunder Deere 2.0 vert stationné sur le gazon" width="800" height="600" loading="lazy" />
            <figcaption><strong>Thunder Deere 2.0</strong><span>Steeven et Kellyane Lagrange</span><span className="classe">Hot Farm</span></figcaption>
          </figure></li>
          <li><figure className="tirage">
            <img src="/images/photos/tire-sgt-slaughter-800.webp" alt="Mini tracteur modifié Sgt. Slaughter, roues avant levées, sous les projecteurs" width="800" height="533" loading="lazy" />
            <figcaption><strong>Sgt. Slaughter</strong><span>Jonathan Van Horne</span><span className="classe">Mini</span></figcaption>
          </figure></li>
        </ul>

        <div className="tableau-defilant espace-haut">
          <table className="tableau">
            <caption>Les autres pilotes inscrits en 2024</caption>
            <thead><tr><th scope="col">Tracteur</th><th scope="col">Pilote</th><th scope="col">Classe</th></tr></thead>
            <tbody>
              <tr><td>The Gambler</td><td>Steeven Lagrange</td><td>Super Stock</td></tr>
              <tr><td>Red Smoker</td><td>Steve Gagné</td><td>Super Stock</td></tr>
              <tr><td>On the Road Again</td><td>Carol et Mathieu Benoit</td><td>4x4</td></tr>
              <tr><td>Hell Raiser</td><td>Richard Chartrand</td><td>4x4 modifié</td></tr>
              <tr><td>Big Red</td><td>Nicolas Francoeur</td><td>Semi</td></tr>
              <tr><td>Dark Horse</td><td>Tom Noonan</td><td>Pro Farm</td></tr>
              <tr><td>—</td><td>Steven Gagné</td><td>Pro Farm</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* ===== Billets ===== */}
    <section id="billets" className="section-nuit" aria-labelledby="titre-billets">
      <div className="contenu section-espacee bloc">
        <div className="bloc__titre">
          <h2 id="titre-billets" className="titre-affiche">Vos<br />billets</h2>
          <p>En ligne ou à la porte, les soirs de tire. Les dates 2027 seront annoncées avec la programmation, au printemps.</p>
        </div>
        <div className="pile">
          <div className="tarifs">
            <div className="tarifs__corps">
              <p className="surtitre">Prix 2026, par soir</p>
              <dl className="tarifs__liste">
                <div><dt>Adulte</dt><dd>30&nbsp;$</dd></div>
                <div><dt>12 à 15 ans</dt><dd>20&nbsp;$</dd></div>
                <div><dt>Moins de 12 ans</dt><dd>Gratuit</dd></div>
                <div><dt>Forfait 2 soirs</dt><dd>50&nbsp;$</dd></div>
              </dl>
              <p className="tarifs__note">En 2026&nbsp;: vendredi 17 juillet à 18&nbsp;h&nbsp;30 et samedi 18 juillet à 18&nbsp;h.</p>
            </div>
            <div className="tarifs__talon" aria-hidden="true"><span>Admis</span></div>
          </div>
          <p className="texte-nuit"><strong>Billetterie en ligne&nbsp;:</strong> la vente ouvre avec l&apos;annonce des dates 2027. Le bouton d&apos;achat s&apos;ajoutera ici.</p>
          <dl className="liste-questions">
            <div><dt>Sur place</dt><dd>Nourriture et bar (alcool pour les 18 ans et plus).</dd></div>
            <div><dt>S&apos;il pleut</dt><dd>La tire est reportée au dimanche.</dd></div>
            <div><dt>L&apos;entrée de l&apos;Expo</dt><dd>Reste gratuite. Le billet donne accès à la tire.</dd></div>
          </dl>
        </div>
      </div>
    </section>

    {/* ===== Photos ===== */}
    <section className="section-papier" aria-labelledby="titre-ambiance">
      <div className="contenu section-espacee">
        <h2 id="titre-ambiance" className="titre-affiche">L&apos;ambiance au bord de la piste</h2>
        <div className="rangee-photos">
          <figure className="tirage"><img src="/images/photos/tire-semi-nuit-800.webp" alt="Camion semi sous les projecteurs, le soir, devant les estrades pleines" width="800" height="533" loading="lazy" /></figure>
          <figure className="tirage"><img src="/images/photos/tire-nuit-800.webp" alt="Tracteur vert crachant une fumée noire, le soir, sous les projecteurs" width="800" height="533" loading="lazy" /></figure>
          <figure className="tirage"><img src="/images/photos/tire-pickups-800.webp" alt="Pick-up modifié qui tire le traîneau, spectateurs en arrière-plan" width="800" height="533" loading="lazy" /></figure>
        </div>
        <p className="credits espace-haut">Photos&nbsp;: ELZEPHOTO, tirsQC.com et archives de l&apos;Expo. Certaines photos de pilotes ont été prises à d&apos;autres événements de l&apos;ASTTQ. <Link href="/photos">Voir toutes les photos</Link></p>
      </div>
    </section>
  
    </>
  );
}
