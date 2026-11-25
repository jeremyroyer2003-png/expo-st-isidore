// Converti automatiquement depuis site/programmation.html (contenu d'origine du site statique)
import Programmation from "@/components/programmation/Programmation";
import PhotoVivante from "@/components/site/PhotoVivante";
import type { Evenement } from "@/lib/donnees";

export const meta = { titre: "Programmation – spectacles, jugements, tire et famille | Expo St-Isidore", description: "La programmation de l'Expo St-Isidore jour par jour : spectacles, jugements d'animaux, tire de tracteurs et activités familiales. Programmation 2027 à venir." };

export default function PageProgrammation({ annee, evenements }: { annee: number; evenements: Evenement[] }) {
  return (
    <>

    {/* ===== Héros ===== */}
    <section className="heros heros--page heros--video" aria-labelledby="titre-heros">
      {/* Une vache et son veau, couchés dans la paille, à droite; le texte reste à gauche */}
      <figure className="heros__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/photos/vache-veau.webp" srcSet="/images/photos/vache-veau-800.webp 800w, /images/photos/vache-veau.webp 1600w" sizes="(max-width: 760px) 100vw, 64vw" alt="Une vache Holstein couchée dans la paille d'une grange, son veau endormi contre elle, dans un rayon de soleil" width={1600} height={1075} fetchPriority="high" />
        <PhotoVivante video="/videos/vache-veau.mp4" />
        <span className="heros__voile" aria-hidden="true" />
      </figure>
      <div className="contenu heros__grille heros__grille--texte">
        <div className="heros__texte">
          <p className="billet"><span>Entrée gratuite</span><span>Prochaine&nbsp;: juillet 2027</span></p>
          <h1 id="titre-heros" className="heros__titre"><span>Programmation</span></h1>
          <p className="heros__intro">L&apos;horaire 2026, jour par jour, en attendant celui de 2027. Choisissez un jour, ou un type d&apos;activité pour voir toute la semaine.</p>
        </div>
      </div>
    </section>

    {/* ===== Horaire ===== */}
    <section id="horaire" className="section-papier" aria-labelledby="titre-horaire">
      <div className="contenu section-espacee">
        <div className="avis-bandeau masque-pendant-expo" role="note">
          <div>
            <strong>La programmation 2027 s&apos;en vient</strong>
            <p>Elle sera dévoilée au printemps, avec une nouveauté&nbsp;: <strong>un rodéo, la semaine avant l&apos;Expo</strong>. D&apos;ici là, voici celle de 2026, à titre de référence.</p>
          </div>
          <a className="bouton bouton--marine" href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Suivre l&apos;Expo sur Facebook</a>
        </div>

        <h2 id="titre-horaire" className="titre-affiche titre-archive espace-bas masque-pendant-expo">L&apos;horaire {annee}, pour vous donner une idée</h2>

        <p className="note-prix masque-pendant-expo">Les prix sont indiqués quand ils avaient été publiés pour 2026. Aucune activité n&apos;avait été publiée le mercredi.</p>
<p className="note-avant"><strong>Avant l&apos;Expo, le samedi 11 juillet 2026&nbsp;:</strong> tournoi de balle Conrad Fauchon, de 8&nbsp;h&nbsp;30 à 18&nbsp;h, au terrain de balle.</p>
        <Programmation annee={annee} evenements={evenements} />

      </div>
    </section>
  
    </>
  );
}
