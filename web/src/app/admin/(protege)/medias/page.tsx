import FormAction from "@/components/admin/FormAction";
import { ajouterVideo, majMedia, supprimerMedia, televerserPhoto } from "@/actions/admin/medias";
import { Carte, champCls, etiquetteCls, LectureSeule, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { ALBUMS } from "@/lib/albums";

export const metadata = { title: "Médiathèque" };

function Albums({ defaut }: { defaut?: string }) {
  return (
    <select name="categorie" defaultValue={defaut ?? "galerie"} className={champCls}>
      {Object.entries(ALBUMS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
    </select>
  );
}

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data } = await sb.from("medias").select("*").order("categorie").order("ordre");

  return (
    <>
      <Titre sous="Les photos et vidéos de la page Photos. Pas de photos d'enfants identifiables, et seulement des photos dont l'Expo a les droits; indiquez le crédit du photographe.">Médiathèque</Titre>
      {!edition && <LectureSeule />}
      {edition && (
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Carte titre="Ajouter une photo">
            <FormAction action={televerserPhoto} bouton="Téléverser">
              <label><span className={etiquetteCls}>Photo (JPEG, PNG ou WebP, 8 Mo au plus)</span><input type="file" name="fichier" accept="image/jpeg,image/png,image/webp" required className="block text-[15px]" /></label>
              <label><span className={etiquetteCls}>Description (lue par les lecteurs d&apos;écran)</span><input name="alt" required className={champCls} placeholder="Tracteur vert qui tire le traîneau devant la foule" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label><span className={etiquetteCls}>Album</span><Albums /></label>
                <label><span className={etiquetteCls}>Crédit</span><input name="credit" className={champCls} placeholder="Photo : …" /></label>
              </div>
              <label className="flex items-center gap-2 min-h-[40px]"><input type="checkbox" name="publie" value="oui" defaultChecked /> Publier tout de suite</label>
            </FormAction>
          </Carte>
          <Carte titre="Ajouter une vidéo">
            <FormAction action={ajouterVideo} bouton="Ajouter la vidéo">
              <label><span className={etiquetteCls}>Lien YouTube, Facebook ou Vimeo</span><input name="url" type="url" required className={champCls} placeholder="https://www.facebook.com/…" /></label>
              <label><span className={etiquetteCls}>Titre</span><input name="alt" required className={champCls} placeholder="Tire de tracteurs 2026, finale" /></label>
              <label><span className={etiquetteCls}>Image d&apos;aperçu (adresse d&apos;une photo, facultatif)</span><input name="vignette" className={champCls} /></label>
              <label><span className={etiquetteCls}>Crédit</span><input name="credit" className={champCls} /></label>
              <label className="flex items-center gap-2 min-h-[40px]"><input type="checkbox" name="publie" value="oui" defaultChecked /> Publier tout de suite</label>
            </FormAction>
          </Carte>
        </div>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((m) => (
          <li key={m.id} className={`bg-[#FBF6EC] border-[3px] border-encre shadow-affiche-sm ${m.publie ? "" : "opacity-60"}`}>
            {m.type === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.vignette || m.url} alt={m.alt} loading="lazy" className="w-full aspect-[3/2] object-cover border-b-[3px] border-encre" />
            ) : (
              <a href={m.url} target="_blank" rel="noopener" className="grid place-items-center aspect-[3/2] bg-planche text-creme border-b-[3px] border-encre font-etiquette font-bold">▶ Vidéo</a>
            )}
            <div className="p-3">
              {edition ? (
                <>
                  <FormAction action={majMedia} bouton="Enregistrer" style="secondaire">
                    <input type="hidden" name="id" value={m.id} />
                    <label><span className={etiquetteCls}>Description</span><input name="alt" defaultValue={m.alt} required className={champCls} /></label>
                    <div className="grid grid-cols-[1fr_80px] gap-2">
                      <label><span className={etiquetteCls}>Album</span><Albums defaut={m.categorie} /></label>
                      <label><span className={etiquetteCls}>Ordre</span><input name="ordre" type="number" defaultValue={m.ordre} className={champCls} /></label>
                    </div>
                    <label><span className={etiquetteCls}>Crédit</span><input name="credit" defaultValue={m.credit} className={champCls} /></label>
                    <label className="flex items-center gap-2"><input type="checkbox" name="publie" value="oui" defaultChecked={m.publie} /> Publiée</label>
                  </FormAction>
                  <div className="mt-2">
                    <FormAction action={supprimerMedia} bouton="Supprimer" style="danger" enLigne confirmer="Supprimer ce média de la galerie?"><input type="hidden" name="id" value={m.id} /></FormAction>
                  </div>
                </>
              ) : (
                <p className="text-[14px]">{m.alt}<br /><span className="text-gris-brun">{ALBUMS[m.categorie] ?? m.categorie}{m.credit && ` · ${m.credit}`}</span></p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
