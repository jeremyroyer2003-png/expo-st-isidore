import type { Metadata } from "next";
import { payerParJeton, trouverAPayer } from "@/actions/paiement";
import { argent } from "@/lib/format";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const a = await trouverAPayer(jeton);

  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Paiement sécurisé</span><span>Stripe</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>{a ? "Il reste" : "Lien"}</span> <span className="jaune">{a ? "à payer" : "inactif"}</span></h1>
          </div>
        </div>
      </section>
      <section className="section-papier">
        <div className="contenu section-espacee">
          <div className="anim-monter max-w-[640px] bg-creme cadre-affiche p-6 sm:p-8">
            {a ? (
              <form action={payerParJeton}>
                <input type="hidden" name="jeton" value={jeton} />
                <p className="font-etiquette font-bold uppercase tracking-widest text-[15px] text-gris-brun">Bonjour {a.nom}</p>
                <h2 className="font-affiche text-[26px] text-encre mt-1">{a.libelle}</h2>
                <p className="text-[18px] mt-1">{a.description}</p>
                <p className="flex items-baseline justify-between border-y-2 border-dashed border-encre py-4 my-5">
                  <span className="text-[18px] text-gris-brun">{a.type === "remisage" ? "Dépôt pour garder votre place" : "Montant"}</span>
                  <span className="font-affiche text-[36px] text-rouge">{argent(a.montant)}</span>
                </p>
                <button type="submit" className="bouton bouton--orange bouton--grand">Payer {argent(a.montant)}</button>
                <p className="note mt-3">Vous serez dirigé vers la page de paiement sécurisée de Stripe.</p>
              </form>
            ) : (
              <p className="text-[18px]">Ce lien n&apos;a plus rien à payer : soit le paiement est déjà fait, soit la demande a changé. Questions? Bureau : <a href="tel:+14188825649">418 882-5649</a> · Remisage : <a href="tel:+14188829619">418 882-9619</a>.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
