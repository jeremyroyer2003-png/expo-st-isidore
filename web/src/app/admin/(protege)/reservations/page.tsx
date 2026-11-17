import Exporter from "@/components/admin/Exporter";
import Filtres from "@/components/admin/Filtres";
import Historique from "@/components/admin/Historique";
import Annulation from "@/components/admin/Annulation";
import { Carte, LectureSeule, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent, dateLongue, plage } from "@/lib/format";
import { choix, dansPeriode, PERIODES, trier, type Option } from "@/lib/filtres";
import { lireJournal } from "@/lib/journal";

export const metadata = { title: "Réservations de salles" };

const STATUTS: Option[] = [["tous", "Tous les statuts"], ["confirmee", "Confirmées (payées)"], ["en_paiement", "Paiement en cours"], ["annulee", "Annulées"], ["expiree", "Expirées (non payées)"]];
const TRIS: Option[] = [["date", "Date de l'événement"], ["recent", "Réservées récemment"], ["ancien", "Réservées il y a longtemps"], ["montant", "Montant"], ["nom", "Nom du client"]];

export default async function Page({ searchParams }: { searchParams: Promise<{ voir?: string; statut?: string; periode?: string; tri?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const params = await searchParams;
  const voir = ["a-venir", "passees", "toutes"].includes(params.voir ?? "") ? params.voir! : "a-venir";
  const statut = choix(params.statut, STATUTS, "tous");
  const periode = choix(params.periode, PERIODES, "tout");
  const tri = choix(params.tri, TRIS, "date");
  const edition = peutEditer(profil);
  const [{ data: resas }, { data: frais }] = await Promise.all([
    sb.from("reservations_salle").select("*, creneaux_salle(debut, fin, salles(nom))").order("cree_le", { ascending: false }).limit(300),
    sb.from("prix").select("montant_cents").eq("cle", "frais_annulation_salle").maybeSingle(),
  ]);
  const maintenant = new Date().toISOString();
  type C = { debut: string; fin: string; salles: { nom: string } };
  const filtrees = (resas ?? []).filter((r) => {
    const c = r.creneaux_salle as C;
    if (statut !== "tous" && r.statut !== statut) return false;
    if (!dansPeriode(r.cree_le, periode)) return false;
    if (voir === "toutes") return true;
    // Sans filtre de statut, « à venir » et « passées » montrent seulement les réservations actives
    if (voir === "passees") return c.debut < maintenant && (statut !== "tous" || r.statut === "confirmee");
    return c.debut >= maintenant && (statut !== "tous" || ["confirmee", "en_paiement"].includes(r.statut));
  });
  const liste = tri === "date"
    ? [...filtrees].sort((a, b) => (a.creneaux_salle as C).debut.localeCompare((b.creneaux_salle as C).debut) * (voir === "passees" ? -1 : 1))
    : trier(filtrees, tri, { date: (r) => r.cree_le, montant: (r) => r.montant_cents, nom: (r) => r.nom });
  const journal = await lireJournal(sb, liste.map((r) => r.id));
  const onglet = (v: string) => "?" + new URLSearchParams({ ...(params as Record<string, string>), voir: v }).toString();

  return (
    <>
      <Titre sous="Les réservations payées en ligne. Une annulation rembourse le client moins les frais, et rouvre la date.">Salles réservées</Titre>
      {!edition && <LectureSeule />}
      <nav className="flex flex-wrap gap-2 mb-4" aria-label="Filtre">
        {[["a-venir", "À venir"], ["passees", "Passées"], ["toutes", "Toutes"]].map(([v, t]) => (
          <a key={v} href={onglet(v)} aria-current={voir === v ? "page" : undefined}
            className={`px-3 min-h-[40px] inline-flex items-center border-2 border-encre font-etiquette font-bold no-underline ${voir === v ? "bg-encre text-creme" : "bg-[#FBF6EC] text-encre"}`}>{t}</a>
        ))}
      </nav>
      <Filtres statuts={STATUTS} statut={statut} periode={periode} tri={tri} tris={TRIS} libellePeriode="Réservée" total={liste.length} caches={{ voir }}
        raccourcis={[["Réservées ce mois-ci", "?voir=toutes&statut=confirmee&periode=mois&tri=recent"], ["Annulées cette année", "?voir=toutes&statut=annulee&periode=annee&tri=recent"]]}
        autres={<Exporter type="salles" />} />
      <Carte>
        <Tableau entetes={["Date", "Salle", "Client", "Événement", "Montant", "Statut", ""]} vide={!liste.length}>
          {liste.map((r) => {
            const c = r.creneaux_salle as C;
            return (
              <tr key={r.id}>
                <td className="whitespace-nowrap"><strong>{dateLongue(c.debut)}</strong><br /><span className="text-[13px]">{plage(c.debut, c.fin)}</span></td>
                <td>{c.salles.nom}</td>
                <td>{r.nom}<br /><a href={`tel:${r.telephone}`} className="text-[13px]">{r.telephone}</a><br /><a href={`mailto:${r.courriel}`} className="text-[13px]">{r.courriel}</a></td>
                <td>{r.type_evenement}{r.personnes ? ` · ${r.personnes} pers.` : ""}{r.commentaires && <><br /><span className="text-[13px] text-gris-brun">{r.commentaires}</span></>}</td>
                <td className="whitespace-nowrap">{argent(r.montant_cents)}</td>
                <td><Statut s={r.statut} /></td>
                <td className="min-w-[200px]">
                  {edition && r.statut === "confirmee" && <Annulation type="salle" id={r.id} fraisCents={frais?.montant_cents ?? 0} paye />}
                  <Historique entrees={journal.get(r.id)} recue={r.cree_le} libelleRecue="Réservation commencée" />
                </td>
              </tr>
            );
          })}
        </Tableau>
      </Carte>
    </>
  );
}
