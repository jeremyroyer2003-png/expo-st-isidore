import { Carte, Statut, Titre } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin";
import { env } from "@/lib/env";
import { dateHeure } from "@/lib/format";

export const metadata = { title: "Boîte d'envoi" };

export default async function Page() {
  const { sb } = await exigerAdmin();
  const { data } = await sb.from("courriels_sortants").select("*").order("cree_le", { ascending: false }).limit(200);
  const simule = env.courrielFournisseur === "console";
  return (
    <>
      <Titre sous={simule
        ? "Mode simulé : aucun courriel ne part vraiment. Chaque courriel que le site aurait envoyé est gardé ici (et affiché dans le terminal). Pour l'envoi réel, voir le guide du développeur (Resend)."
        : "Envoi réel activé (Resend). Chaque courriel envoyé est gardé ici."}>Boîte d&apos;envoi</Titre>
      <div className="grid gap-3">
        {!data?.length && <Carte><p className="text-gris-brun">Aucun courriel pour l&apos;instant.</p></Carte>}
        {(data ?? []).map((c) => (
          <Carte key={c.id}>
            <details>
              <summary className="cursor-pointer grid gap-1 sm:grid-cols-[1fr_auto] items-center">
                <span><strong className="text-[16px]">{c.sujet}</strong><br /><span className="text-[14px] text-gris-brun">À : {c.destinataire} · gabarit {c.gabarit}</span></span>
                <span className="flex items-center gap-2 text-[14px] text-gris-brun">{dateHeure(c.cree_le)} <Statut s={c.statut} /></span>
              </summary>
              {c.erreur && <p className="mt-2 text-rouge text-[14px]">Erreur : {c.erreur}</p>}
              {/* Aperçu isolé (sandbox) : le HTML du courriel ne peut rien exécuter dans l'admin */}
              <iframe title={`Aperçu : ${c.sujet}`} srcDoc={c.html} sandbox="" className="mt-3 w-full h-[520px] border-2 border-encre bg-white" />
            </details>
          </Carte>
        ))}
      </div>
    </>
  );
}
