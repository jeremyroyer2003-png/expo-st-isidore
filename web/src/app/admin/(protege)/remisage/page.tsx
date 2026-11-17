import Exporter from "@/components/admin/Exporter";
import Filtres from "@/components/admin/Filtres";
import Historique from "@/components/admin/Historique";
import Annulation from "@/components/admin/Annulation";
import FormAction from "@/components/admin/FormAction";
import LienPaiement from "@/components/admin/LienPaiement";
import { approuverRemisage, refuserDemande } from "@/actions/admin/gestion";
import { Carte, champCls, etiquetteCls, LectureSeule, Statut, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { env } from "@/lib/env";
import { argent, dateHeure } from "@/lib/format";
import { choix, dansPeriode, PERIODES, trier, type Option } from "@/lib/filtres";
import { lireJournal } from "@/lib/journal";
import { cheminSuivi } from "@/lib/suivi";

export const metadata = { title: "Remisage d'hiver" };

const STATUTS: Option[] = [
  ["actives", "En cours (à approuver, à payer, payées)"], ["en_attente", "À approuver"], ["approuvee", "Approuvées, dépôt à payer"],
  ["depot_paye", "Dépôt payé"], ["refusee", "Refusées"], ["annulee", "Annulées"], ["toutes", "Toutes"],
];
const TRIS: Option[] = [["a-traiter", "À traiter d'abord"], ["recent", "Plus récentes"], ["ancien", "Plus anciennes"], ["montant", "Prix de la saison"], ["nom", "Nom du client"]];

export default async function Page({ searchParams }: { searchParams: Promise<{ statut?: string; periode?: string; tri?: string; voir?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const params = await searchParams;
  const statut = choix(params.statut ?? (params.voir === "toutes" ? "toutes" : undefined), STATUTS, "actives");
  const periode = choix(params.periode, PERIODES, "tout");
  const tri = choix(params.tri, TRIS, "a-traiter");
  const edition = peutEditer(profil);
  const [{ data: demandes }, { data: prix }] = await Promise.all([
    sb.from("demandes_remisage").select("*").order("cree_le", { ascending: false }).limit(500),
    sb.from("prix").select("cle, montant_cents").in("cle", ["remisage_pied", "remisage_depot_min", "frais_annulation_remisage"]),
  ]);
  const p = Object.fromEntries((prix ?? []).map((x) => [x.cle, x.montant_cents])) as Record<string, number>;
  const filtrees = (demandes ?? []).filter((d) =>
    (statut === "toutes" || (statut === "actives" ? ["en_attente", "approuvee", "depot_paye"].includes(d.statut) : d.statut === statut))
    && dansPeriode(d.maj_le ?? d.cree_le, periode));
  const ordre = { en_attente: 0, approuvee: 1, depot_paye: 2 } as Record<string, number>;
  const liste = tri === "a-traiter"
    ? [...filtrees].sort((a, b) => (ordre[a.statut] ?? 9) - (ordre[b.statut] ?? 9))
    : trier(filtrees, tri, { date: (d) => d.maj_le ?? d.cree_le, montant: (d) => d.prix_total_cents, nom: (d) => d.nom });
  const journal = await lireJournal(sb, liste.map((d) => d.id));

  return (
    <>
      <Titre sous={`Tarif actuel : ${argent(p.remisage_pied)} le pied · dépôt minimum : ${argent(p.remisage_depot_min)}. Approuver envoie au client le prix et le lien pour payer le dépôt.`}>Remisage d&apos;hiver</Titre>
      {!edition && <LectureSeule />}
      <Filtres statuts={STATUTS} statut={statut} periode={periode} tri={tri} tris={TRIS} libellePeriode="Dernière activité" total={liste.length}
        raccourcis={[["Dépôts payés ce mois-ci", "?statut=depot_paye&periode=mois&tri=recent"], ["Dépôt à payer depuis plus de 7 jours", "?statut=approuvee&periode=plus-7j&tri=ancien"]]}
        autres={<Exporter type="remisage" />} />
      <div className="grid gap-4">
        {!liste.length && <Carte><p className="text-gris-brun">Aucune demande.</p></Carte>}
        {liste.map((d) => {
          const total = Math.round(Number(d.longueur_pi) * (p.remisage_pied ?? 0));
          const depot = Math.max(p.remisage_depot_min ?? 10000, 0);
          return (
            <Carte key={d.id} titre={<>{d.type_vehicule}{d.marque_modele && ` · ${d.marque_modele}`} <Statut s={d.statut} /></>}
              action={<span className="text-[14px] text-gris-brun">Reçue le {dateHeure(d.cree_le)} · saison {d.saison}</span>}>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
                  <dt className="text-gris-brun">Dimensions</dt><dd className="font-semibold">{d.longueur_pi} × {d.largeur_pi} × {d.hauteur_pi} pi</dd>
                  <dt className="text-gris-brun">Entrée</dt><dd>{d.entree_souhaitee || "—"}</dd>
                  <dt className="text-gris-brun">Client</dt><dd>{d.nom} · <a href={`tel:${d.telephone}`}>{d.telephone}</a> · <a href={`mailto:${d.courriel}`}>{d.courriel}</a></dd>
                  {d.commentaires && <><dt className="text-gris-brun">Commentaires</dt><dd>{d.commentaires}</dd></>}
                  {d.prix_total_cents != null && <><dt className="text-gris-brun">Prix / dépôt</dt><dd>{argent(d.prix_total_cents)} · dépôt {argent(d.depot_cents)}</dd></>}
                  {d.notes_admin && <><dt className="text-gris-brun">Notes</dt><dd>{d.notes_admin}</dd></>}
                  <dd className="col-span-2 mt-1"><Historique entrees={journal.get(d.id)} recue={d.cree_le} suivi={cheminSuivi("remisage", d.id)} /></dd>
                </dl>
                {edition && d.statut === "en_attente" && (
                  <div className="grid gap-3">
                    <FormAction action={approuverRemisage} bouton="Approuver et envoyer le lien du dépôt" style="succes">
                      <input type="hidden" name="id" value={d.id} />
                      <div className="grid grid-cols-2 gap-3">
                        <label><span className={etiquetteCls}>Prix de la saison ($)</span><input name="total" type="number" step="0.01" min={0} required defaultValue={(total / 100).toFixed(2)} className={champCls} /></label>
                        <label><span className={etiquetteCls}>Dépôt ($, min. {argent(p.remisage_depot_min)})</span><input name="depot" type="number" step="0.01" min={(p.remisage_depot_min ?? 0) / 100} required defaultValue={(depot / 100).toFixed(2)} className={champCls} /></label>
                      </div>
                      <label><span className={etiquetteCls}>Notes internes</span><input name="notes" className={champCls} placeholder="Bâtiment, rangée…" /></label>
                    </FormAction>
                    <details>
                      <summary className="cursor-pointer text-[14px] font-semibold underline">Refuser la demande</summary>
                      <FormAction action={refuserDemande} bouton="Refuser" style="danger" className="mt-2" confirmer="Refuser cette demande?">
                        <input type="hidden" name="id" value={d.id} /><input type="hidden" name="type" value="remisage" />
                        <label><span className={etiquetteCls}>Raison (envoyée au client)</span><input name="raison" className={champCls} placeholder="Plus de place pour cette taille cet hiver." /></label>
                        <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" name="aviser" value="oui" defaultChecked /> Aviser le client par courriel</label>
                      </FormAction>
                    </details>
                  </div>
                )}
                {d.statut === "approuvee" && (
                  <div className="grid gap-2">
                    <p className="text-[15px] font-semibold">En attente du dépôt.</p>
                    <LienPaiement url={`${env.urlSite}/payer/${d.jeton_paiement}`} type="remisage" id={d.id} edition={edition} />
                  </div>
                )}
                {edition && ["approuvee", "depot_paye"].includes(d.statut) && (
                  <Annulation type="remisage" id={d.id} fraisCents={p.frais_annulation_remisage ?? 0} paye={d.statut === "depot_paye"} />
                )}
              </div>
            </Carte>
          );
        })}
      </div>
    </>
  );
}
