// Converti automatiquement depuis site/programmation.html (contenu d'origine du site statique)
import Link from "next/link";

export const meta = { titre: "Programmation – spectacles, jugements, tire et famille | Expo St-Isidore", description: "La programmation de l'Expo St-Isidore jour par jour : spectacles, jugements d'animaux, tire de tracteurs et activités familiales. Programmation 2027 à venir." };

export default function PageProgrammation() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>Entrée gratuite</span><span>Prochaine&nbsp;: juillet 2027</span></p>
          <h1 id="titre-heros" className="heros__titre"><span>Programmation</span></h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">L&apos;horaire 2026, jour par jour, en attendant celui de 2027. Choisissez un jour, ou un type d&apos;activité pour voir toute la semaine.</p>
        </div>
      </div>
    </section>

    {/* ===== Horaire ===== */}
    <section id="horaire" className="section-papier" aria-labelledby="titre-horaire">
      <div className="contenu section-espacee">
        <div className="avis-bandeau" role="note">
          <div>
            <strong>La programmation 2027 s&apos;en vient</strong>
            <p>Elle sera dévoilée au printemps, avec une nouveauté&nbsp;: <strong>un rodéo, la semaine avant l&apos;Expo</strong>. D&apos;ici là, voici celle de 2026, à titre de référence.</p>
          </div>
          <a className="bouton bouton--marine" href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Suivre l&apos;Expo sur Facebook</a>
        </div>

        <h2 id="titre-horaire" className="titre-affiche titre-archive espace-bas">L&apos;horaire 2026, pour vous donner une idée</h2>

        <div className="onglets" role="tablist" aria-label="Jours de l'Expo" hidden></div>
        <div className="filtres" role="group" aria-label="Filtrer les activités" hidden>
          <span className="filtres__titre" aria-hidden="true">Afficher&nbsp;:</span>
          <button type="button" className="filtre" data-filtre="tout" aria-pressed="true">Tout</button>
          <button type="button" className="filtre" data-filtre="animaux" aria-pressed="false">Animaux</button>
          <button type="button" className="filtre" data-filtre="tire" aria-pressed="false">Tire</button>
          <button type="button" className="filtre" data-filtre="spectacles" aria-pressed="false">Spectacles</button>
          <button type="button" className="filtre" data-filtre="famille" aria-pressed="false">Famille</button>
          <button type="button" className="filtre" data-filtre="kiosques" aria-pressed="false">Kiosques</button>
          <button type="button" className="filtre" data-filtre="autres" aria-pressed="false">Autres</button>
        </div>
        <p className="note-prix">Les prix sont indiqués quand ils avaient été publiés pour 2026. Aucune activité n&apos;avait été publiée le mercredi.</p>
        <p className="note-avant"><strong>Avant l&apos;Expo, le samedi 11 juillet 2026&nbsp;:</strong> tournoi de balle Conrad Fauchon, de 8&nbsp;h&nbsp;30 à 18&nbsp;h, au terrain de balle.</p>
        <p className="visuellement-cache" aria-live="polite" id="annonce-filtre"></p>

        {/* Chaque jour est une section : sans JavaScript, tout reste affiché en liste */}
        <section className="jour" id="jour-mar-14" data-onglet="Mar." data-date="14 juillet" aria-labelledby="t-mar-14">
          <h3 className="jour__titre" id="t-mar-14">Mardi 14 juillet</h3>
          <ul className="evenements">
            <li className="evenement" data-cat="autres">
              <span className="evenement__heure">19&nbsp;h</span>
              <div><h4>Bingo</h4><p>Plus de 3 000&nbsp;$ en prix, en argent et en cartes-cadeaux.</p></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix">Payant sur place</span>
            </li>
          </ul>
        </section>

        <section className="jour" id="jour-jeu-16" data-onglet="Jeu." data-date="16 juillet" aria-labelledby="t-jeu-16">
          <h3 className="jour__titre" id="t-jeu-16">Jeudi 16 juillet</h3>
          <ul className="evenements">
            <li className="evenement" data-cat="animaux">
              <span className="evenement__heure">10&nbsp;h&nbsp;30</span>
              <div><h4>Jugement des jeunes éleveurs</h4><span className="etiquette etiquette--animaux">Animaux</span></div>
              <span className="evenement__lieu">Tente de jugement</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">16&nbsp;h</span>
              <div><h4>Ouverture des kiosques</h4><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">17&nbsp;h<small> à 21&nbsp;h</small></span>
              <div><h4>Place de la famille</h4><p>Jeux gonflables gratuits, mini-golf (payant), maquillage et kiosque de popsicles.</p><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix evenement__prix--gratuit">Jeux gratuits</span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">19&nbsp;h<small> à minuit</small></span>
              <div><h4>Danse country&nbsp;: Winslow Dancers</h4><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix">15&nbsp;$</span>
            </li>
            <li className="evenement" data-cat="autres">
              <span className="evenement__heure">19&nbsp;h</span>
              <div><h4>Bar Country</h4></div>
              <span className="evenement__lieu">Bâtiment 3</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">19&nbsp;h<small> à 21&nbsp;h</small></span>
              <div><h4>Cinéma extérieur familial</h4><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">20&nbsp;h</span>
              <div><h4>Show Lex Roses</h4><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille spectacles">
              <span className="evenement__heure">22&nbsp;h</span>
              <div><h4>Feux d&apos;artifice</h4><span className="etiquette etiquette--famille">Famille</span><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix"></span>
            </li>
          </ul>
        </section>

        <section className="jour" id="jour-ven-17" data-onglet="Ven." data-date="17 juillet" aria-labelledby="t-ven-17">
          <h3 className="jour__titre" id="t-ven-17">Vendredi 17 juillet</h3>
          <ul className="evenements">
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">10&nbsp;h<small> à 21&nbsp;h</small></span>
              <div><h4>Place de la famille</h4><p>Jeux gonflables gratuits, mini-golf (payant), maquillage et popsicles.</p><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix evenement__prix--gratuit">Jeux gratuits</span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">10&nbsp;h&nbsp;30<small> à 15&nbsp;h</small></span>
              <div><h4>Parcel-O-Champs</h4><p>Journée parcelle. Dîner inclus pour les participants.</p><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="animaux">
              <span className="evenement__heure">14&nbsp;h</span>
              <div><h4>Concours de tonte</h4><span className="etiquette etiquette--animaux">Animaux</span></div>
              <span className="evenement__lieu">Tente de jugement</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">15&nbsp;h&nbsp;30</span>
              <div><h4>Ouverture des kiosques</h4><p>Kiosques intérieurs du palais des commerces.</p><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">18&nbsp;h<small> à minuit</small></span>
              <div><h4>Danse country&nbsp;: The Hurricane Dancers</h4><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix">15&nbsp;$</span>
            </li>
            <li className="evenement" data-cat="tire">
              <span className="evenement__heure">18&nbsp;h&nbsp;30</span>
              <div><h4>Tire de tracteurs ASTTQ</h4><p>4x4, Hot Farm, Pro Farm, Pro Stock, Super Stock et semi-remorques. <Link href="/tire-de-tracteurs">Prix et détails de la tire</Link></p><span className="etiquette etiquette--tire">Tire</span></div>
              <span className="evenement__lieu">Terrain de tire</span>
              <span className="evenement__prix">30&nbsp;$ adulte</span>
            </li>
            <li className="evenement" data-cat="autres">
              <span className="evenement__heure">19&nbsp;h</span>
              <div><h4>Bar Country</h4></div>
              <span className="evenement__lieu">Bâtiment 3</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="animaux">
              <span className="evenement__heure">19&nbsp;h&nbsp;30</span>
              <div><h4>Social de club</h4><p>Réservé aux membres des clubs Holstein.</p><span className="etiquette etiquette--animaux">Animaux</span></div>
              <span className="evenement__lieu">Bâtiment 3 (grange 9)</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">21&nbsp;h<small> à minuit</small></span>
              <div><h4>Soirée latino</h4><p>Cours de danse, puis soirée.</p><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Bâtiment 2 (grange 2)</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">22&nbsp;h<small> à minuit</small></span>
              <div><h4>Show That&apos;s Hit</h4><p>Rock des années 60 à 2000.</p><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">Minuit</span>
              <div><h4>Beach Party D.James</h4><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
          </ul>
        </section>

        <section className="jour" id="jour-sam-18" data-onglet="Sam." data-date="18 juillet" aria-labelledby="t-sam-18">
          <h3 className="jour__titre" id="t-sam-18">Samedi 18 juillet</h3>
          <ul className="evenements">
            <li className="evenement" data-cat="animaux">
              <span className="evenement__heure">10&nbsp;h</span>
              <div><h4>Jugement des bovins laitiers</h4><span className="etiquette etiquette--animaux">Animaux</span></div>
              <span className="evenement__lieu">Tente de jugement</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">10&nbsp;h<small> à 21&nbsp;h</small></span>
              <div><h4>Place de la famille</h4><p>Jeux gonflables gratuits, mini-golf (payant), maquillage et popsicles.</p><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix evenement__prix--gratuit">Jeux gratuits</span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">12&nbsp;h<small> à 18&nbsp;h</small></span>
              <div><h4>Agri&apos;Culture</h4><p>Présenté par le Cégep de Lévis.</p><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Bâtiment 2 (grange 2)</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">12&nbsp;h&nbsp;30</span>
              <div><h4>Ouverture des kiosques</h4><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">13&nbsp;h<small> à 1&nbsp;h</small></span>
              <div><h4>12 heures de danse country avec Mathieu Gagné</h4><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix">15&nbsp;$</span>
            </li>
            <li className="evenement" data-cat="tire">
              <span className="evenement__heure">18&nbsp;h</span>
              <div><h4>Tire de tracteurs ASTTQ</h4><p>4x4, Hot Farm, Pro Farm, Pro Stock et semi-remorques. <Link href="/tire-de-tracteurs">Prix et détails de la tire</Link></p><span className="etiquette etiquette--tire">Tire</span></div>
              <span className="evenement__lieu">Terrain de tire</span>
              <span className="evenement__prix">30&nbsp;$ adulte</span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">18&nbsp;h<small> à 20&nbsp;h</small></span>
              <div><h4>Dégustation BBQ Grill Together</h4><p>Une consommation incluse. Profits remis à Entraide-secours.</p><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix">35&nbsp;$</span>
            </li>
            <li className="evenement" data-cat="autres">
              <span className="evenement__heure">19&nbsp;h</span>
              <div><h4>Bar Country</h4></div>
              <span className="evenement__lieu">Bâtiment 3</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="animaux">
              <span className="evenement__heure">20&nbsp;h</span>
              <div><h4>La Championne se paie la traite</h4><p>Pour les éleveurs du jugement, sur invitation.</p><span className="etiquette etiquette--animaux">Animaux</span></div>
              <span className="evenement__lieu"></span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">22&nbsp;h&nbsp;30<small> à minuit</small></span>
              <div><h4>La Grand-Messe</h4><p>Hommage aux succès des Cowboys Fringants.</p><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="spectacles">
              <span className="evenement__heure">Minuit<small> à 2&nbsp;h&nbsp;30</small></span>
              <div><h4>Hit the Road Country</h4><p>Country et danse en ligne, débutants bienvenus.</p><span className="etiquette etiquette--spectacles">Spectacles</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
          </ul>
        </section>

        <section className="jour" id="jour-dim-19" data-onglet="Dim." data-date="19 juillet" aria-labelledby="t-dim-19">
          <h3 className="jour__titre" id="t-dim-19">Dimanche 19 juillet</h3>
          <ul className="evenements">
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">10&nbsp;h<small> à 16&nbsp;h</small></span>
              <div><h4>Place de la famille</h4><p>Jeux gonflables gratuits, mini-golf (payant), maquillage et popsicles.</p><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix evenement__prix--gratuit">Jeux gratuits</span>
            </li>
            <li className="evenement" data-cat="animaux famille">
              <span className="evenement__heure">10&nbsp;h<small> et 13&nbsp;h</small></span>
              <div><h4>Chiens de berger</h4><p>Présentation de travail au troupeau (herding), une heure chaque fois.</p><span className="etiquette etiquette--animaux">Animaux</span><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Terrain de tire</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">10&nbsp;h&nbsp;30</span>
              <div><h4>Ouverture des kiosques</h4><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="autres">
              <span className="evenement__heure">11&nbsp;h</span>
              <div><h4>Messe</h4></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix evenement__prix--gratuit">Gratuit</span>
            </li>
            <li className="evenement" data-cat="kiosques">
              <span className="evenement__heure">11&nbsp;h&nbsp;30<small> à 17&nbsp;h</small></span>
              <div><h4>Agri&apos;Culture</h4><p>Présenté par le Cégep de Lévis.</p><span className="etiquette etiquette--kiosques">Kiosques</span></div>
              <span className="evenement__lieu">Bâtiment 2 (grange 2)</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">11&nbsp;h&nbsp;30<small> à 14&nbsp;h&nbsp;30</small></span>
              <div><h4>Mascottes</h4><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Place de la famille Desjardins</span>
              <span className="evenement__prix"></span>
            </li>
            <li className="evenement" data-cat="famille">
              <span className="evenement__heure">12&nbsp;h<small> à 13&nbsp;h</small></span>
              <div><h4>Pique-nique familial</h4><p>8 hot-dogs, 4 breuvages, 4 desserts et du fromage. Hot-dogs supplémentaires en vente.</p><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Grand chapiteau</span>
              <span className="evenement__prix">20&nbsp;$ par famille</span>
            </li>
            <li className="evenement" data-cat="tire famille">
              <span className="evenement__heure">14&nbsp;h</span>
              <div><h4>Tire de mini-tracteurs Gérard Larochelle</h4><span className="etiquette etiquette--tire">Tire</span><span className="etiquette etiquette--famille">Famille</span></div>
              <span className="evenement__lieu">Aréna</span>
              <span className="evenement__prix">Inscription payante</span>
            </li>
          </ul>
        </section>
        <p className="aucun-resultat" id="aucun-resultat" hidden>Aucune activité de ce type ce jour-là. Essayez un autre jour ou «&nbsp;Tout&nbsp;».</p>
      </div>
    </section>
  
    </>
  );
}
