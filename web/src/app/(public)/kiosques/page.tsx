import type { Metadata } from "next";
import Link from "next/link";
import FormulaireSimple from "@/components/formulaires/FormulaireSimple";
import PlanPalais, { type EmplacementPublic } from "@/components/reservation/PlanPalais";
import { demanderKiosqueExterieur } from "@/actions/reservations";
import { contenu, prixPublics } from "@/lib/donnees";
import { argent } from "@/lib/format";
import { supabaseConfigure } from "@/lib/env";
import { supabasePublic } from "@/lib/supabase/serveur";

export const metadata: Metadata = {
  title: "Kiosques – choisir son emplacement au palais des commerces",
  description: "Réservez votre kiosque à l'Expo St-Isidore : choisissez un emplacement sur le plan du palais des commerces, ou demandez un kiosque extérieur.",
};

export const dynamic = "force-dynamic";

/** L'Expo a lieu en juillet : après juillet, on réserve pour l'année suivante. */
function anneeExpo() {
  const d = new Date();
  return d.getMonth() > 6 ? d.getFullYear() + 1 : d.getFullYear();
}

export default async function Page() {
  const annee = anneeExpo();
  const [intro, introExt] = await Promise.all([
    contenu("kiosques_intro", "Choisissez un emplacement sur le plan du palais des commerces, puis envoyez votre demande. L'emplacement vous est confirmé à l'approbation, avec le lien de paiement."),
    contenu("kiosques_exterieurs_intro", "Machinerie, véhicules, grands kiosques : le terrain extérieur se réserve avec le comité. Envoyez votre demande, on vous appelle pour préparer l'entente."),
  ]);

  let aPartirDe: string | null = null;
  let plan: React.ReactNode = (
    <div className="avis-bandeau" role="note"><p>Le plan en ligne arrive bientôt. D&apos;ici là, appelez la coordination au <a href="tel:+14183860484">418 386-0484</a>.</p></div>
  );
  if (supabaseConfigure()) {
    const sb = supabasePublic();
    const [{ data: emps }, { data: etats }, prix] = await Promise.all([
      sb.from("emplacements_kiosque").select("id, code, x, y, largeur, hauteur, dimensions, note, prix_cents").order("code"),
      sb.rpc("etat_emplacements", { p_annee: annee }),
      prixPublics("kiosque"),
    ]);
    const base = prix.find((p) => p.cle === "kiosque_interieur");
    const occupes = new Set(((etats ?? []) as { id: string; occupe: boolean }[]).filter((e) => e.occupe).map((e) => e.id));
    const liste: EmplacementPublic[] = (emps ?? []).map((e) => ({
      id: e.id, code: e.code, x: e.x, y: e.y, largeur: e.largeur, hauteur: e.hauteur, dimensions: e.dimensions, note: e.note ?? "",
      occupe: occupes.has(e.id), prix: e.prix_cents ?? (base?.visible ? base.montant_cents : null),
    }));
    plan = <PlanPalais emplacements={liste} annee={annee} fictif={!!base?.a_confirmer} />;
    const prixLibres = liste.filter((e) => !e.occupe && e.prix != null).map((e) => e.prix!);
    if (prixLibres.length) aPartirDe = `À partir de ${argent(Math.min(...prixLibres))}${base?.a_confirmer ? " (prix fictif, test)" : ""}.`;
  }

  return (
    <>
      <section className="heros heros--page heros--video" aria-labelledby="titre-heros">
        {/* Le palais des commerces pendant l'Expo, à droite, fondu dans les planches (comme Programmation) */}
        <figure className="heros__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/photos/kiosques-interieurs.webp" srcSet="/images/photos/kiosques-interieurs-800.webp 800w, /images/photos/kiosques-interieurs.webp 1600w" sizes="(max-width: 760px) 100vw, 64vw" alt="Allée de kiosques dans le palais des commerces pendant l'Expo, sous la grande charpente d'acier, avec des visiteurs" width={1400} height={932} fetchPriority="high" />
          <span className="heros__voile" aria-hidden="true" />
          <figcaption className="heros__credit">Photo&nbsp;: Cynthia Fillion Photographe</figcaption>
        </figure>
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Exposants</span><span>Expo {annee}</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>Votre</span> <span className="jaune">kiosque</span></h1>
            <p className="heros__intro">{intro}</p>
            <div className="groupe-boutons">
              <a className="bouton bouton--orange" href="#plan">Voir le plan <span className="fleche" aria-hidden="true">→</span></a>
              <a className="bouton bouton--contour" href="#exterieur">Kiosque extérieur</a>
            </div>
          </div>
        </div>
      </section>

      <section id="plan" className="section-papier" aria-labelledby="titre-plan">
        <div className="contenu section-espacee">
          <div className="entete-section">
            <h2 id="titre-plan" className="titre-affiche">Le palais<br />des commerces</h2>
            <p>Kiosques intérieurs. Sélectionnez un emplacement en jaune pour le demander. Un emplacement n&apos;est jamais attribué deux fois : il est confirmé seulement à l&apos;approbation du comité.{aPartirDe && <> <strong>{aPartirDe}</strong></>}</p>
          </div>
          {plan}
        </div>
      </section>

      <section id="exterieur" className="section-papier-2" aria-labelledby="titre-exterieur">
        <div className="contenu section-espacee">
          <div className="entete-section">
            <h2 id="titre-exterieur" className="titre-affiche">Kiosque<br />extérieur</h2>
            <p>{introExt}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-start">
            <figure className="tirage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/photos/machinerie-exterieure-800.webp" alt="Machinerie agricole exposée sur le terrain extérieur de l'Expo" width={800} height={533} loading="lazy" />
            </figure>
            <FormulaireSimple
              action={demanderKiosqueExterieur}
              id="form-exterieur"
              className="formulaire"
              bouton="Envoyer ma demande"
              merci={<>
                <h3>Merci, c&apos;est reçu!</h3>
                <p>Le comité vous appelle pour préparer l&apos;entente. La facture vous est ensuite envoyée par courriel.</p>
                <p className="merci__garder">Pas de nouvelles d&apos;ici quelques jours&nbsp;? Appelez la coordination au <a href="tel:+14183860484">418 386-0484</a>.</p>
              </>}
            >
              <input type="hidden" name="annee" value={annee} />
              <fieldset className="etape">
                <legend className="etape__titre">Votre demande</legend>
                <div className="coordonnees">
                  <label className="champ"><span className="champ__etiquette">Entreprise</span><input type="text" name="entreprise" required autoComplete="organization" /></label>
                  <label className="champ"><span className="champ__etiquette">Nom du responsable</span><input type="text" name="nom" required autoComplete="name" /></label>
                  <label className="champ"><span className="champ__etiquette">Téléphone</span><input type="tel" name="telephone" required autoComplete="tel" inputMode="tel" placeholder="418 555-1234" /></label>
                  <label className="champ"><span className="champ__etiquette">Courriel</span><input type="email" name="courriel" required autoComplete="email" /></label>
                  <label className="champ champ--large"><span className="champ__etiquette">Ce que vous exposez</span><textarea name="description" rows={3} required placeholder="Machinerie, véhicules, démonstrations…" /></label>
                  <label className="champ champ--large"><span className="champ__etiquette">Espace et besoins <span className="facultatif">(facultatif)</span></span><textarea name="besoins" rows={2} placeholder="Superficie approximative, électricité, accès…" /></label>
                </div>
                <label className="consentement">
                  <input type="checkbox" name="consentement" value="oui" required />
                  <span>J&apos;accepte que l&apos;Expo St-Isidore utilise ces renseignements pour traiter ma demande, selon sa <Link href="/confidentialite">politique de confidentialité</Link>.</span>
                </label>
              </fieldset>
            </FormulaireSimple>
          </div>
        </div>
      </section>
    </>
  );
}
