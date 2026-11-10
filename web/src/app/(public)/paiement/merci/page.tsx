import type { Metadata } from "next";
import Link from "next/link";
import { finaliserSession, type Recapitulatif } from "@/lib/paiements";

export const metadata: Metadata = { title: "Merci pour votre paiement", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const { session } = await searchParams;
  let recap: Recapitulatif | null = null;
  if (session && /^cs_test_[A-Za-z0-9]+$/.test(session)) {
    try {
      recap = await finaliserSession(session);
    } catch (e) {
      console.error("[paiement/merci]", e);
    }
  }

  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Paiement</span><span>{recap ? "Reçu" : "À vérifier"}</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>{recap?.titre ?? "Merci!"}</span></h1>
          </div>
        </div>
      </section>
      <section className="section-papier">
        <div className="contenu section-espacee">
          <div className="anim-monter max-w-[640px] bg-creme cadre-affiche p-6 sm:p-8 relative">
            {recap ? (
              <>
                {recap.lignes.length > 0 && (
                  <dl className="grid gap-2 mb-5 border-y-2 border-dashed border-encre py-4">
                    {recap.lignes.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 text-[18px]">
                        <dt className="text-gris-brun">{k}</dt>
                        <dd className="font-bold text-encre text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="text-[18px]">{recap.message}</p>
                <p className="tampon-paye" aria-hidden="true">Payé</p>
              </>
            ) : (
              <p className="text-[18px]">On n&apos;a pas pu vérifier ce paiement. Si votre carte a été débitée, vous recevrez une confirmation par courriel; sinon, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p>
            )}
            <p className="mt-6"><Link className="bouton bouton--marine" href="/">Retour à l&apos;accueil</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
