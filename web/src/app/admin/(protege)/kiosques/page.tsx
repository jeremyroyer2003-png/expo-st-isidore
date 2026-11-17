import Exporter from "@/components/admin/Exporter";
import Filtres from "@/components/admin/Filtres";
import Historique from "@/components/admin/Historique";
import Annulation from "@/components/admin/Annulation";
import FormAction from "@/components/admin/FormAction";
import LienPaiement from "@/components/admin/LienPaiement";
import { approuverKiosque, envoyerFacture, majEmplacement, noterEntente, refuserDemande } from "@/actions/admin/gestion";
import { Carte, champCls, etiquetteCls, LectureSeule, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { env } from "@/lib/env";
import { argent, dateHeure } from "@/lib/format";
import { choix, dansPeriode, PERIODES, trier, type Option } from "@/lib/filtres";
import { lireJournal } from "@/lib/journal";
import { cheminSuivi } from "@/lib/suivi";

export const metadata = { title: "Kiosques" };

const STATUTS: Option[] = [
  ["actives", "En cours (sans refusées ni annulées)"], ["en_attente", "À traiter"], ["entente", "Entente notée (extérieur)"],
  ["a_payer", "Approuvées ou facturées, à payer"], ["confirmee", "Payées, confirmées"], ["refusee", "Refusées"], ["annulee", "Annulées"], ["toutes", "Toutes"],
];
const TRIS: Option[] = [["a-traiter", "À traiter d'abord"], ["recent", "Plus récentes"], ["ancien", "Plus anciennes"], ["montant", "Montant"], ["nom", "Entreprise"]];
const garder = (statut: string, d: { statut: string }) =>
  statut === "toutes" || (statut === "actives" ? !["refusee", "annulee"].includes(d.statut)
    : statut === "a_payer" ? ["approuvee", "facturee"].includes(d.statut) : d.statut === statut);

type Demande = {
  id: string; type: string; annee: number; statut: string; entreprise: string; nom: string; courriel: string; telephone: string;
  description: string; besoins: string; montant_cents: number | null; notes_admin: string; url_facture: string | null; cree_le: string; maj_le: string | null;
  jeton_paiement: string; emplacements_kiosque: { code: string; prix_cents: number | null } | null;
};

export default async function Page({ searchParams }: { searchParams: Promise<{ voir?: string; statut?: string; periode?: string; tri?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const params = await searchParams;
  const voir = params.voir === "plan" ? "plan" : "demandes";
  const statut = choix(params.statut, STATUTS, "actives");
  const periode = choix(params.periode, PERIODES, "tout");
  const tri = choix(params.tri, TRIS, "a-traiter");
  const edition = peutEditer(profil);
  const [{ data: demandes }, { data: emps }, { data: prix }] = await Promise.all([
    sb.from("demandes_kiosque").select("*, emplacements_kiosque(code, prix_cents)").order("cree_le", { ascending: false }).limit(500),
    sb.from("emplacements_kiosque").select("*").order("code"),
    sb.from("prix").select("cle, montant_cents").in("cle", ["kiosque_interieur", "kiosque_exterieur", "frais_annulation_kiosque"]),
  ]);
  const p = Object.fromEntries((prix ?? []).map((x) => [x.cle, x.montant_cents])) as Record<string, number>;
  const toutes = (demandes ?? []) as Demande[];
  const nbActives = toutes.filter((d) => !["refusee", "annulee"].includes(d.statut)).length;
  const filtrees = toutes.filter((d) => garder(statut, d) && dansPeriode(d.maj_le ?? d.cree_le, periode));
  const ordre = { en_attente: 0, entente: 1, approuvee: 2, facturee: 3, confirmee: 4 } as Record<string, number>;
  const actives = tri === "a-traiter"
    ? [...filtrees].sort((a, b) => (ordre[a.statut] ?? 9) - (ordre[b.statut] ?? 9))
    : trier(filtrees, tri, { date: (d) => d.maj_le ?? d.cree_le, montant: (d) => d.montant_cents, nom: (d) => d.entreprise });
  const journal = voir === "demandes" ? await lireJournal(sb, actives.map((d) => d.id)) : new Map();

  const onglet = (v: string, t: string) => (
    <a href={`?voir=${v}`} aria-current={voir === v ? "page" : undefined}
      className={`px-3 min-h-[40px] inline-flex items-center border-2 border-encre font-etiquette font-bold no-underline ${voir === v ? "bg-encre text-creme" : "bg-[#FBF6EC] text-encre"}`}>{t}</a>
  );

  return (
    <>
      <Titre sous="Intérieur : approuver tient l'emplacement et envoie le lien de paiement; il est confirmé une fois payé. Extérieur : notez l'entente, puis envoyez la facture Stripe.">Kiosques</Titre>
      {!edition && <LectureSeule />}
      <nav className="flex flex-wrap gap-2 mb-4" aria-label="Sections">{onglet("demandes", `Demandes en cours (${nbActives})`)}{onglet("plan", "Emplacements du plan")}</nav>

      {voir === "demandes" && (
        <Filtres statuts={STATUTS} statut={statut} periode={periode} tri={tri} tris={TRIS} libellePeriode="Dernière activité" total={actives.length}
          raccourcis={[["Payées ce mois-ci", "?statut=confirmee&periode=mois&tri=recent"], ["À payer depuis plus de 7 jours", "?statut=a_payer&periode=plus-7j&tri=ancien"]]}
          autres={<Exporter type="kiosques" />} />
      )}
      {voir === "demandes" && (
        <div className="grid gap-4">
          {!actives.length && <Carte><p className="text-gris-brun">Aucune demande ne correspond.</p></Carte>}
          {actives.map((d) => {
            const code = d.emplacements_kiosque?.code;
            const montantDefaut = d.montant_cents ?? (d.type === "interieur" ? d.emplacements_kiosque?.prix_cents ?? p.kiosque_interieur : p.kiosque_exterieur) ?? 0;
            return (
              <Carte key={d.id}
                titre={<>{d.type === "interieur" ? `Intérieur · ${code}` : "Extérieur"} · {d.entreprise} <Statut s={d.statut} /></>}
                action={<span className="text-[14px] text-gris-brun">Expo {d.annee} · reçue le {dateHeure(d.cree_le)}</span>}>
                <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
                    <dt className="text-gris-brun">Contact</dt><dd>{d.nom} · <a href={`tel:${d.telephone}`}>{d.telephone}</a> · <a href={`mailto:${d.courriel}`}>{d.courriel}</a></dd>
                    <dt className="text-gris-brun">Expose</dt><dd>{d.description}</dd>
                    {d.besoins && <><dt className="text-gris-brun">Besoins</dt><dd>{d.besoins}</dd></>}
                    {d.montant_cents != null && <><dt className="text-gris-brun">Montant</dt><dd className="font-semibold">{argent(d.montant_cents)}</dd></>}
                    {d.notes_admin && <><dt className="text-gris-brun">Notes</dt><dd>{d.notes_admin}</dd></>}
                    {d.url_facture && <><dt className="text-gris-brun">Facture</dt><dd><a href={d.url_facture} target="_blank" rel="noopener">Voir la facture Stripe</a></dd></>}
                    <dd className="col-span-2 mt-1"><Historique entrees={journal.get(d.id)} recue={d.cree_le} suivi={cheminSuivi("kiosque", d.id)} /></dd>
                  </dl>
                  {(edition || d.statut === "approuvee") && (
                    <div className="grid gap-3 content-start">
                      {d.statut === "approuvee" && <LienPaiement url={`${env.urlSite}/payer/${d.jeton_paiement}`} type="kiosque" id={d.id} edition={edition} />}
                      {d.statut === "facturee" && d.url_facture && <LienPaiement url={d.url_facture} type="kiosque" id={d.id} edition={edition} />}
                      {edition && d.type === "interieur" && d.statut === "en_attente" && (
                        <FormAction action={approuverKiosque} bouton={`Approuver ${code} et envoyer le lien`} style="succes">
                          <input type="hidden" name="id" value={d.id} />
                          <label><span className={etiquetteCls}>Montant à payer ($)</span><input name="montant" type="number" step="0.01" min={0} required defaultValue={(montantDefaut / 100).toFixed(2)} className={champCls} /></label>
                          <label><span className={etiquetteCls}>Notes internes</span><input name="notes" className={champCls} /></label>
                        </FormAction>
                      )}
                      {edition && d.type === "exterieur" && ["en_attente", "entente"].includes(d.statut) && (
                        <FormAction action={noterEntente} bouton={d.statut === "entente" ? "Modifier l'entente" : "Noter l'entente"} style="secondaire">
                          <input type="hidden" name="id" value={d.id} />
                          <label><span className={etiquetteCls}>Montant convenu ($)</span><input name="montant" type="number" step="0.01" min={0} required defaultValue={(montantDefaut / 100).toFixed(2)} className={champCls} /></label>
                          <label><span className={etiquetteCls}>Détails de l&apos;entente</span><input name="notes" defaultValue={d.notes_admin} className={champCls} placeholder="Superficie, emplacement, électricité…" /></label>
                        </FormAction>
                      )}
                      {edition && d.type === "exterieur" && d.statut === "entente" && (
                        <FormAction action={envoyerFacture} bouton={`Envoyer la facture (${argent(d.montant_cents)})`} style="succes" confirmer="Créer la facture Stripe (mode test) et l'envoyer au client?">
                          <input type="hidden" name="id" value={d.id} />
                        </FormAction>
                      )}
                      {edition && ["en_attente", "entente"].includes(d.statut) && (
                        <details>
                          <summary className="cursor-pointer text-[14px] font-semibold underline">Refuser la demande</summary>
                          <FormAction action={refuserDemande} bouton="Refuser" style="danger" className="mt-2" confirmer="Refuser cette demande?">
                            <input type="hidden" name="id" value={d.id} /><input type="hidden" name="type" value="kiosque" />
                            <label><span className={etiquetteCls}>Raison (envoyée au client)</span><input name="raison" className={champCls} /></label>
                            <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" name="aviser" value="oui" defaultChecked /> Aviser le client par courriel</label>
                          </FormAction>
                        </details>
                      )}
                      {edition && ["approuvee", "facturee", "confirmee"].includes(d.statut) && (
                        <Annulation type="kiosque" id={d.id} fraisCents={p.frais_annulation_kiosque ?? 0} paye={d.statut === "confirmee"} />
                      )}
                    </div>
                  )}
                </div>
              </Carte>
            );
          })}
        </div>
      )}

      {voir === "plan" && (
        <Carte titre="Emplacements du palais des commerces" action={<span className="text-[14px] text-gris-brun">Grille de 24 × 14 cases. Prix vide = prix « Kiosque intérieur ».</span>}>
          <Tableau entetes={["Code · X · Y · largeur · hauteur · dimensions · prix ($) · actif"]}>
            {(emps ?? []).map((e) => (
              <tr key={e.id}>
                <td className="!p-1">
                  {edition ? (
                    <FormAction action={majEmplacement} bouton="Enregistrer" style="secondaire" enLigne>
                      <input type="hidden" name="id" value={e.id} />
                      <input name="code" defaultValue={e.code} aria-label="Code" className={`${champCls} w-[70px]`} />
                      <input name="x" type="number" defaultValue={e.x} aria-label="X" className={`${champCls} w-[64px]`} />
                      <input name="y" type="number" defaultValue={e.y} aria-label="Y" className={`${champCls} w-[64px]`} />
                      <input name="largeur" type="number" defaultValue={e.largeur} aria-label="Largeur" className={`${champCls} w-[64px]`} />
                      <input name="hauteur" type="number" defaultValue={e.hauteur} aria-label="Hauteur" className={`${champCls} w-[64px]`} />
                      <input name="dimensions" defaultValue={e.dimensions} aria-label="Dimensions" className={`${champCls} w-[130px]`} />
                      <input name="prix" type="number" step="0.01" defaultValue={e.prix_cents != null ? (e.prix_cents / 100).toFixed(2) : ""} aria-label="Prix" className={`${champCls} w-[100px]`} />
                      <label className="flex items-center gap-1 min-h-[40px]"><input type="checkbox" name="actif" value="oui" defaultChecked={e.actif} /> Actif</label>
                    </FormAction>
                  ) : (
                    <span>{e.code} · ({e.x}, {e.y}) · {e.dimensions} · {e.actif ? "actif" : "inactif"}</span>
                  )}
                </td>
              </tr>
            ))}
          </Tableau>
          {edition && (
            <div className="mt-4">
              <p className="font-etiquette font-bold text-[17px] mb-2">Ajouter un emplacement</p>
              <FormAction action={majEmplacement} bouton="Ajouter" enLigne>
                <input name="code" placeholder="Code" required className={`${champCls} w-[70px]`} />
                <input name="x" type="number" placeholder="X" required className={`${champCls} w-[64px]`} />
                <input name="y" type="number" placeholder="Y" required className={`${champCls} w-[64px]`} />
                <input name="largeur" type="number" defaultValue={2} className={`${champCls} w-[64px]`} aria-label="Largeur" />
                <input name="hauteur" type="number" defaultValue={2} className={`${champCls} w-[64px]`} aria-label="Hauteur" />
                <input name="dimensions" defaultValue="10 pi × 10 pi" className={`${champCls} w-[130px]`} aria-label="Dimensions" />
                <input name="prix" type="number" step="0.01" placeholder="Prix" className={`${champCls} w-[100px]`} />
                <input type="hidden" name="actif" value="oui" />
              </FormAction>
            </div>
          )}
        </Carte>
      )}
    </>
  );
}
