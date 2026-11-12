import Exporter from "@/components/admin/Exporter";
import Annulation from "@/components/admin/Annulation";
import { Carte, LectureSeule, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent, dateLongue, plage } from "@/lib/format";

export const metadata = { title: "Réservations de salles" };

export default async function Page({ searchParams }: { searchParams: Promise<{ voir?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const { voir = "a-venir" } = await searchParams;
  const edition = peutEditer(profil);
  const [{ data: resas }, { data: frais }] = await Promise.all([
    sb.from("reservations_salle").select("*, creneaux_salle(debut, fin, salles(nom))").order("cree_le", { ascending: false }).limit(300),
    sb.from("prix").select("montant_cents").eq("cle", "frais_annulation_salle").maybeSingle(),
  ]);
  const maintenant = new Date().toISOString();
  type C = { debut: string; fin: string; salles: { nom: string } };
  const liste = (resas ?? []).filter((r) => {
    const c = r.creneaux_salle as C;
    if (voir === "toutes") return true;
    if (voir === "passees") return c.debut < maintenant && r.statut === "confirmee";
    return c.debut >= maintenant && ["confirmee", "en_paiement"].includes(r.statut);
  }).sort((a, b) => (a.creneaux_salle as C).debut.localeCompare((b.creneaux_salle as C).debut));

  return (
    <>
      <Titre sous="Les réservations payées en ligne. Une annulation rembourse le client moins les frais, et rouvre la date.">Salles réservées</Titre>
      {!edition && <LectureSeule />}
      <nav className="flex flex-wrap gap-2 mb-4" aria-label="Filtre">
        {[["a-venir", "À venir"], ["passees", "Passées"], ["toutes", "Toutes"]].map(([v, t]) => (
          <a key={v} href={`?voir=${v}`} aria-current={voir === v ? "page" : undefined}
            className={`px-3 min-h-[40px] inline-flex items-center border-2 border-encre font-etiquette font-bold no-underline ${voir === v ? "bg-encre text-creme" : "bg-[#FBF6EC] text-encre"}`}>{t}</a>
        ))}
        <span className="ml-auto"><Exporter type="salles" /></span>
      </nav>
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
                <td>{edition && r.statut === "confirmee" && <Annulation type="salle" id={r.id} fraisCents={frais?.montant_cents ?? 0} paye />}</td>
              </tr>
            );
          })}
        </Tableau>
      </Carte>
    </>
  );
}
