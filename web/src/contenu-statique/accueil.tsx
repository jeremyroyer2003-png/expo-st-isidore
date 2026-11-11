// Converti automatiquement depuis site/index.html (contenu d'origine du site statique)
import Link from "next/link";

export const meta = { titre: "Expo St-Isidore – Exposition agricole gratuite en Beauce depuis 1983", description: "Expo agricole gratuite à Saint-Isidore, en Beauce : jugements d'animaux, tire de tracteurs, spectacles et activités familiales. Merci pour 2026, on se revoit en juillet 2027. Toute l'année : remisage d'hiver intérieur, location de salle et danse country." };

import ComportementsAccueil from "@/components/site/ComportementsAccueil";

// heros : remplace le héros d'origine (diaporama), pour comparer une autre version (/accueil-v2)
export default function PageAccueil({ heros }: { heros?: React.ReactNode } = {}) {
  return (
    <>
      <ComportementsAccueil />

    {heros ?? (<>
    {/* ===== Héros : diaporama de vraies photos de l'Expo ===== */}
    <div className="une-zone">
      <section className="une" aria-label="À la une">
        {/* Photos de l'ancien site (droits à confirmer) : remplacer le fichier dans images/photos/ */}
        {/* Hiver : une seule image fixe, les bâtiments où dorment les véhicules (le diaporama d'été est caché) */}
        <figure className="une__fixe">
          <img src="/images/photos/terrain-aerien.webp" srcSet="/images/photos/terrain-aerien-800.webp 800w, /images/photos/terrain-aerien.webp 1280w" sizes="100vw" alt="Vue aérienne du site de l'Expo : les bâtiments, les stationnements et les champs autour" width="1280" height="720" />
          <figcaption>Les bâtiments de l&apos;Expo, vus du ciel</figcaption>
        </figure>
        <ul className="une__diapos" aria-label="Photos de l'Expo">
          <li className="une__diapo est-active">
            <img src="/images/photos/tire-poussiere.webp" srcSet="/images/photos/tire-poussiere-800.webp 800w, /images/photos/tire-poussiere.webp 1400w" sizes="100vw" alt="Tracteur vert qui tire la luge dans un nuage de poussière, devant les estrades" width="1600" height="1067" data-legende="Tire de tracteurs ASTTQ, Saint-Isidore" />
          </li>
          <li className="une__diapo">
            <img src="/images/photos/holstein-rubans.webp" srcSet="/images/photos/holstein-rubans-800.webp 800w, /images/photos/holstein-rubans.webp 1400w" sizes="100vw" alt="Des dizaines de rosettes de jugement multicolores alignées sur une table" width="1600" height="1067" loading="lazy" data-legende="Les rosettes du jugement Holstein" />
          </li>
          <li className="une__diapo">
            <img src="/images/photos/spectacle-scene.webp" srcSet="/images/photos/spectacle-scene-800.webp 800w, /images/photos/spectacle-scene.webp 1400w" sizes="100vw" alt="Foule en silhouette devant une scène baignée de lumière rouge" width="1600" height="1065" loading="lazy" data-legende="Spectacle sous le grand chapiteau" />
          </li>
          <li className="une__diapo">
            <img src="/images/photos/kiosques-exterieurs.webp" srcSet="/images/photos/kiosques-exterieurs-800.webp 800w, /images/photos/kiosques-exterieurs.webp 1400w" sizes="100vw" alt="Tracteurs neufs et kiosques d'exposants sous le soleil d'été" width="1600" height="1067" loading="lazy" data-legende="Kiosques extérieurs et machinerie" />
          </li>
        </ul>

        {/* Le héros suit la saison (classe posée dans le <head>) :
             hiver = de la mi-octobre à la mi-mai, le remisage d'abord; été = l'Expo d'abord.
             Sans JavaScript, c'est la version d'hiver qui s'affiche. */}
        <div className="contenu une__contenu une__saison une__saison--hiver">
          <p className="billet"><span>Remisage intérieur</span><span>Entrées en cours</span></p>
          <h1 className="une__titre">Votre roulotte, <span>au sec cet hiver</span></h1>
          <p className="une__intro">Roulottes, VR, autos, bateaux et motos, à l&apos;intérieur des bâtiments de l&apos;Expo. Assuré, plus de 20 ans d&apos;expérience. Il est encore temps cet hiver&nbsp;: envoyez vos dimensions, on regarde l&apos;espace. <strong>Et on se revoit en juillet 2027</strong> pour la 45<sup>e</sup> Expo.</p>
          <div className="groupe-boutons">
            <Link className="bouton bouton--orange" href="/remisage">Envoyer mes dimensions <span className="fleche" aria-hidden="true">→</span></Link>
            <a className="bouton bouton--contour" href="tel:+14188829619">418 882-9619</a>
          </div>
        </div>
        <div className="contenu une__contenu une__saison une__saison--ete">
          <p className="billet"><span>Entrée gratuite</span><span>depuis 1983</span></p>
          <h1 className="une__titre">On se revoit <span>en juillet 2027</span></h1>
          <p className="une__intro">Six jours d&apos;agriculture, de tracteurs et de fête à Saint-Isidore, en Beauce. Les dates 2027 seront annoncées au printemps.</p>
          <div className="groupe-boutons">
            <Link className="bouton bouton--orange" href="/programmation">Voir la programmation <span className="fleche" aria-hidden="true">→</span></Link>
            <Link className="bouton bouton--contour" href="/photos">Revivre 2026 en photos</Link>
          </div>
        </div>

        <div className="une__legende" hidden>
          <p className="une__legende-texte" aria-live="polite"></p>
          <div className="une__points"></div>
          <button className="une__pause" type="button" aria-pressed="false" aria-label="Arrêter le défilement des photos">
            <svg className="icone-pause" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
            <svg className="icone-lecture" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5z" /></svg>
          </button>
        </div>
      </section>

      {/* Moulinet découpé du logo officiel (PNG du site actuel) */}
      <div className="moulinet" aria-hidden="true">
        <div className="moulinet__pales"><img src="/images/moulinet.webp" alt="" width="360" height="360" /></div>
      </div>
    </div>
    </>)}

    {/* ===== Bandeau défilant ===== */}
    <div className="bandeau">
      <div className="bandeau__piste">
        <ul className="bandeau__groupe" aria-label="Activités de l'Expo">
          <li>Nouveau&nbsp;: rodéo<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Tire de tracteurs<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Jugements Holstein<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Beach Party<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Feux d&apos;artifice<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Machinerie agricole<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Chiens de berger<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Mini-ferme<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Bingo<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Dégustations<svg aria-hidden="true" fill="#15202A"><use href="#separateur" /></svg></li>
        </ul>
        {/* Copie identique pour que le défilement boucle sans trou */}
        <ul className="bandeau__groupe" aria-hidden="true">
          <li>Nouveau&nbsp;: rodéo<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Tire de tracteurs<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Jugements Holstein<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Beach Party<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Feux d&apos;artifice<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Machinerie agricole<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Chiens de berger<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Mini-ferme<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Bingo<svg fill="#15202A"><use href="#separateur" /></svg></li>
          <li>Dégustations<svg fill="#15202A"><use href="#separateur" /></svg></li>
        </ul>
      </div>
    </div>

    {/* ===== Toute l'année : hors saison, le remisage passe en premier ===== */}
    <section className="section-papier" aria-labelledby="titre-annee">
      <div className="contenu section-espacee">
        <div className="entete-accueil">
          <h2 id="titre-annee" className="titre-affiche">L&apos;Expo, toute l&apos;année</h2>
          <p>La grande semaine, c&apos;est en juillet. Le reste de l&apos;année, les bâtiments de l&apos;Expo travaillent aussi&nbsp;: remisage, location de salle et danse country.</p>
        </div>

        <div className="portes">
          {/* Hiver : le héros présente déjà le remisage; cette porte explique comment ça marche */}
          <article className="porte porte--remisage porte--etapes">
            <h3>Le remisage, comment ça marche</h3>
            <ol className="etapes-remisage">
              <li><strong>Vous envoyez vos dimensions</strong> en ligne, en deux minutes, ou au téléphone.</li>
              <li><strong>On vous rappelle</strong> avec la place disponible, le tarif au pied et votre date d&apos;entrée.</li>
              <li><strong>Vous arrivez, on mesure</strong>, et votre véhicule dort au sec jusqu&apos;à la mi-mai.</li>
            </ol>
            <div className="groupe-boutons">
              <Link className="bouton bouton--orange" href="/remisage">Envoyer mes dimensions <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="porte porte--remisage porte--remisage-ete">
            <h3>Remisage d&apos;hiver</h3>
            <p>Roulottes, VR, autos, pick-ups, bateaux, motos et Spyder, à l&apos;intérieur, dans les bâtiments de l&apos;Expo. Assuré, plus de 20 ans d&apos;expérience.</p>
            <dl className="porte__faits">
              <div><dt>Entrée</dt><dd>mi-octobre</dd></div>
              <div><dt>Sortie</dt><dd>mi-mai</dd></div>
            </dl>
            <div className="groupe-boutons">
              <Link className="bouton bouton--orange" href="/remisage">Envoyer mes dimensions <span className="fleche" aria-hidden="true">→</span></Link>
              <a className="bouton bouton--contour" href="tel:+14188829619">418 882-9619</a>
            </div>
          </article>

          <article className="porte porte--danse porte--location c-vert">
            <figure className="porte__photo">
              <img src="/images/photos/soiree-saloon-800.webp" srcSet="/images/photos/soiree-saloon-400.webp 400w, /images/photos/soiree-saloon-800.webp 800w" sizes="(max-width: 900px) 100vw, 400px" alt="Le Saloon de la grange 3, façade en bois illuminée de guirlandes le soir" width="800" height="640" loading="lazy" />
            </figure>
            <div className="porte__corps">
              <h3>Louer une salle</h3>
              <p>Toute l&apos;année, le palais des commerces ou le Saloon de la grange 3, avec les tables, les chaises et l&apos;ambiance comprises.</p>
              <Link className="bouton bouton--marine" href="/location">Voir les dates libres <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="porte porte--danse c-jaune">
            <figure className="porte__photo">
              <img src="/images/photos/danse-country-800.webp" srcSet="/images/photos/danse-country-400.webp 400w, /images/photos/danse-country-800.webp 800w" sizes="(max-width: 900px) 100vw, 400px" alt="Danseurs en ligne sous les lustres en roues de charrette d'une grange décorée" width="800" height="532" loading="lazy" />
            </figure>
            <div className="porte__corps">
              <h3>Danse country</h3>
              <p>L&apos;été, danse en ligne dans la grange 2, de 19&nbsp;h à 21&nbsp;h. <strong>20&nbsp;$ la session</strong>, ou un forfait pour le mois ou la saison. Les dates sont annoncées sur Facebook et au bureau, au <a href="tel:+14188825649">418 882-5649</a>.</p>
              <Link className="bouton bouton--marine" href="/danse">Voir les forfaits <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>

        <article className="nouveaute">
          <figure className="nouveaute__photo">
            <img src="/images/photos/rodeo-taureau-600.webp" srcSet="/images/photos/rodeo-taureau-600.webp 600w, /images/photos/rodeo-taureau.webp 1200w" sizes="(max-width: 900px) 100vw, 480px" alt="Un cavalier, une main dans les airs, tient sur un taureau noir qui rue dans la poussière de l'arène" width="600" height="450" loading="lazy" />
            <figcaption>Photo d&apos;illustration&nbsp;: Joey Chacon, Unsplash</figcaption>
          </figure>
          <div className="nouveaute__texte">
            <p className="nouveaute__etiquette">Nouveau en 2027</p>
            <h3>Un rodéo, la semaine avant l&apos;Expo</h3>
            <p>Monte de taureaux, sur le site de l&apos;Expo. Dates et billets annoncés au printemps, avec la programmation.</p>
            <a className="bouton bouton--marine" href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Être avisé sur Facebook <span className="fleche" aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </section>

    {/* ===== Hiver : une seule carte pour la foire de juillet (les deux sections suivantes sont pour l'été) ===== */}
    <section className="section-papier-2 seulement-hiver" aria-labelledby="titre-juillet">
      <div className="contenu section-espacee">
        <article className="juillet">
          <figure className="juillet__photo">
            <img src="/images/photos/holstein-championne-800.webp" srcSet="/images/photos/holstein-championne-800.webp 800w, /images/photos/holstein-championne.webp 1400w" sizes="(max-width: 900px) 100vw, 560px" alt="Deux éleveuses présentent la vache championne Holstein devant la bannière de l'Expo" width="800" height="523" loading="lazy" />
          </figure>
          <div className="juillet__texte">
            <h2 id="titre-juillet" className="titre-affiche">L&apos;Expo, c&apos;est en juillet</h2>
            <p>Six jours d&apos;agriculture, de tracteurs et de fête&nbsp;: jugements Holstein, tire de tracteurs ASTTQ, spectacles sous le chapiteau, kiosques et place de la famille. Entrée gratuite. La programmation 2027 sera dévoilée au printemps.</p>
            <div className="groupe-boutons">
              <Link className="bouton bouton--marine" href="/programmation">L&apos;horaire 2026 <span className="fleche" aria-hidden="true">→</span></Link>
              <Link className="bouton bouton--contour-fonce" href="/photos">Les photos 2026</Link>
            </div>
          </div>
        </article>
      </div>
    </section>

    {/* ===== Choisir son Expo : une couleur du moulinet par ambiance ===== */}
    <section className="section-papier-2 seulement-ete" aria-labelledby="titre-choix">
      <div className="contenu section-espacee">
        <div className="entete-accueil">
          <h2 id="titre-choix" className="titre-affiche">Six jours, cinq ambiances</h2>
          <p>Choisissez ce qui vous allume. Voici ce qu&apos;il y avait en 2026; la programmation 2027 sera dévoilée au printemps.</p>
        </div>

        <div className="choix">
          <div className="choix__onglets" role="tablist" aria-label="Ambiances de l'Expo" hidden>
            <button className="choix__onglet c-vert" type="button" role="tab" id="onglet-animaux" aria-controls="ambiance-animaux" aria-selected="true">Animaux</button>
            <button className="choix__onglet c-orange" type="button" role="tab" id="onglet-tire" aria-controls="ambiance-tire" aria-selected="false" tabIndex={-1}>Tire</button>
            <button className="choix__onglet c-bleu" type="button" role="tab" id="onglet-spectacles" aria-controls="ambiance-spectacles" aria-selected="false" tabIndex={-1}>Spectacles</button>
            <button className="choix__onglet c-jaune" type="button" role="tab" id="onglet-famille" aria-controls="ambiance-famille" aria-selected="false" tabIndex={-1}>Famille</button>
            <button className="choix__onglet choix__onglet--marine c-marine" type="button" role="tab" id="onglet-kiosques" aria-controls="ambiance-kiosques" aria-selected="false" tabIndex={-1}>Kiosques</button>
          </div>

          <article className="choix__panneau c-vert" id="ambiance-animaux" role="tabpanel" aria-labelledby="onglet-animaux">
            <figure className="choix__photo">
              <img src="/images/photos/holstein-championne-800.webp" srcSet="/images/photos/holstein-championne-800.webp 800w, /images/photos/holstein-championne.webp 1400w" sizes="(max-width: 900px) 100vw, 720px" alt="Deux éleveuses présentent la vache championne Holstein devant la bannière de l'Expo" width="800" height="523" loading="lazy" />
              <figcaption>Championne Holstein</figcaption>
            </figure>
            <div className="choix__texte">
              <h3>Les animaux</h3>
              <p>La raison d&apos;être de l&apos;Expo depuis 1983&nbsp;: les éleveurs de la région viennent comparer leur bétail sous la tente de jugement.</p>
              <ul className="choix__liste">
                <li><span className="choix__quand">Jeu. 10&nbsp;h&nbsp;30</span><span className="choix__quoi">Jugement des jeunes éleveurs<small>Tente de jugement</small></span></li>
                <li><span className="choix__quand">Ven. 14&nbsp;h</span><span className="choix__quoi">Concours de tonte<small>Tente de jugement</small></span></li>
                <li><span className="choix__quand">Sam. 10&nbsp;h</span><span className="choix__quoi">Jugement des bovins laitiers<small>Tente de jugement</small></span></li>
                <li><span className="choix__quand">Dim. 10&nbsp;h</span><span className="choix__quoi">Chiens de berger au travail<small>Terrain de tire · gratuit</small></span></li>
              </ul>
              <Link className="bouton bouton--marine" href="/programmation">Toute la programmation <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="choix__panneau c-orange" id="ambiance-tire" role="tabpanel" aria-labelledby="onglet-tire">
            <figure className="choix__photo">
              <img src="/images/photos/tire-semi-nuit-800.webp" srcSet="/images/photos/tire-semi-nuit-800.webp 800w, /images/photos/tire-semi-nuit.webp 1400w" sizes="(max-width: 900px) 100vw, 720px" alt="Camion semi-remorque sous les projecteurs, le soir, devant les estrades pleines" width="800" height="533" loading="lazy" />
              <figcaption>Les semis, à la nuit tombée</figcaption>
            </figure>
            <div className="choix__texte">
              <h3>La tire</h3>
              <p>Deux soirs de compétition ASTTQ&nbsp;: Super Stock, Pro Farm, 4x4 modifiés et semi-remorques, devant des estrades pleines.</p>
              <ul className="choix__liste">
                <li><span className="choix__quand">Ven. 18&nbsp;h&nbsp;30</span><span className="choix__quoi">Tire de tracteurs ASTTQ<small>Terrain de tire · 30&nbsp;$ adulte</small></span></li>
                <li><span className="choix__quand">Sam. 18&nbsp;h</span><span className="choix__quoi">Tire de tracteurs ASTTQ<small>Terrain de tire · 30&nbsp;$ adulte</small></span></li>
                <li><span className="choix__quand">Dim. 14&nbsp;h</span><span className="choix__quoi">Tire de mini-tracteurs Gérard Larochelle<small>Aréna</small></span></li>
              </ul>
              <Link className="bouton bouton--marine" href="/tire-de-tracteurs">Classes, pilotes et billets <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="choix__panneau c-bleu" id="ambiance-spectacles" role="tabpanel" aria-labelledby="onglet-spectacles">
            <figure className="choix__photo">
              <img src="/images/photos/spectacle-foule-800.webp" srcSet="/images/photos/spectacle-foule-800.webp 800w, /images/photos/spectacle-foule.webp 1400w" sizes="(max-width: 900px) 100vw, 720px" alt="Foule devant la scène pendant un spectacle rock en soirée" width="800" height="533" loading="lazy" />
              <figcaption>Le grand chapiteau, en soirée</figcaption>
            </figure>
            <div className="choix__texte">
              <h3>Les soirées</h3>
              <p>Chaque soir sous le grand chapiteau, la plupart gratuits, et de la danse country à l&apos;aréna.</p>
              <ul className="choix__liste">
                <li><span className="choix__quand">Jeu. 20&nbsp;h</span><span className="choix__quoi">Show Lex Roses<small>Grand chapiteau</small></span></li>
                <li><span className="choix__quand">Ven. minuit</span><span className="choix__quoi">Beach Party D.James<small>Grand chapiteau · gratuit</small></span></li>
                <li><span className="choix__quand">Sam. 13&nbsp;h</span><span className="choix__quoi">12 heures de danse country<small>Aréna · 15&nbsp;$</small></span></li>
                <li><span className="choix__quand">Sam. 22&nbsp;h&nbsp;30</span><span className="choix__quoi">La Grand-Messe<small>Grand chapiteau · gratuit</small></span></li>
              </ul>
              <Link className="bouton bouton--marine" href="/programmation">Toute la programmation <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="choix__panneau c-jaune" id="ambiance-famille" role="tabpanel" aria-labelledby="onglet-famille">
            <figure className="choix__photo">
              <img src="/images/photos/petits-animaux-800.webp" srcSet="/images/photos/petits-animaux-800.webp 800w, /images/photos/petits-animaux.webp 1400w" sizes="(max-width: 900px) 100vw, 720px" alt="Chèvres et petit zébu dans un enclos de bois" width="800" height="533" loading="lazy" />
              <figcaption>Les petits animaux</figcaption>
            </figure>
            <div className="choix__texte">
              <h3>En famille</h3>
              <p>La Place de la famille Desjardins&nbsp;: jeux gonflables gratuits, mini-ferme, cinéma en plein air et feux d&apos;artifice.</p>
              <ul className="choix__liste">
                <li><span className="choix__quand">Jeu. au dim.</span><span className="choix__quoi">Jeux gonflables et maquillage<small>Place de la famille · jeux gratuits</small></span></li>
                <li><span className="choix__quand">Jeu. 19&nbsp;h</span><span className="choix__quoi">Cinéma extérieur familial<small>Place de la famille · gratuit</small></span></li>
                <li><span className="choix__quand">Jeu. 22&nbsp;h</span><span className="choix__quoi">Feux d&apos;artifice<small>Place de la famille</small></span></li>
                <li><span className="choix__quand">Dim. 12&nbsp;h</span><span className="choix__quoi">Pique-nique familial<small>Grand chapiteau · 20&nbsp;$ par famille</small></span></li>
              </ul>
              <Link className="bouton bouton--marine" href="/programmation">Toute la programmation <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="choix__panneau c-marine" id="ambiance-kiosques" role="tabpanel" aria-labelledby="onglet-kiosques">
            <figure className="choix__photo">
              <img src="/images/photos/machinerie-exterieure-800.webp" srcSet="/images/photos/machinerie-exterieure-800.webp 800w, /images/photos/machinerie-exterieure.webp 1400w" sizes="(max-width: 900px) 100vw, 720px" alt="Allée de machinerie agricole neuve exposée à l'extérieur" width="800" height="533" loading="lazy" />
              <figcaption>L&apos;allée de la machinerie</figcaption>
            </figure>
            <div className="choix__texte">
              <h3>Les kiosques</h3>
              <p>Concessionnaires, producteurs, artisans et le palais des commerces, du jeudi au dimanche.</p>
              <ul className="choix__liste">
                <li><span className="choix__quand">Jeu. au dim.</span><span className="choix__quoi">Kiosques intérieurs et extérieurs<small>Aréna et terrain</small></span></li>
                <li><span className="choix__quand">Ven. 10&nbsp;h&nbsp;30</span><span className="choix__quoi">Parcel-O-Champs<small>Grand chapiteau · gratuit</small></span></li>
                <li><span className="choix__quand">Sam. et dim.</span><span className="choix__quoi">Agri&apos;Culture<small>Bâtiment 2 (grange 2)</small></span></li>
                <li><span className="choix__quand">Sam. 18&nbsp;h</span><span className="choix__quoi">Dégustation BBQ Grill Together<small>Grand chapiteau · 35&nbsp;$</small></span></li>
              </ul>
              <Link className="bouton bouton--orange" href="/exposants">Réserver un kiosque <span className="fleche" aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>
      </div>
    </section>

    {/* ===== L'été 2026 en images ===== */}
    <section className="section-papier seulement-ete" aria-labelledby="titre-images">
      <div className="contenu section-espacee">
        <div className="entete-accueil">
          <h2 id="titre-images" className="titre-affiche">L&apos;été 2026 en images</h2>
          <Link className="bouton bouton--marine" href="/photos">Tous les albums <span className="fleche" aria-hidden="true">→</span></Link>
        </div>
        <ul className="mosaique">
          <li><Link href="/photos#album-animaux"><img src="/images/photos/holstein-jugement-800.webp" srcSet="/images/photos/holstein-jugement-800.webp 800w, /images/photos/holstein-jugement.webp 1400w" sizes="(max-width: 700px) 100vw, 620px" alt="Juge et éleveurs devant une rangée de vaches Holstein sous la tente" width="800" height="533" loading="lazy" /><span>Jugement Holstein</span></Link></li>
          <li><Link href="/photos#album-soirees"><img src="/images/photos/danse-country-400.webp" srcSet="/images/photos/danse-country-400.webp 400w, /images/photos/danse-country-800.webp 800w" sizes="(max-width: 700px) 50vw, 310px" alt="Danseurs en ligne sous les lumières d'une grange décorée" width="400" height="266" loading="lazy" /><span>Danse country</span></Link></li>
          <li><Link href="/photos#album-tire"><img src="/images/photos/tire-pickups-400.webp" srcSet="/images/photos/tire-pickups-400.webp 400w, /images/photos/tire-pickups-800.webp 800w" sizes="(max-width: 700px) 50vw, 310px" alt="Pick-up modifié en pleine tire sur la piste de terre" width="400" height="267" loading="lazy" /><span>Tire de pick-ups</span></Link></li>
          <li><Link href="/photos#album-animaux"><img src="/images/photos/holstein-rosettes-800.webp" srcSet="/images/photos/holstein-rosettes-800.webp 800w, /images/photos/holstein-rosettes.webp 1400w" sizes="(max-width: 700px) 50vw, 620px" alt="Plaques et rubans de champion aux couleurs de l'Expo" width="800" height="533" loading="lazy" /><span>Rubans de champion</span></Link></li>
          <li><Link href="/photos#album-kiosques"><img src="/images/photos/agroalimentaire-400.webp" srcSet="/images/photos/agroalimentaire-400.webp 400w, /images/photos/agroalimentaire-800.webp 800w" sizes="(max-width: 700px) 50vw, 310px" alt="Animation agroalimentaire : visiteurs autour d'une table d'activités" width="400" height="267" loading="lazy" /><span>Agroalimentaire</span></Link></li>
          <li><Link href="/photos#album-soirees"><img src="/images/photos/chapiteau-foule-400.webp" srcSet="/images/photos/chapiteau-foule-400.webp 400w, /images/photos/chapiteau-foule-800.webp 800w" sizes="(max-width: 700px) 100vw, 310px" alt="Foule rassemblée sous le grand chapiteau, le soir" width="400" height="267" loading="lazy" /><span>Le chapiteau</span></Link></li>
        </ul>
      </div>
    </section>

    {/* ===== Archives et grandes dates ===== */}
    <section className="section-papier-2" aria-labelledby="titre-histoire">
      <div className="contenu section-espacee archives">
        <div className="archives__haut">
          <figure className="archive-photo">
            <span className="archive-photo__ruban archive-photo__ruban--1" aria-hidden="true"></span>
            <span className="archive-photo__ruban archive-photo__ruban--2" aria-hidden="true"></span>
            <div className="archive-photo__papier">
              <img src="/images/archive_holstein2009.webp" alt="Jugement Holstein 2009 : éleveurs en blanc avec deux vaches primées, rubans et trophées" width="1041" height="865" loading="lazy" />
            </div>
            <figcaption>Jugement Holstein 2009. Archives Beauce Média, 15 juillet 2010.</figcaption>
          </figure>
          <div className="archives__texte">
            <h2 id="titre-histoire" className="surtitre">Notre histoire</h2>
            <blockquote className="archives__citation"><p>«&nbsp;Créée par 28 producteurs visionnaires.&nbsp;»</p></blockquote>
            <p>À l&apos;automne 1982, des producteurs de la Beauce, de Lévis et de Dorchester veulent comparer leur bétail. Ils imaginent un «&nbsp;party agricole&nbsp;» ouvert à tous. Plus de 40 ans plus tard, l&apos;idée tient toujours, grâce aux bénévoles.</p>
            <Link className="bouton bouton--marine" href="/histoire">Lire l&apos;histoire et nos bâtisseurs <span className="fleche" aria-hidden="true">→</span></Link>
          </div>
        </div>

        <ol className="annees" aria-label="Grandes dates">
          <li className="c-orange"><strong>1983</strong><span>Lettres patentes et premier bureau, présidé par Odilon Pelchat</span></li>
          <li className="c-vert"><strong>1984</strong><span>Quatre nouvelles étables</span></li>
          <li className="c-jaune"><strong>1991</strong><span>Construction du palais des commerces</span></li>
          <li className="c-bleu"><strong>2010</strong><span>Premiers manèges de l&apos;histoire de l&apos;Expo</span></li>
          <li className="c-marine"><strong>2026</strong><span>44<sup>e</sup> édition, toujours gratuite</span></li>
        </ol>
      </div>
    </section>

    {/* ===== Venir à l'Expo ===== */}
    <section className="section-papier" aria-labelledby="titre-venir">
      <div className="contenu section-espacee venir">
        <figure className="venir__photo">
          <img src="/images/photos/terrain-aerien-800.webp" srcSet="/images/photos/terrain-aerien-800.webp 800w, /images/photos/terrain-aerien.webp 1280w" sizes="(max-width: 900px) 100vw, 700px" alt="Vue aérienne du site de l'Expo : bâtiments, chapiteaux blancs, terrain de tire et stationnements entourés de champs" width="800" height="450" loading="lazy" />
          <figcaption>Le site de l&apos;Expo vu du ciel</figcaption>
        </figure>
        <div className="venir__texte">
          <h2 id="titre-venir" className="titre-affiche">Venir à l&apos;Expo</h2>
          <address className="venir__adresse">132, route Coulombe<small>Saint-Isidore (Québec) G0S 2S0, en Beauce</small></address>
          <ul className="venir__faits">
            <li className="c-vert">Entrée gratuite sur le site</li>
            <li className="c-orange">Stationnement payant, à proximité</li>
            <li className="c-bleu">Certaines activités payantes&nbsp;: tire, danse, souper</li>
            <li className="c-jaune">Chiens permis en laisse</li>
            <li className="c-vert">Aire de pique-nique, casse-croûte et camion de rue</li>
          </ul>
          <div className="groupe-boutons">
            <a className="bouton bouton--orange" href="https://www.google.com/maps/search/?api=1&query=132+route+Coulombe+Saint-Isidore+QC+G0S+2S0" rel="noopener">Itinéraire <span className="fleche" aria-hidden="true">→</span></a>
            <Link className="bouton bouton--marine" href="/contact#visiter">Infos pratiques</Link>
          </div>
        </div>
      </div>
    </section>

  
    </>
  );
}
