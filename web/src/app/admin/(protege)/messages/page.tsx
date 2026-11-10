import FormAction from "@/components/admin/FormAction";
import { marquerMessage } from "@/actions/admin/gestion";
import { Carte, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { dateHeure } from "@/lib/format";

export const metadata = { title: "Messages" };

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data } = await sb.from("messages").select("*").order("traite").order("cree_le", { ascending: false }).limit(300);
  return (
    <>
      <Titre sous="Messages reçus par les formulaires Contact et Exposants.">Messages</Titre>
      <div className="grid gap-3">
        {!data?.length && <Carte><p className="text-gris-brun">Aucun message.</p></Carte>}
        {(data ?? []).map((m) => (
          <Carte key={m.id} className={m.traite ? "opacity-70" : ""}
            titre={<>{m.sujet || m.formulaire} <span className="font-normal text-[15px] text-gris-brun">· {m.formulaire === "contact" ? "Contact" : "Exposants"}</span></>}
            action={<span className="text-[14px] text-gris-brun">{dateHeure(m.cree_le)}</span>}>
            <p className="text-[15px]"><strong>{m.nom}</strong>{m.donnees?.entreprise ? ` (${m.donnees.entreprise})` : ""} · <a href={`mailto:${m.courriel}`}>{m.courriel}</a>{m.telephone && <> · <a href={`tel:${m.telephone}`}>{m.telephone}</a></>}</p>
            {m.message && <p className="mt-2 whitespace-pre-line">{m.message}</p>}
            {edition && (
              <div className="mt-3">
                <FormAction action={marquerMessage} bouton={m.traite ? "Remettre à traiter" : "Marquer comme traité"} style={m.traite ? "secondaire" : "succes"} enLigne>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="traite" value={m.traite ? "non" : "oui"} />
                </FormAction>
              </div>
            )}
          </Carte>
        ))}
      </div>
    </>
  );
}
