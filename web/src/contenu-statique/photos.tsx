// Converti automatiquement depuis site/photos.html (contenu d'origine du site statique)

export const meta = { titre: "Photos – tire, jugements, spectacles et kiosques | Expo St-Isidore", description: "Les photos de l'Expo St-Isidore : tire de tracteurs, jugements Holstein, spectacles sous le chapiteau, kiosques et machinerie." };

export default function PagePhotos() {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page" aria-labelledby="titre-heros">
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <h1 id="titre-heros" className="heros__titre">
            <span>Photos</span>
          </h1>
        </div>
        <div className="heros__cote">
          <p className="heros__intro">Tire, jugements, spectacles et kiosques. Sélectionnez une photo pour l&apos;agrandir.</p>
          <nav aria-label="Albums" className="groupe-boutons">
            <a className="bouton bouton--contour" href="#album-tire">Tire de tracteurs</a>
            <a className="bouton bouton--contour" href="#album-animaux">Jugements et animaux</a>
            <a className="bouton bouton--contour" href="#album-soirees">Spectacles et soirées</a>
            <a className="bouton bouton--contour" href="#album-kiosques">Kiosques et machinerie</a>
          </nav>
        </div>
      </div>
    </section>

    <section className="section-papier" aria-label="Albums photos">
      <div className="contenu section-espacee">
        <section className="galerie-section" id="album-tire" aria-labelledby="t-tire">
          <div className="galerie-section__titre"><h2 id="t-tire">Tire de tracteurs</h2><span>13 photos</span></div>
          <ul className="galerie">
            <li><a href="/images/photos/tire-foule.webp"><img src="/images/photos/tire-foule-800.webp" srcSet="/images/photos/tire-foule-400.webp 400w, /images/photos/tire-foule-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur vert qui tire le traîneau devant des estrades remplies, en plein jour" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-nuit.webp"><img src="/images/photos/tire-nuit-800.webp" srcSet="/images/photos/tire-nuit-400.webp 400w, /images/photos/tire-nuit-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur vert crachant une fumée noire, le soir, sous les projecteurs" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-giroux-express.webp"><img src="/images/photos/tire-giroux-express-800.webp" srcSet="/images/photos/tire-giroux-express-400.webp 400w, /images/photos/tire-giroux-express-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Giroux Express, John Deere vert de classe Super Stock, en pleine tire" width="800" height="534" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-semi-racicot.webp"><img src="/images/photos/tire-semi-racicot-800.webp" srcSet="/images/photos/tire-semi-racicot-400.webp 400w, /images/photos/tire-semi-racicot-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Camion semi Freightliner rouge de Mario Racicot dans un nuage de fumée, au Grand National de St-Hyacinthe (2018)" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-semi-nuit.webp"><img src="/images/photos/tire-semi-nuit-800.webp" srcSet="/images/photos/tire-semi-nuit-400.webp 400w, /images/photos/tire-semi-nuit-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Camion semi sous les projecteurs, le soir, devant la foule" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-pro-farm.webp"><img src="/images/photos/tire-pro-farm-800.webp" srcSet="/images/photos/tire-pro-farm-400.webp 400w, /images/photos/tire-pro-farm-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur rouge de classe Pro Farm qui tire, fumée noire, foule en arrière-plan" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-rouge.webp"><img src="/images/photos/tire-rouge-800.webp" srcSet="/images/photos/tire-rouge-400.webp 400w, /images/photos/tire-rouge-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur rouge qui avance avec le traîneau, en plein jour" width="800" height="500" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-poussiere.webp"><img src="/images/photos/tire-poussiere-800.webp" srcSet="/images/photos/tire-poussiere-400.webp 400w, /images/photos/tire-poussiere-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur vert qui soulève la terre de la piste" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-modifie.webp"><img src="/images/photos/tire-modifie-800.webp" srcSet="/images/photos/tire-modifie-400.webp 400w, /images/photos/tire-modifie-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur modifié bleu aux roues géantes devant les estrades" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-mini.webp"><img src="/images/photos/tire-mini-800.webp" srcSet="/images/photos/tire-mini-400.webp 400w, /images/photos/tire-mini-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Mini tracteur modifié qui projette de la terre" width="800" height="534" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-pickups.webp"><img src="/images/photos/tire-pickups-800.webp" srcSet="/images/photos/tire-pickups-400.webp 400w, /images/photos/tire-pickups-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Pick-up modifié qui tire le traîneau, spectateurs en arrière-plan" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-toy-farmer.webp"><img src="/images/photos/tire-toy-farmer-800.webp" srcSet="/images/photos/tire-toy-farmer-400.webp 400w, /images/photos/tire-toy-farmer-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tracteur Toy Farmer en action, fumée noire" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/tire-sgt-slaughter.webp"><img src="/images/photos/tire-sgt-slaughter-800.webp" srcSet="/images/photos/tire-sgt-slaughter-400.webp 400w, /images/photos/tire-sgt-slaughter-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Mini tracteur Sgt. Slaughter, roues avant levées, sous les projecteurs" width="800" height="533" loading="lazy" /></a></li>
          </ul>
        </section>
        <section className="galerie-section" id="album-animaux" aria-labelledby="t-animaux">
          <div className="galerie-section__titre"><h2 id="t-animaux">Jugements et animaux</h2><span>7 photos</span></div>
          <ul className="galerie galerie--bande">
            <li><a href="/images/photos/holstein-championne.webp"><img src="/images/photos/holstein-championne-800.webp" srcSet="/images/photos/holstein-championne-400.webp 400w, /images/photos/holstein-championne-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Éleveuses en blanc avec une vache Holstein primée, devant l'affiche de l'Expo" width="800" height="523" loading="lazy" /></a></li>
            <li><a href="/images/photos/holstein-jugement.webp"><img src="/images/photos/holstein-jugement-800.webp" srcSet="/images/photos/holstein-jugement-400.webp 400w, /images/photos/holstein-jugement-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Éleveurs en blanc qui présentent leurs vaches Holstein dans l'arène" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/holstein-alignement.webp"><img src="/images/photos/holstein-alignement-800.webp" srcSet="/images/photos/holstein-alignement-400.webp 400w, /images/photos/holstein-alignement-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Rangée de vaches Holstein sous le chapiteau, devant le public" width="800" height="459" loading="lazy" /></a></li>
            <li><a href="/images/photos/holstein-rubans.webp"><img src="/images/photos/holstein-rubans-800.webp" srcSet="/images/photos/holstein-rubans-400.webp 400w, /images/photos/holstein-rubans-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Rosettes et rubans de champion alignés sur une table" width="800" height="534" loading="lazy" /></a></li>
            <li><a href="/images/photos/holstein-rosettes.webp"><img src="/images/photos/holstein-rosettes-800.webp" srcSet="/images/photos/holstein-rosettes-400.webp 400w, /images/photos/holstein-rosettes-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Rosettes de l'Expo St-Isidore, rouge, blanc et bleu" width="800" height="534" loading="lazy" /></a></li>
            <li><a href="/images/photos/jugement-volailles.webp"><img src="/images/photos/jugement-volailles-800.webp" srcSet="/images/photos/jugement-volailles-400.webp 400w, /images/photos/jugement-volailles-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Juge et exposantes discutent près des cages, dans une grange" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/petits-animaux.webp"><img src="/images/photos/petits-animaux-800.webp" srcSet="/images/photos/petits-animaux-400.webp 400w, /images/photos/petits-animaux-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Bovin brun et chèvres dans un enclos de la grange des petits animaux" width="800" height="533" loading="lazy" /></a></li>
          </ul>
        </section>
        <section className="galerie-section" id="album-soirees" aria-labelledby="t-soirees">
          <div className="galerie-section__titre"><h2 id="t-soirees">Spectacles et soirées</h2><span>7 photos</span></div>
          <ul className="galerie galerie--bande">
            <li><a href="/images/photos/spectacle-scene.webp"><img src="/images/photos/spectacle-scene-800.webp" srcSet="/images/photos/spectacle-scene-400.webp 400w, /images/photos/spectacle-scene-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Chanteur sur scène sous des lumières rouges, foule devant" width="800" height="532" loading="lazy" /></a></li>
            <li><a href="/images/photos/spectacle-foule.webp"><img src="/images/photos/spectacle-foule-800.webp" srcSet="/images/photos/spectacle-foule-400.webp 400w, /images/photos/spectacle-foule-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Foule les bras levés devant la scène du grand chapiteau" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/spectacle-chapiteau.webp"><img src="/images/photos/spectacle-chapiteau-800.webp" srcSet="/images/photos/spectacle-chapiteau-400.webp 400w, /images/photos/spectacle-chapiteau-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Chanteuse sur la scène du chapiteau, éclairage de spectacle" width="800" height="532" loading="lazy" /></a></li>
            <li><a href="/images/photos/danse-country.webp"><img src="/images/photos/danse-country-800.webp" srcSet="/images/photos/danse-country-400.webp 400w, /images/photos/danse-country-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Danseurs de country en ligne dans l'aréna décoré" width="800" height="532" loading="lazy" /></a></li>
            <li><a href="/images/photos/chapiteau-foule.webp"><img src="/images/photos/chapiteau-foule-800.webp" srcSet="/images/photos/chapiteau-foule-400.webp 400w, /images/photos/chapiteau-foule-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Foule dense sous le grand chapiteau blanc" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/chapiteau-public.webp"><img src="/images/photos/chapiteau-public-800.webp" srcSet="/images/photos/chapiteau-public-400.webp 400w, /images/photos/chapiteau-public-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Messe du dimanche sous le grand chapiteau, public assis" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/soiree-saloon.webp"><img src="/images/photos/soiree-saloon-800.webp" srcSet="/images/photos/soiree-saloon-400.webp 400w, /images/photos/soiree-saloon-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Façade de saloon illuminée, le soir, avec des visiteurs" width="800" height="640" loading="lazy" /></a></li>
          </ul>
        </section>
        <section className="galerie-section" id="album-kiosques" aria-labelledby="t-kiosques">
          <div className="galerie-section__titre"><h2 id="t-kiosques">Kiosques et machinerie</h2><span>5 photos</span></div>
          <ul className="galerie">
            <li><a href="/images/photos/kiosques-interieurs.webp"><img src="/images/photos/kiosques-interieurs-800.webp" srcSet="/images/photos/kiosques-interieurs-400.webp 400w, /images/photos/kiosques-interieurs-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Allée de kiosques intérieurs animée dans le palais des commerces" width="800" height="532" loading="lazy" /></a></li>
            <li><a href="/images/photos/machinerie-exterieure.webp"><img src="/images/photos/machinerie-exterieure-800.webp" srcSet="/images/photos/machinerie-exterieure-400.webp 400w, /images/photos/machinerie-exterieure-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Allée de machinerie agricole neuve exposée à l'extérieur" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/kiosques-exterieurs.webp"><img src="/images/photos/kiosques-exterieurs-800.webp" srcSet="/images/photos/kiosques-exterieurs-400.webp 400w, /images/photos/kiosques-exterieurs-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Tentes et machinerie colorée sous les arbres" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/agroalimentaire.webp"><img src="/images/photos/agroalimentaire-800.webp" srcSet="/images/photos/agroalimentaire-400.webp 400w, /images/photos/agroalimentaire-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Exposante qui présente ses produits à un kiosque agroalimentaire" width="800" height="533" loading="lazy" /></a></li>
            <li><a href="/images/photos/kiosques-allee.webp"><img src="/images/photos/kiosques-allee-800.webp" srcSet="/images/photos/kiosques-allee-400.webp 400w, /images/photos/kiosques-allee-800.webp 800w" sizes="(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px" alt="Longue allée de kiosques intérieurs, vue en hauteur" width="532" height="800" loading="lazy" /></a></li>
          </ul>
        </section>
        <p className="credits">Photos&nbsp;: ELZEPHOTO, Lyse Neuville Photography, Cynthia Fillion Photographe, tirsQC.com et archives de l&apos;Expo. Certaines photos de tire ont été prises à d&apos;autres événements de l&apos;ASTTQ. Des centaines d&apos;autres photos dans les <a href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">albums Facebook de l&apos;Expo</a>.</p>
      </div>
    </section>

    {/* Visionneuse (photo agrandie) */}
    <dialog className="visionneuse" id="visionneuse" aria-label="Photo agrandie">
      <figure>
        <img alt="" />
        <figcaption></figcaption>
      </figure>
      <div className="visionneuse__barre">
        <button type="button" data-action="precedente" aria-label="Photo précédente">← Précédente</button>
        <button type="button" data-action="fermer">Fermer</button>
        <button type="button" data-action="suivante" aria-label="Photo suivante">Suivante →</button>
      </div>
    </dialog>
  
    </>
  );
}
