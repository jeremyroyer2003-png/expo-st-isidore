import Annulation from "@/components/admin/Annulation";
import { Carte, Chiffre, LectureSeule, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent, dateHeure } from "@/lib/format";

export const metadata = { title: "Danse country" };

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data } = await sb.from("inscriptions_danse").select("*, prix(libelle)").neq("statut", "expiree").order("cree_le", { ascending: false }).limit(500);
  const payees = (data ?? []).filter((i) => i.statut === "payee");
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
      <Carte>
        <Tableau entetes={["Quand", "Nom", "Forfait", "Pers.", "Montant", "Statut", ""]} vide={!data?.length}>
          {(data ?? []).map((i) => (
            <tr key={i.id}>
              <td className="whitespace-nowrap">{dateHeure(i.cree_le)}</td>
              <td>{i.nom}<br /><span className="text-[13px]">{i.telephone} · {i.courriel}</span></td>
              <td>{(i.prix as { libelle: string }).libelle}</td>
              <td>{i.personnes}</td>
              <td className="whitespace-nowrap">{argent(i.montant_cents)}</td>
              <td><Statut s={i.statut} /></td>
              <td>{edition && i.statut === "payee" && <Annulation type="danse" id={i.id} fraisCents={0} paye />}</td>
            </tr>
          ))}
        </Tableau>
      </Carte>
    </>
  );
}
