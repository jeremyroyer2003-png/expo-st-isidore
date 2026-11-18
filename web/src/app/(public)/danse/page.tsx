import type { Metadata } from "next";
import FormulaireDanse, { type Forfait } from "@/components/reservation/FormulaireDanse";
import { contenu, prixPublics } from "@/lib/donnees";
import { argent } from "@/lib/format";
import { estHiver } from "@/lib/saison";

export const metadata: Metadata = {
  title: "Danse country en ligne – grange 2, l'été",
  description: "Danse country en ligne à l'Expo St-Isidore, dans la grange 2, de 19 h à 21 h, l'été. 20 $ la session, ou un forfait pour le mois ou la saison.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const [prix, horaire, dates] = await Promise.all([
    prixPublics("danse"),
    contenu("danse_horaire", "Grange 2, de 19 h à 21 h, l'été."),
    contenu("danse_dates", "Les dates sont annoncées sur Facebook et au bureau, au 418 882-5649."),
  ]);
  const forfaits: Forfait[] = prix.length
    ? prix.map((p) => ({ cle: p.cle, libelle: p.libelle, description: p.description, prix: p.visible ? p.montant_cents : null, fictif: p.a_confirmer }))
    // Sans base de données : seul le prix confirmé (20 $ la session) est connu
    : [{ cle: "danse_session", libelle: "Une session", description: "Une soirée de danse country en ligne, de 19 h à 21 h", prix: null, fictif: false }];
  // Prix de la session : celui de la base s'il est confirmé, sinon le tarif connu (20 $)
  const session = forfaits.find((f) => f.cle === "danse_session" && f.prix != null && !f.fictif);
  const prixSession = session ? argent(session.prix!) : "20 $";
  // Hors saison : pas de paiement en ligne sans dates
  const fermee = estHiver();

  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>L&apos;été</span><span>Grange 2</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>Danse</span> <span className="jaune">country</span></h1>
          </div>
          <div className="heros__cote">
            <p className="heros__intro">Danse country en ligne. {horaire} <strong>{prixSession.replace(" ", "\u00a0")} la session</strong>, ou un forfait pour le mois ou la saison. {dates}</p>
            <div className="groupe-boutons">
              <a className="bouton bouton--orange" href="#forfaits">{fermee ? "Voir les forfaits" : "Choisir un forfait"} <span className="fleche" aria-hidden="true">→</span></a>
              <a className="bouton bouton--contour" href="https://www.facebook.com/expostisidorebassinchaudiere/" rel="noopener">Les dates sur Facebook</a>
            </div>
          </div>
        </div>
      </section>

      <section id="forfaits" className="section-papier" aria-labelledby="titre-forfaits">
        <div className="contenu section-espacee">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start mb-10">
            <figure className="tirage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/photos/danse-country-800.webp" alt="Danseurs en ligne sous les lustres en roues de charrette d'une grange décorée" width={800} height={532} loading="lazy" />
              <figcaption>Soirée de danse country à l&apos;Expo</figcaption>
            </figure>
            <div className="entete-section">
              <h2 id="titre-forfaits" className="titre-affiche">Les<br />forfaits</h2>
              <p>Payez en ligne et présentez votre nom à l&apos;entrée. La saison dure environ trois mois; il n&apos;y a pas de forfait à l&apos;année.</p>
            </div>
          </div>
          <FormulaireDanse forfaits={forfaits} fermee={fermee} />
        </div>
      </section>
    </>
  );
}
