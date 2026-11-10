// Converti automatiquement depuis site/photos.html (contenu d'origine du site statique)

export const meta = { titre: "Photos – tire, jugements, spectacles et kiosques | Expo St-Isidore", description: "Les photos de l'Expo St-Isidore : tire de tracteurs, jugements Holstein, spectacles sous le chapiteau, kiosques et machinerie." };

import Galerie from "@/components/photos/Galerie";
import { ALBUMS } from "@/lib/albums";
import type { Media } from "@/lib/donnees";

export default function PagePhotos({ medias }: { medias: Media[] }) {
  const albums = [...new Set(medias.filter((m) => m.type === "photo").map((m) => m.categorie))].sort(
    (a, b) => Object.keys(ALBUMS).indexOf(a) - Object.keys(ALBUMS).indexOf(b),
  );
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
          <p className="heros__intro">Tire, jugements, spectacles, kiosques et vidéos. Sélectionnez une photo pour l&apos;agrandir.</p>
          <nav aria-label="Albums" className="groupe-boutons">
            {albums.map((al) => <a key={al} className="bouton bouton--contour" href={`#album-${al}`}>{ALBUMS[al] ?? al}</a>)}
            {medias.some((m) => m.type === "video") && <a className="bouton bouton--contour" href="#album-videos">Vidéos</a>}
          </nav>
        </div>
      </div>
    </section>

    <section className="section-papier" aria-label="Albums photos">
      <div className="contenu section-espacee">
        <Galerie medias={medias} />
        <p className="credits">Photos&nbsp;: ELZEPHOTO, Lyse Neuville Photography, Cynthia Fillion Photographe, tirsQC.com et archives de l&apos;Expo. Certaines photos de tire ont été prises à d&apos;autres événements de l&apos;ASTTQ. Des centaines d&apos;autres photos dans les <a href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">albums Facebook de l&apos;Expo</a>.</p>
      </div>
    </section>

    
  
    </>
  );
}
