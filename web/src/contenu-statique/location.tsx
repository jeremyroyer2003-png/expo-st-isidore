// Converti automatiquement depuis site/location.html (contenu d'origine du site statique)
import Link from "next/link";

export const meta = { titre: "Location de salle – mariage, party, réunion | Expo St-Isidore", description: "Louez la salle de l'Expo St-Isidore à Saint-Isidore, en Beauce : tables, chaises et ambiance comprises. Mariage, party de famille, réunion, anniversaire. Demandez une date en ligne ou au 418 882-5649." };

export default function PageLocation() {
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
          <p className="heros__intro">Mariage, party de famille, réunion ou anniversaire&nbsp;: le palais des commerces ou le Saloon de la grange 3, avec les <strong>tables, les chaises et l&apos;ambiance comprises</strong>. Dites-nous votre date, on vous rappelle avec les disponibilités et le prix.</p>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="#demande">Demander une date <span className="fleche" aria-hidden="true">→</span></a>
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
              <a className="bouton bouton--marine" href="#demande" data-choisir-salle="Le palais des commerces">Choisir cette salle <span className="fleche" aria-hidden="true">→</span></a>
            </div>
          </article>
          <article className="salle">
            <figure className="salle__photo">
              <img src="/images/photos/soiree-saloon-800.webp" srcSet="/images/photos/soiree-saloon-400.webp 400w, /images/photos/soiree-saloon-800.webp 800w, /images/photos/soiree-saloon.webp 1080w" sizes="(max-width: 900px) 100vw, 600px" alt="Le Saloon de la grange 3, façade en bois illuminée de guirlandes le soir, avec des invités devant l'entrée" width="800" height="640" loading="lazy" />
              <figcaption>Le Saloon, un soir d&apos;Expo</figcaption>
            </figure>
            <div className="salle__texte">
              <h3>Le Saloon <small>grange 3</small></h3>
              <p>Façade de bois, guirlandes lumineuses et ambiance western. Pour les partys de famille, les anniversaires et les soirées qui finissent en danse.</p>
              <a className="bouton bouton--marine" href="#demande" data-choisir-salle="Le Saloon (grange 3)">Choisir cette salle <span className="fleche" aria-hidden="true">→</span></a>
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
          <div><dt>Le prix</dt><dd>Il dépend de la date et du nombre de personnes. On vous le donne en vous rappelant.</dd></div>
          <div><dt>Où?</dt><dd>Au palais des commerces ou au Saloon de la grange 3, sur le site de l&apos;Expo, 132, route Coulombe, Saint-Isidore. Stationnement sur place.</dd></div>
        </dl>
      </div>
    </section>

    {/* ===== Formulaire ===== */}
    <section id="demande" className="section-papier" aria-labelledby="titre-demande">
      <div className="contenu section-espacee">
        <div className="entete-section">
          <h2 id="titre-demande" className="titre-affiche">Demander<br />une date</h2>
          <p>Deux minutes. On vérifie la disponibilité et on vous rappelle.</p>
        </div>
        <div className="demande">
        <div>
        <form id="form-location" className="formulaire formulaire--etroit" name="location" method="POST" action="location.html" data-envoi-simple data-merci="merci-location" noValidate>
          <input type="hidden" name="form-name" value="location" />
          <p className="visuellement-cache"><label>Ne pas remplir&nbsp;: <input name="champ-robot" tabIndex={-1} autoComplete="off" /></label></p>
          <fieldset className="etape">
            <legend className="etape__titre"><span className="etape__num" aria-hidden="true">1</span>Votre événement</legend>
            <p className="champ__etiquette" id="etiquette-salle">Salle souhaitée</p>
            <div className="choix-grille choix-grille--salles" role="radiogroup" aria-labelledby="etiquette-salle">
              <label className="choix">
                <input type="radio" name="salle" value="Le palais des commerces" required data-erreur="Choisissez une salle, ou « Je ne sais pas »" />
                <span className="choix__carte"><span className="choix__nom">Le palais</span><span className="choix__ex">Grande salle, plafond haut</span></span>
              </label>
              <label className="choix">
                <input type="radio" name="salle" value="Le Saloon (grange 3)" required data-erreur="Choisissez une salle, ou « Je ne sais pas »" />
                <span className="choix__carte"><span className="choix__nom">Le Saloon</span><span className="choix__ex">Grange 3, décor western</span></span>
              </label>
              <label className="choix">
                <input type="radio" name="salle" value="Je ne sais pas, conseillez-moi" required data-erreur="Choisissez une salle, ou « Je ne sais pas »" />
                <span className="choix__carte"><span className="choix__nom">Je ne sais pas</span><span className="choix__ex">On vous conseille</span></span>
              </label>
            </div>
            <div className="coordonnees espace-haut">
              <label className="champ"><span className="champ__etiquette">Type d&apos;événement</span>
                <select name="type" required>
                  <option value="">Choisir…</option>
                  <option>Mariage</option>
                  <option>Party de famille</option>
                  <option>Anniversaire</option>
                  <option>Réunion ou formation</option>
                  <option>Souper de groupe</option>
                  <option>Autre</option>
                </select>
              </label>
              <label className="champ"><span className="champ__etiquette">Date souhaitée</span><input type="date" name="date" required data-min-aujourdhui /></label>
              <label className="champ"><span className="champ__etiquette">Date de rechange <span className="facultatif">(facultatif)</span></span><input type="date" name="date_rechange" data-min-aujourdhui /></label>
              <label className="champ"><span className="champ__etiquette">Nombre de personnes</span><input type="number" name="personnes" min="1" max="2000" inputMode="numeric" required data-erreur="Entrez le nombre d'invités, environ (ex. 120)." /></label>
              <label className="champ"><span className="champ__etiquette">Durée <span className="facultatif">(facultatif)</span></span><input type="text" name="duree" placeholder="ex. de 17 h à 1 h" /></label>
            </div>
          </fieldset>
          <fieldset className="etape">
            <legend className="etape__titre"><span className="etape__num" aria-hidden="true">2</span>Vos coordonnées</legend>
            <div className="coordonnees">
              <label className="champ"><span className="champ__etiquette">Nom complet</span><input type="text" name="nom" required autoComplete="name" /></label>
              <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" /></label>
              <label className="champ champ--large"><span className="champ__etiquette">Courriel <span className="facultatif">(facultatif)</span></span><input type="email" name="courriel" autoComplete="email" /></label>
              <label className="champ champ--large"><span className="champ__etiquette">Commentaires <span className="facultatif">(facultatif)</span></span><textarea name="message" rows={4} placeholder="Traiteur, musique, heure d'installation…"></textarea></label>
            </div>
            <label className="consentement">
              <input type="checkbox" name="consentement" value="oui" required />
              <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements seulement pour répondre à ma demande de location, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
            </label>
          </fieldset>
          {/* Mini-billet : sur téléphone, le billet complet est plus bas */}
          <div className="mini-billet" aria-hidden="true">
            <span className="mini-billet__ligne"><span data-resume="salle">—</span></span>
            <span className="mini-billet__ligne"><span data-resume="date">—</span></span>
            <span className="mini-billet__etat" data-etat>En attente</span>
          </div>
          <p className="champ__erreur formulaire__erreur" role="alert" hidden></p>
          <div className="formulaire__envoi">
            <button type="submit" className="bouton bouton--orange bouton--grand">Envoyer ma demande</button>
            <p>Vous préférez parler à quelqu&apos;un? <a href="tel:+14188825649">418 882-5649</a></p>
          </div>
        </form>
        <div className="merci" id="merci-location" tabIndex={-1} hidden>
          <h3>Merci, c&apos;est reçu!</h3>
          <p>On vérifie la disponibilité de la salle et on vous rappelle au <strong data-resume="telephone"></strong>.</p>
          <dl className="merci__recap">
            <div><dt>Salle</dt><dd data-resume="salle">—</dd></div>
            <div><dt>Date</dt><dd data-resume="date">—</dd></div>
            <div><dt>Invités</dt><dd data-resume="personnes">—</dd></div>
          </dl>
          <p className="merci__garder">Pas de nouvelles d&apos;ici quelques jours&nbsp;? Appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
          <button type="button" className="lien-action" id="nouvelle-demande">Faire une autre demande</button>
        </div>
        </div>
          <aside className="demande__cote" aria-label="Résumé de votre demande">
            <div className="billet-remisage billet-remisage--resume" id="billet">
              <div className="billet-remisage__corps">
                <p className="surtitre">Réservation de salle</p>
                <dl className="resume">
                  <div className="resume__ligne resume__ligne--large"><dt>Salle</dt><dd data-resume="salle">—</dd></div>
                  <div className="resume__ligne resume__ligne--large"><dt>Événement</dt><dd data-resume="type">—</dd></div>
                  <div className="resume__ligne"><dt>Date</dt><dd data-resume="date">—</dd></div>
                  <div className="resume__ligne"><dt>Rechange</dt><dd data-resume="date_rechange">—</dd></div>
                  <div className="resume__ligne"><dt>Invités</dt><dd data-resume="personnes">—</dd></div>
                  <div className="resume__ligne"><dt>Durée</dt><dd data-resume="duree">—</dd></div>
                  <div className="resume__ligne resume__ligne--large"><dt>Au nom de</dt><dd data-resume="nom">—</dd></div>
                </dl>
                <p className="resume__avis">Tables, chaises et ambiance comprises. Le prix vous est donné en vous rappelant.</p>
              </div>
              <div className="billet-remisage__talon" aria-hidden="true"><span data-etat>En attente</span></div>
              <p className="tampon" aria-hidden="true">Demande reçue</p>
            </div>
          </aside>
        </div>
        <aside className="ensuite ensuite--bande" aria-labelledby="titre-ensuite">
          <h3 id="titre-ensuite">Ce qui arrive ensuite</h3>
          <ol>
            <li><strong>On regarde le calendrier</strong> de la salle choisie pour votre date, et votre date de rechange.</li>
            <li><strong>On vous rappelle</strong> avec les disponibilités et le prix.</li>
            <li><strong>Vous venez voir la salle</strong> si vous le voulez, avant de réserver.</li>
          </ol>
          <p>Pressé? Le bureau répond au <a href="tel:+14188825649">418 882-5649</a>.</p>
        </aside>
      </div>
    </section>
  
    </>
  );
}
