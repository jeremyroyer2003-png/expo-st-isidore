import FormAction from "@/components/admin/FormAction";
import { majContenu } from "@/actions/admin/gestion";
import { Carte, champCls, LectureSeule, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";

export const metadata = { title: "Textes du site" };

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data } = await sb.from("contenus").select("*").order("cle");
  return (
    <>
      <Titre sous="Les phrases qui changent souvent (horaires, avis, saisons). Les autres textes du site sont dans le code; demandez au développeur pour les changer.">Textes du site</Titre>
      {!edition && <LectureSeule />}
      <div className="grid gap-4">
        {(data ?? []).map((c) => (
          <Carte key={c.cle} titre={c.libelle}>
            {edition ? (
              <FormAction action={majContenu} bouton="Enregistrer" style="secondaire" enLigne>
                <input type="hidden" name="cle" value={c.cle} />
                <textarea name="valeur" rows={c.valeur.length > 120 ? 3 : 1} defaultValue={c.valeur} aria-label={c.libelle} className={`${champCls} min-w-[min(640px,80vw)]`} />
              </FormAction>
            ) : <p>{c.valeur || <em className="text-gris-brun">(vide)</em>}</p>}
          </Carte>
        ))}
      </div>
    </>
  );
}
