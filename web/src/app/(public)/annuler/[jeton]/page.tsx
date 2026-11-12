import type { Metadata } from "next";
import { annulerParClient, trouverAnnulation } from "@/actions/annulation";
import { argent } from "@/lib/format";

export const metadata: Metadata = { title: "Annuler ma réservation", robots: { index: false } };
export const dynamic = "force-dynamic";

// Page du lien « Gérer ou annuler ma réservation » du courriel de confirmation de salle.
export default async function Page({ params, searchParams }: { params: Promise<{ jeton: string }>; searchParams: Promise<{ fait?: string; erreur?: string }> }) {
  const { jeton } = await params;
  const { fait, erreur } = await searchParams;
  const a = await trouverAnnulation(jeton);
  const titre = a.etat === "annulable" ? ["Annuler ma", "réservation"] : a.etat === "deja-annulee" ? ["Réservation", "annulée"] : ["Lien", "inactif"];

  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Location de salle</span><span>Expo St-Isidore</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>{titre[0]}</span> <span className="jaune">{titre[1]}</span></h1>
          </div>
        </div>
      </section>
      <section className="section-papier">
        <div className="contenu section-espacee">
          <div className="anim-monter max-w-[640px] bg-creme cadre-affiche p-6 sm:p-8">
            {a.etat === "invalide" ? (
              <p className="text-[18px]">Ce lien ne correspond à aucune réservation. Appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
            ) : (
              <>
                {fait && a.etat === "deja-annulee" && (
                  <p role="status" className="mb-5 border-[3px] border-encre bg-olive px-4 py-3 font-semibold text-encre">
                    C&apos;est fait : votre réservation est annulée et la confirmation part par courriel.
                  </p>
                )}
                {erreur && (
                  <p role="alert" className="mb-5 border-[3px] border-encre bg-kraft px-4 py-3 font-semibold text-rouge">
                    L&apos;annulation n&apos;a pas fonctionné. Rien n&apos;a été changé. Réessayez ou appelez le bureau au 418 882-5649.
                  </p>
                )}
                <p className="font-etiquette font-bold uppercase tracking-widest text-[15px] text-gris-brun">Bonjour {a.nom}</p>
                <h2 className="font-affiche text-[26px] text-encre mt-1">{a.salle}</h2>
                <p className="text-[18px] mt-1 first-letter:uppercase">{a.date}, {a.heures}</p>

                <dl className="border-y-2 border-dashed border-encre py-4 my-5 grid gap-2 text-[18px]">
                  <div className="flex justify-between gap-4"><dt className="text-gris-brun">Montant payé</dt><dd>{argent(a.paye)}</dd></div>
                  {a.etat !== "deja-annulee" && (
                    <div className="flex justify-between gap-4"><dt className="text-gris-brun">Frais d&apos;annulation</dt><dd>− {argent(a.frais)}</dd></div>
                  )}
                  <div className="flex justify-between gap-4 items-baseline">
                    <dt className="text-gris-brun">{a.etat === "deja-annulee" ? "Remboursé" : "Vous serez remboursé"}</dt>
                    <dd className="font-affiche text-[32px] text-rouge">{argent(a.rembourse)}</dd>
                  </div>
                </dl>

                {a.etat === "annulable" && (
                  <form action={annulerParClient} className="grid gap-4">
                    <input type="hidden" name="jeton" value={jeton} />
                    <label className="flex items-start gap-3 text-[17px] min-h-[44px]">
                      <input type="checkbox" name="confirme" value="oui" required className="mt-1 h-5 w-5" />
                      <span>Je veux annuler ma réservation. La date sera offerte à d&apos;autres.</span>
                    </label>
                    <button type="submit" className="bouton bouton--orange bouton--grand justify-self-start">Oui, annuler ma réservation</button>
                    <p className="note">Annulation en ligne possible jusqu&apos;au {a.limite}. Le remboursement apparaît sur votre carte d&apos;ici 5 à 10 jours ouvrables. Pour changer de date plutôt qu&apos;annuler, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
                  </form>
                )}
                {a.etat === "trop-tard" && (
                  <p className="text-[18px]">L&apos;annulation en ligne était possible jusqu&apos;au {a.limite}. Appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
                )}
                {a.etat === "deja-annulee" && !fait && (
                  <p className="text-[18px]">Cette réservation est déjà annulée. Questions? Bureau : <a href="tel:+14188825649">418 882-5649</a>.</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
