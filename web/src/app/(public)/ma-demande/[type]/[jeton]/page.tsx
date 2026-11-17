import type { Metadata } from "next";
import { supabaseConfigure } from "@/lib/env";
import { argent, dateCourte } from "@/lib/format";
import { lireSuivi, type TypeSuivi } from "@/lib/suivi";
import { supabaseService } from "@/lib/supabase/serveur";

export const metadata: Metadata = { title: "Ma demande", robots: { index: false } };
export const dynamic = "force-dynamic";

type Etat = "fait" | "en_cours" | "a_venir";
type Etape = { titre: string; detail?: string; etat: Etat };
type Suivi = {
  quoi: string;
  nom: string;
  recue: string;
  lignes: [string, string][];
  etapes: Etape[];
  /** Refusée ou annulée : un message remplace les étapes. */
  fin?: string;
  action?: { texte: string; url: string };
  telephone: [string, string];
};

const BUREAU: [string, string] = ["418 882-5649", "+14188825649"];
const COORDINATION: [string, string] = ["418 386-0484", "+14183860484"];
const REMISAGE: [string, string] = ["418 882-9619", "+14188829619"];

/** Les étapes avant `courante` sont faites, celle-ci est en cours, les suivantes à venir. */
function etapes(liste: [string, string?][], courante: number): Etape[] {
  return liste.map(([titre, detail], i) => ({ titre, detail, etat: i < courante ? "fait" : i === courante ? "en_cours" : "a_venir" }));
}

async function charger(type: TypeSuivi, id: string): Promise<Suivi | null> {
  const sb = supabaseService();
  if (type === "kiosque") {
    const { data: d } = await sb.from("demandes_kiosque").select("*, emplacements_kiosque(code)").eq("id", id).maybeSingle();
    if (!d) return null;
    const code = (d.emplacements_kiosque as { code: string } | null)?.code;
    const interieur = d.type === "interieur";
    const base = {
      quoi: interieur ? `Kiosque ${code}, palais des commerces` : "Kiosque extérieur",
      nom: d.nom,
      recue: dateCourte(d.cree_le),
      lignes: [["Entreprise", d.entreprise], ["Expo", String(d.annee)], ...(d.montant_cents != null ? [["Montant", argent(d.montant_cents)] as [string, string]] : [])] as [string, string][],
      telephone: COORDINATION,
    };
    if (d.statut === "refusee") return { ...base, etapes: [], fin: "Le comité n'a pas pu accepter cette demande. Pour en parler, appelez la coordination." };
    if (d.statut === "annulee") return { ...base, etapes: [], fin: "Cette demande est annulée. Si un paiement avait été fait, le remboursement a été envoyé sur votre carte." };
    if (interieur) {
      const n = { en_attente: 1, approuvee: 2, confirmee: 4 }[d.statut as string] ?? 1;
      return {
        ...base,
        etapes: etapes([
          ["Demande reçue", `Le ${base.recue}`],
          ["Approbation par le comité", "Le comité regarde chaque demande, puis vous écrit."],
          ["Paiement", "Le paiement confirme votre emplacement."],
          ["Kiosque confirmé", "Le comité vous écrit avant l'Expo pour le montage."],
        ], n),
        action: d.statut === "approuvee" ? { texte: `Payer mon kiosque (${argent(d.montant_cents)})`, url: `/payer/${d.jeton_paiement}` } : undefined,
      };
    }
    const n = { en_attente: 1, entente: 2, facturee: 3, confirmee: 5 }[d.statut as string] ?? 1;
    return {
      ...base,
      etapes: etapes([
        ["Demande reçue", `Le ${base.recue}`],
        ["Entente avec le comité", "Le comité vous appelle pour l'espace et les besoins."],
        ["Facture", "La facture arrive par courriel."],
        ["Paiement", "Payez la facture en ligne."],
        ["Kiosque confirmé"],
      ], n),
      action: d.statut === "facturee" && d.url_facture ? { texte: "Voir et payer la facture", url: d.url_facture } : undefined,
    };
  }

  const { data: d } = await sb.from("demandes_remisage").select("*").eq("id", id).maybeSingle();
  if (!d) return null;
  const base = {
    quoi: `Remisage d'hiver${d.saison ? ` ${d.saison}` : ""}`,
    nom: d.nom,
    recue: dateCourte(d.cree_le),
    lignes: [
      ["Véhicule", d.type_vehicule + (d.marque_modele ? ` · ${d.marque_modele}` : "")],
      ["Dimensions", `${d.longueur_pi} × ${d.largeur_pi} × ${d.hauteur_pi} pi`],
      ...(d.prix_total_cents != null ? [["Prix de la saison", argent(d.prix_total_cents)] as [string, string]] : []),
      ...(d.depot_cents != null ? [["Dépôt", argent(d.depot_cents)] as [string, string]] : []),
    ] as [string, string][],
    telephone: REMISAGE,
  };
  if (d.statut === "refusee") return { ...base, etapes: [], fin: "On n'a malheureusement pas de place pour ce véhicule cet hiver. Pour en parler, appelez le remisage." };
  if (d.statut === "annulee") return { ...base, etapes: [], fin: "Cette demande est annulée. Si un dépôt avait été payé, le remboursement a été envoyé sur votre carte." };
  const n = { en_attente: 1, approuvee: 2, depot_paye: 3 }[d.statut as string] ?? 1;
  return {
    ...base,
    etapes: etapes([
      ["Demande reçue", `Le ${base.recue}`],
      ["On regarde l'espace", "On vérifie la place pour vos dimensions, puis on vous écrit avec le prix."],
      ["Dépôt", "Le dépôt garde votre place pour l'hiver."],
      ["Entrée du véhicule", "On vous appelle pour fixer la date d'entrée, vers la mi-octobre. Le véhicule est mesuré à l'arrivée."],
    ], n),
    action: d.statut === "approuvee" ? { texte: `Payer le dépôt (${argent(d.depot_cents)})`, url: `/payer/${d.jeton_paiement}` } : undefined,
  };
}

const PASTILLE: Record<Etat, string> = {
  fait: "bg-olive text-encre",
  en_cours: "bg-moutarde text-encre",
  a_venir: "bg-creme text-gris-brun",
};
const ETAT_TEXTE: Record<Etat, string> = { fait: "Fait", en_cours: "En cours", a_venir: "À venir" };

// Page du lien « Ma demande » envoyé par courriel (kiosque et remisage) : le client voit où en est sa demande.
export default async function Page({ params }: { params: Promise<{ type: string; jeton: string }> }) {
  const { type, jeton } = await params;
  const valide = (type === "kiosque" || type === "remisage") && supabaseConfigure();
  const id = valide ? lireSuivi(type, jeton) : null;
  const s = id ? await charger(type as TypeSuivi, id) : null;

  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Suivi</span><span>{type === "remisage" ? "Remisage d'hiver" : "Kiosque"}</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>{s ? "Ma" : "Lien"}</span> <span className="jaune">{s ? "demande" : "inactif"}</span></h1>
          </div>
        </div>
      </section>
      <section className="section-papier">
        <div className="contenu section-espacee">
          <div className="anim-monter max-w-[680px] bg-creme cadre-affiche p-6 sm:p-8">
            {!s ? (
              <p className="text-[18px]">Ce lien ne correspond à aucune demande. Vérifiez qu&apos;il est complet, ou appelez le bureau au <a href={`tel:${BUREAU[1]}`}>{BUREAU[0]}</a>.</p>
            ) : (
              <>
                <p className="font-etiquette font-bold uppercase tracking-widest text-[15px] text-gris-brun">Bonjour {s.nom}</p>
                <h2 className="font-affiche text-[26px] text-encre mt-1">{s.quoi}</h2>
                <dl className="border-y-2 border-dashed border-encre py-4 my-5 grid gap-2 text-[17px]">
                  {s.lignes.map(([k, v]) => (
                    <div key={k} className="flex flex-wrap justify-between gap-x-4"><dt className="text-gris-brun">{k}</dt><dd className="font-semibold text-right">{v}</dd></div>
                  ))}
                </dl>

                {s.fin ? (
                  <p className="text-[18px] border-[3px] border-encre bg-kraft px-4 py-3">{s.fin}</p>
                ) : (
                  <ol className="grid gap-0" aria-label="Où en est votre demande">
                    {s.etapes.map((e, i) => (
                      <li key={e.titre} className="relative grid grid-cols-[44px_1fr] gap-3 pb-5 last:pb-0">
                        {i < s.etapes.length - 1 && <span aria-hidden="true" className={`absolute left-[21px] top-[44px] bottom-0 w-[3px] ${e.etat === "fait" ? "bg-encre" : "bg-encre/25"}`} />}
                        <span aria-hidden="true" className={`grid h-[44px] w-[44px] place-items-center border-[3px] border-encre font-affiche text-[18px] ${PASTILLE[e.etat]}`}>
                          {e.etat === "fait" ? "✓" : i + 1}
                        </span>
                        <div className={`pt-1 ${e.etat === "a_venir" ? "text-gris-brun" : "text-encre"}`}>
                          <p className="font-etiquette font-extrabold text-[19px] leading-tight">
                            {e.titre} <span className="visuellement-cache">: {ETAT_TEXTE[e.etat]}</span>
                            {e.etat === "en_cours" && <span aria-hidden="true" className="ml-2 inline-block border-2 border-encre bg-moutarde px-2 font-etiquette text-[13px] uppercase tracking-wide align-middle">En cours</span>}
                          </p>
                          {e.detail && <p className="text-[16px] mt-0.5">{e.detail}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {s.action && (
                  <p className="mt-6"><a href={s.action.url} className="bouton bouton--orange bouton--grand">{s.action.texte}</a></p>
                )}
                <p className="note mt-6">Une question? Appelez au <a href={`tel:${s.telephone[1]}`}>{s.telephone[0]}</a>. Gardez ce lien : il montre toujours l&apos;état à jour de votre demande.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
