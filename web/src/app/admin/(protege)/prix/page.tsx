import FormAction from "@/components/admin/FormAction";
import { majPrix } from "@/actions/admin/gestion";
import { Carte, champCls, etiquetteCls, LectureSeule, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent } from "@/lib/format";

export const metadata = { title: "Prix" };

const CATEGORIES: Record<string, string> = { salle: "Location de salle", kiosque: "Kiosques", danse: "Danse country", remisage: "Remisage d'hiver", frais: "Frais d'annulation" };

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const { data } = await sb.from("prix").select("*").order("categorie").order("ordre");

  return (
    <>
      <Titre sous="Tous les prix du site. Un prix coché « À confirmer » est une valeur de départ fictive : le public voit « Prix sur demande » et ne peut pas payer en ligne. Décochez-le une fois le prix validé par le comité.">Prix</Titre>
      {!edition && <LectureSeule />}
      <div className="grid gap-6">
        {Object.entries(CATEGORIES).map(([cat, nom]) => {
          const liste = (data ?? []).filter((p) => p.categorie === cat);
          if (!liste.length) return null;
          return (
            <Carte key={cat} titre={nom}>
              <ul className="grid gap-4">
                {liste.map((p) => (
                  <li key={p.cle} className={`border-2 p-3 ${p.a_confirmer ? "border-dashed border-rouille bg-[#FFF8EC]" : "border-encre/30 bg-white"}`}>
                    {edition ? (
                      <FormAction action={majPrix} bouton="Enregistrer" style="secondaire">
                        <input type="hidden" name="cle" value={p.cle} />
                        <div className="grid gap-3 md:grid-cols-[1.2fr_140px_1.6fr]">
                          <label><span className={etiquetteCls}>Nom</span><input name="libelle" defaultValue={p.libelle} required className={champCls} /></label>
                          <label><span className={etiquetteCls}>Montant ($ / {p.unite})</span><input name="montant" type="number" step="0.01" min={0} required defaultValue={(p.montant_cents / 100).toFixed(2)} className={champCls} /></label>
                          <label><span className={etiquetteCls}>Description</span><input name="description" defaultValue={p.description} className={champCls} /></label>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          <label className="flex items-center gap-2 min-h-[40px] font-semibold text-rouille"><input type="checkbox" name="a_confirmer" value="oui" defaultChecked={p.a_confirmer} /> À confirmer (fictif, caché au public)</label>
                          <label className="flex items-center gap-2 min-h-[40px]"><input type="checkbox" name="actif" value="oui" defaultChecked={p.actif} /> Offert</label>
                        </div>
                      </FormAction>
                    ) : (
                      <p><strong>{p.libelle}</strong> : {argent(p.montant_cents)} / {p.unite} {p.a_confirmer && <span className="text-rouille font-semibold">(à confirmer)</span>}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Carte>
          );
        })}
      </div>
    </>
  );
}
