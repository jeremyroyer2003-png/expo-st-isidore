import Exporter from "@/components/admin/Exporter";
import Filtres from "@/components/admin/Filtres";
import Historique from "@/components/admin/Historique";
import Annulation from "@/components/admin/Annulation";
import { Carte, Chiffre, LectureSeule, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent, dateHeure } from "@/lib/format";
import { choix, dansPeriode, PERIODES, trier, type Option } from "@/lib/filtres";
import { lireJournal } from "@/lib/journal";

export const metadata = { title: "Danse country" };

const STATUTS: Option[] = [["tous", "Tous (sauf expirées)"], ["payee", "Payées"], ["en_paiement", "Paiement en cours"], ["annulee", "Annulées"], ["expiree", "Expirées (non payées)"]];
const TRIS: Option[] = [["recent", "Plus récentes"], ["ancien", "Plus anciennes"], ["montant", "Montant"], ["nom", "Nom"]];

export default async function Page({ searchParams }: { searchParams: Promise<{ statut?: string; periode?: string; tri?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const params = await searchParams;
  const statut = choix(params.statut, STATUTS, "tous");
  const periode = choix(params.periode, PERIODES, "tout");
  const tri = choix(params.tri, TRIS, "recent");
  const { data: brutes } = await sb.from("inscriptions_danse").select("*, prix(libelle)").order("cree_le", { ascending: false }).limit(1000);
  const data = trier((brutes ?? []).filter((i) => (statut === "tous" ? i.statut !== "expiree" : i.statut === statut) && dansPeriode(i.cree_le, periode)),
    tri, { date: (i) => i.cree_le, montant: (i) => i.montant_cents, nom: (i) => i.nom });
  const journal = await lireJournal(sb, data.map((i) => i.id));
  // Les chiffres du haut suivent les filtres choisis
  const payees = data.filter((i) => i.statut === "payee");
  const personnes = payees.reduce((s, i) => s + i.personnes, 0);

  return (
    <>
      <Titre sous="Inscriptions payées en ligne. Les prix des forfaits se changent dans « Prix ». Pas de dépôt minimum ni de frais d'annulation par défaut pour la danse.">Danse country</Titre>
      {!edition && <LectureSeule />}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
        <Chiffre valeur={payees.length} libelle="Inscriptions payées" ton="olive" />
        <Chiffre valeur={personnes} libelle="Personnes inscrites" ton="jean" />
        <Chiffre valeur={argent(payees.reduce((s, i) => s + i.montant_cents, 0))} libelle="Total payé" ton="rouge" />
      </div>
      <Filtres statuts={STATUTS} statut={statut} periode={periode} tri={tri} tris={TRIS} libellePeriode="Inscrite" total={data.length}
        raccourcis={[["Payées ce mois-ci", "?statut=payee&periode=mois"], ["Payées le mois dernier", "?statut=payee&periode=mois-dernier"]]}
        autres={<Exporter type="danse" />} />
      <Carte>
        <Tableau entetes={["Quand", "Nom", "Forfait", "Pers.", "Montant", "Statut", ""]} vide={!data.length}>
          {data.map((i) => (
            <tr key={i.id}>
              <td className="whitespace-nowrap">{dateHeure(i.cree_le)}</td>
              <td>{i.nom}<br /><span className="text-[13px]">{i.telephone} · {i.courriel}</span></td>
              <td>{(i.prix as { libelle: string }).libelle}</td>
              <td>{i.personnes}</td>
              <td className="whitespace-nowrap">{argent(i.montant_cents)}</td>
              <td><Statut s={i.statut} /></td>
              <td className="min-w-[200px]">
                {edition && i.statut === "payee" && <Annulation type="danse" id={i.id} fraisCents={0} paye />}
                <Historique entrees={journal.get(i.id)} recue={i.cree_le} libelleRecue="Inscription commencée" />
              </td>
            </tr>
          ))}
        </Tableau>
      </Carte>
    </>
  );
}
