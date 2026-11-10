import FormAction from "@/components/admin/FormAction";
import { enregistrerEvenement, supprimerEvenement } from "@/actions/admin/gestion";
import { Carte, champCls, etiquetteCls, LectureSeule, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";

export const metadata = { title: "Programmation" };

const CATS = [["animaux", "Animaux"], ["tire", "Tire"], ["spectacles", "Spectacles"], ["famille", "Famille"], ["kiosques", "Kiosques"], ["autres", "Autres"]];

type Ev = { id?: string; jour?: string; heure?: string; titre?: string; lieu?: string; prix?: string; description?: string; categories?: string[]; photo?: string; publie?: boolean; ordre?: number };

function Champs({ e }: { e: Ev }) {
  return (
    <>
      {e.id && <input type="hidden" name="id" value={e.id} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <label><span className={etiquetteCls}>Date</span><input type="date" name="jour" required defaultValue={e.jour} className={champCls} /></label>
        <label><span className={etiquetteCls}>Heure</span><input name="heure" required defaultValue={e.heure} placeholder="19 h ou 17 h à 21 h" className={champCls} /></label>
        <label><span className={etiquetteCls}>Ordre dans la journée</span><input type="number" name="ordre" min={0} max={99} defaultValue={e.ordre ?? 0} className={champCls} /></label>
        <label className="sm:col-span-2"><span className={etiquetteCls}>Titre</span><input name="titre" required defaultValue={e.titre} className={champCls} /></label>
        <label><span className={etiquetteCls}>Lieu</span><input name="lieu" defaultValue={e.lieu} className={champCls} placeholder="Aréna, grand chapiteau…" /></label>
        <label><span className={etiquetteCls}>Prix (texte)</span><input name="prix" defaultValue={e.prix} className={champCls} placeholder="Gratuit, 15 $…" /></label>
        <label className="sm:col-span-2"><span className={etiquetteCls}>Photo (adresse, facultatif)</span><input name="photo" defaultValue={e.photo} className={champCls} placeholder="Copiée depuis la médiathèque" /></label>
        <label className="sm:col-span-3"><span className={etiquetteCls}>Description</span><textarea name="description" rows={2} defaultValue={e.description} className={champCls} /></label>
      </div>
      <fieldset className="flex flex-wrap gap-4 items-center">
        <legend className={etiquetteCls}>Catégories</legend>
        {CATS.map(([v, t]) => <label key={v} className="flex items-center gap-1 min-h-[40px]"><input type="checkbox" name="categories" value={v} defaultChecked={e.categories?.includes(v)} /> {t}</label>)}
        <label className="flex items-center gap-1 min-h-[40px] ml-4 font-semibold"><input type="checkbox" name="publie" value="oui" defaultChecked={e.publie ?? true} /> Publié</label>
      </fieldset>
    </>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ annee?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data: annees } = await sb.from("evenements").select("annee").order("annee", { ascending: false });
  const liste = [...new Set((annees ?? []).map((a) => a.annee))];
  const annee = Number((await searchParams).annee) || liste[0] || new Date().getFullYear();
  const { data } = await sb.from("evenements").select("*").eq("annee", annee).order("jour").order("ordre");
  const parJour = new Map<string, Ev[]>();
  (data ?? []).forEach((e) => parJour.set(e.jour, [...(parJour.get(e.jour) ?? []), e]));

  return (
    <>
      <Titre sous="La page Programmation affiche la plus récente année qui a des événements publiés. Pour préparer 2027 sans rien montrer, décochez « Publié ».">Programmation</Titre>
      {!edition && <LectureSeule />}
      <nav className="flex flex-wrap gap-2 mb-4" aria-label="Année">
        {liste.map((a) => <a key={a} href={`?annee=${a}`} aria-current={a === annee ? "page" : undefined}
          className={`px-3 min-h-[40px] inline-flex items-center border-2 border-encre font-etiquette font-bold no-underline ${a === annee ? "bg-encre text-creme" : "bg-[#FBF6EC]"}`}>{a}</a>)}
      </nav>
      {edition && (
        <Carte titre="Ajouter un événement" className="mb-6">
          <FormAction action={enregistrerEvenement} bouton="Ajouter l'événement"><Champs e={{}} /></FormAction>
        </Carte>
      )}
      <div className="grid gap-4">
        {[...parJour.entries()].map(([jour, evs]) => (
          <Carte key={jour} titre={<span className="first-letter:uppercase">{new Date(jour + "T12:00:00").toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>}>
            <ul className="grid gap-2">
              {evs.map((e) => (
                <li key={e.id} className="border-t border-encre/15 pt-2">
                  <details>
                    <summary className="cursor-pointer text-[16px]"><strong>{e.heure}</strong> · {e.titre} <span className="text-gris-brun">· {e.lieu}</span>{!e.publie && <span className="ml-2 text-rouge font-semibold">(brouillon)</span>}</summary>
                    {edition ? (
                      <div className="mt-3 grid gap-3">
                        <FormAction action={enregistrerEvenement} bouton="Enregistrer" enLigne={false}><Champs e={e} /></FormAction>
                        <FormAction action={supprimerEvenement} bouton="Supprimer" style="danger" confirmer={`Supprimer « ${e.titre} »?`}><input type="hidden" name="id" value={e.id} /></FormAction>
                      </div>
                    ) : <p className="mt-2 text-[15px]">{e.description}</p>}
                  </details>
                </li>
              ))}
            </ul>
          </Carte>
        ))}
      </div>
    </>
  );
}
