// Converti automatiquement depuis site/programmation.html (contenu d'origine du site statique)
import Programmation from "@/components/programmation/Programmation";
import type { Evenement } from "@/lib/donnees";

export const meta = { titre: "Programmation – spectacles, jugements, tire et famille | Expo St-Isidore", description: "La programmation de l'Expo St-Isidore jour par jour : spectacles, jugements d'animaux, tire de tracteurs et activités familiales. Programmation 2027 à venir." };

export default function PageProgrammation({ annee, evenements }: { annee: number; evenements: Evenement[] }) {
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

        <h2 id="titre-horaire" className="titre-affiche titre-archive espace-bas">L&apos;horaire {annee}, pour vous donner une idée</h2>

        <p className="note-prix">Les prix sont indiqués quand ils avaient été publiés pour 2026. Aucune activité n&apos;avait été publiée le mercredi.</p>
<p className="note-avant"><strong>Avant l&apos;Expo, le samedi 11 juillet 2026&nbsp;:</strong> tournoi de balle Conrad Fauchon, de 8&nbsp;h&nbsp;30 à 18&nbsp;h, au terrain de balle.</p>
        <Programmation annee={annee} evenements={evenements} />

      </div>
    </section>
  
    </>
  );
}
