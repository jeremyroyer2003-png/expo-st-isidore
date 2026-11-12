import ApercuCourriel from "@/components/admin/ApercuCourriel";
import { Carte, champCls, etiquetteCls, Statut, Titre } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin";
import { env } from "@/lib/env";
import { dateHeure } from "@/lib/format";

export const metadata = { title: "Boîte d'envoi" };

const PAR_PAGE = 50;
const QUI = { tous: "Tous", clients: "Aux clients", bureau: "Au bureau" } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; qui?: string }> }) {
  const { sb } = await exigerAdmin();
  const { q = "", qui = "tous" } = await searchParams;
  // Recherche : on retire les caractères qui ont un sens dans un filtre PostgREST
  const terme = q.trim().slice(0, 80).replace(/[%,()*\\]/g, " ").trim();

  let requete = sb.from("courriels_sortants").select("id, destinataire, sujet, gabarit, statut, cree_le", { count: "exact" })
    .order("cree_le", { ascending: false }).limit(PAR_PAGE);
  if (terme) requete = requete.or(`destinataire.ilike.%${terme}%,sujet.ilike.%${terme}%`);
  if (qui === "clients") requete = requete.neq("destinataire", env.courrielAdmin);
  if (qui === "bureau") requete = requete.eq("destinataire", env.courrielAdmin);
  const { data, count } = await requete;
  const simule = env.courrielFournisseur === "console";

  return (
    <>
      <Titre sous={simule
        ? "Mode simulé : aucun courriel ne part vraiment. Chaque courriel que le site aurait envoyé est gardé ici (et affiché dans le terminal). Pour l'envoi réel, voir le guide du développeur (Resend)."
        : "Envoi réel activé (Resend). Chaque courriel envoyé est gardé ici."}>Boîte d&apos;envoi</Titre>

      <form method="get" role="search" className="mb-4 flex flex-wrap items-end gap-3">
        <label className="grow max-w-[420px]">
          <span className={etiquetteCls}>Chercher un courriel</span>
          <input type="search" name="q" defaultValue={q} placeholder="Adresse du client ou mot du sujet" className={champCls} />
        </label>
        <label>
          <span className={etiquetteCls}>Envoyés</span>
          <select name="qui" defaultValue={qui} className={champCls}>
            {Object.entries(QUI).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </label>
        <button type="submit" className="min-h-[40px] px-4 border-2 border-encre bg-rouge text-creme font-etiquette font-bold uppercase tracking-wide text-[14px] hover:bg-rouge-fonce">Chercher</button>
        {(terme || qui !== "tous") && <a href="/admin/boite-envoi" className="min-h-[40px] inline-flex items-center underline text-[15px]">Tout afficher</a>}
      </form>
      <p className="mb-3 text-[15px] text-gris-brun" role="status">
        {count ?? 0} courriel{(count ?? 0) > 1 ? "s" : ""}{terme ? ` pour « ${terme} »` : ""}
        {(count ?? 0) > PAR_PAGE ? `. Les ${PAR_PAGE} plus récents sont affichés : précisez la recherche pour voir les autres.` : "."}
      </p>

      <div className="grid gap-3">
        {!data?.length && <Carte><p className="text-gris-brun">{terme ? "Aucun courriel ne correspond à cette recherche." : "Aucun courriel pour l'instant."}</p></Carte>}
        {(data ?? []).map((c) => (
          <Carte key={c.id}>
            <ApercuCourriel id={c.id} sujet={c.sujet}>
              <span><strong className="text-[16px]">{c.sujet}</strong><br /><span className="text-[14px] text-gris-brun">À : {c.destinataire}</span></span>
              <span className="flex items-center gap-2 text-[14px] text-gris-brun">{dateHeure(c.cree_le)} <Statut s={c.statut} /></span>
            </ApercuCourriel>
          </Carte>
        ))}
      </div>
    </>
  );
}
