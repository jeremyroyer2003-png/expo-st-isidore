import Link from "next/link";
import { Carte, Chiffre, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin";
import { argent, dateHeure } from "@/lib/format";

export const metadata = { title: "Tableau de bord" };

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const nb = { count: "exact", head: true } as const;
  const [kiosques, remisage, messages, aVenir, paiementsMois, recents, courriels] = await Promise.all([
    sb.from("demandes_kiosque").select("id", nb).eq("statut", "en_attente").then((r) => r.count ?? 0),
    sb.from("demandes_remisage").select("id", nb).eq("statut", "en_attente").then((r) => r.count ?? 0),
    sb.from("messages").select("id", nb).eq("traite", false).then((r) => r.count ?? 0),
    sb.from("reservations_salle").select("id", nb).eq("statut", "confirmee").then((r) => r.count ?? 0),
    sb.from("paiements").select("montant_cents, rembourse_cents").in("statut", ["paye", "rembourse_partiel", "rembourse"]).gte("maj_le", debutMois),
    sb.from("paiements").select("*").order("cree_le", { ascending: false }).limit(8),
    sb.from("courriels_sortants").select("id, destinataire, sujet, statut, cree_le").order("cree_le", { ascending: false }).limit(5),
  ]);
  const encaisse = (paiementsMois.data ?? []).reduce((s, p) => s + p.montant_cents - p.rembourse_cents, 0);
  const NOMS = { salle: "Salle", kiosque: "Kiosque", danse: "Danse", remisage: "Remisage" } as Record<string, string>;

  return (
    <>
      <Titre sous={`Bonjour ${profil.nom || profil.courriel}. Voici ce qui demande votre attention.`}>Tableau de bord</Titre>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-5 mb-8">
        <Chiffre valeur={kiosques} libelle="Kiosques à approuver" href="/admin/kiosques" ton={kiosques ? "moutarde" : "creme"} />
        <Chiffre valeur={remisage} libelle="Remisages à approuver" href="/admin/remisage" ton={remisage ? "moutarde" : "creme"} />
        <Chiffre valeur={messages} libelle="Messages non traités" href="/admin/messages" ton={messages ? "jean" : "creme"} />
        <Chiffre valeur={aVenir} libelle="Salles réservées" href="/admin/reservations" ton="olive" />
        <Chiffre valeur={argent(encaisse)} libelle="Encaissé ce mois (net)" ton="rouge" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Carte titre="Derniers paiements">
          <Tableau entetes={["Quand", "Pour", "Montant", "Statut"]} vide={!recents.data?.length}>
            {(recents.data ?? []).map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap">{dateHeure(p.cree_le)}</td>
                <td>{NOMS[p.objet_type]}<br /><span className="text-gris-brun text-[13px]">{p.courriel}</span></td>
                <td className="whitespace-nowrap font-semibold">{argent(p.montant_cents)}{p.rembourse_cents ? <><br /><span className="text-[13px] text-rouge">−{argent(p.rembourse_cents)}</span></> : null}</td>
                <td><Statut s={p.statut} /></td>
              </tr>
            ))}
          </Tableau>
        </Carte>
        <Carte titre="Courriels récents" action={<Link href="/admin/boite-envoi" className="text-[14px] underline">Toute la boîte d&apos;envoi</Link>}>
          <ul className="grid gap-2">
            {(courriels.data ?? []).map((c) => (
              <li key={c.id} className="border-b border-encre/15 pb-2">
                <p className="font-semibold text-[15px]">{c.sujet}</p>
                <p className="text-[13px] text-gris-brun">{c.destinataire} · {dateHeure(c.cree_le)} · <Statut s={c.statut} /></p>
              </li>
            ))}
            {!courriels.data?.length && <li className="text-gris-brun">Aucun courriel pour l&apos;instant.</li>}
          </ul>
        </Carte>
      </div>
    </>
  );
}
