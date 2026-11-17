import FormAction from "@/components/admin/FormAction";
import { ajouterCreneaux, basculerCreneau, deverrouillerDate, verrouillerDate } from "@/actions/admin/gestion";
import { Carte, champCls, etiquetteCls, LectureSeule, Statut, Titre } from "@/components/admin/ui";
import { exigerAdmin, peutEditer } from "@/lib/admin";
import { argent, dateLongue, heure, jourLocal, plage } from "@/lib/format";

export const metadata = { title: "Calendrier des salles" };

const JOURS = [["1", "lun"], ["2", "mar"], ["3", "mer"], ["4", "jeu"], ["5", "ven"], ["6", "sam"], ["0", "dim"]];

// Couleur de chaque créneau dans la grille du mois (mêmes couleurs que les étiquettes de statut)
const TEINTE: Record<string, string> = {
  ouvert: "bg-moutarde text-encre",
  retenu: "bg-kraft text-encre",
  reserve: "bg-olive text-encre",
  verrouille: "bg-encre text-creme",
};
const LEGENDE: [string, string][] = [["ouvert", "Libre (offert au public)"], ["retenu", "Paiement en cours"], ["reserve", "Réservé"], ["verrouille", "Verrouillé"]];

export default async function Page({ searchParams }: { searchParams: Promise<{ mois?: string; salle?: string; jour?: string }> }) {
  const { sb, profil } = await exigerAdmin();
  const edition = peutEditer(profil);
  const params = await searchParams;
  const auj = jourLocal(new Date());
  const mois = /^\d{4}-\d{2}$/.test(params.mois ?? "") ? params.mois! : auj.slice(0, 7);
  const [a, m] = mois.split("-").map(Number);
  const debut = new Date(Date.UTC(a, m - 1, 1, 5)).toISOString();
  const fin = new Date(Date.UTC(a, m, 1, 5)).toISOString();
  const precedent = new Date(Date.UTC(a, m - 2, 1)).toISOString().slice(0, 7);
  const suivant = new Date(Date.UTC(a, m, 1)).toISOString().slice(0, 7);

  const [{ data: salles }, { data: creneaux }, { data: verrous }] = await Promise.all([
    sb.from("salles").select("id, nom").order("ordre"),
    sb.from("creneaux_salle").select("*, salles(nom), reservations_salle(nom, statut)").gte("debut", debut).lt("debut", fin).order("debut"),
    sb.from("dates_verrouillees").select("*, salles(nom)").gte("jour", auj).order("jour"),
  ]);
  const filtre = params.salle;
  const jourChoisi = /^\d{4}-\d{2}-\d{2}$/.test(params.jour ?? "") && params.jour!.startsWith(mois) ? params.jour! : undefined;
  const liste = (creneaux ?? []).filter((c) => !filtre || c.salle_id === filtre);
  const parJour = new Map<string, typeof liste>();
  liste.forEach((c) => { const j = jourLocal(c.debut); parJour.set(j, [...(parJour.get(j) ?? []), c]); });
  const titreMois = new Date(a, m - 1, 1).toLocaleDateString("fr-CA", { month: "long", year: "numeric" });
  const lien = (o: Record<string, string | undefined>) => "?" + new URLSearchParams(Object.entries({ mois, salle: filtre, jour: jourChoisi, ...o }).filter(([, v]) => v) as [string, string][]).toString();

  // Grille du mois : semaines du lundi au dimanche
  const decalage = (new Date(Date.UTC(a, m - 1, 1, 12)).getUTCDay() + 6) % 7;
  const nbJours = new Date(Date.UTC(a, m, 0, 12)).getUTCDate();
  const cases: (string | null)[] = [
    ...Array<null>(decalage).fill(null),
    ...Array.from({ length: nbJours }, (_, i) => `${mois}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cases.length % 7) cases.push(null);
  const verrouille = (j: string) => (verrous ?? []).some((v) => v.jour === j && (!filtre || !v.salle_id || v.salle_id === filtre));
  const jours = jourChoisi ? [[jourChoisi, parJour.get(jourChoisi) ?? []] as const] : [...parJour.entries()];

  return (
    <>
      <Titre sous="Les créneaux « ouverts » apparaissent au public et se réservent en ligne. Verrouillez un créneau ou une date entière pour la bloquer (entretien, événement de l'Expo…).">Calendrier des salles</Titre>
      {!edition && <LectureSeule />}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] items-start">
        <Carte
          titre={<span className="capitalize">{titreMois}</span>}
          action={
            <div className="flex flex-wrap gap-2 items-center">
              <a href={lien({ mois: precedent, jour: "" })} className="px-3 min-h-[40px] inline-flex items-center border-2 border-encre bg-kraft font-bold no-underline">← Mois précédent</a>
              <a href={lien({ mois: suivant, jour: "" })} className="px-3 min-h-[40px] inline-flex items-center border-2 border-encre bg-kraft font-bold no-underline">Mois suivant →</a>
              <a href={lien({ salle: "" })} className={`px-2 underline ${!filtre ? "font-bold" : ""}`}>Toutes</a>
              {(salles ?? []).map((s) => <a key={s.id} href={lien({ salle: s.id })} className={`px-2 underline ${filtre === s.id ? "font-bold" : ""}`}>{s.nom}</a>)}
            </div>
          }>
          {/* Grille du mois : un clic sur un jour montre ses créneaux en dessous */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {JOURS.map(([v, t]) => <div key={v} className="text-center font-etiquette font-bold uppercase text-[12px] sm:text-[13px] text-gris-brun">{t}</div>)}
            {cases.map((j, i) => {
              if (!j) return <div key={`vide-${i}`} aria-hidden="true" />;
              const cs = parJour.get(j) ?? [];
              const bloque = verrouille(j);
              const passe = j < auj;
              const choisi = j === jourChoisi;
              const resume = cs.length ? `${cs.length} créneau${cs.length > 1 ? "x" : ""}` : "aucun créneau";
              return (
                <a key={j} href={lien({ jour: choisi ? "" : j })} aria-current={choisi ? "date" : undefined}
                  aria-label={`${dateLongue(j + "T12:00:00")} : ${resume}${bloque ? ", date verrouillée" : ""}`}
                  className={`min-h-[64px] sm:min-h-[92px] border-2 p-1 sm:p-1.5 no-underline text-encre flex flex-col gap-0.5 transition-colors hover:border-rouge
                    ${choisi ? "border-rouge ring-2 ring-rouge" : "border-encre"} ${passe ? "opacity-55" : ""}
                    ${bloque ? "bg-[repeating-linear-gradient(135deg,#FBF6EC_0_6px,#E8D9BA_6px_10px)]" : j === auj ? "bg-[#FFF3D1]" : "bg-white"}`}>
                  <span className={`font-etiquette font-extrabold text-[15px] leading-none ${j === auj ? "text-rouge" : ""}`}>{Number(j.slice(8))}</span>
                  {/* Téléphone : des pastilles; ordinateur : la salle et le statut */}
                  <span className="flex flex-wrap gap-0.5 sm:hidden" aria-hidden="true">
                    {cs.slice(0, 4).map((c) => <span key={c.id} className={`h-2.5 w-2.5 border border-encre ${TEINTE[c.statut] ?? "bg-kraft"}`} />)}
                  </span>
                  <span className="hidden sm:grid gap-0.5" aria-hidden="true">
                    {cs.slice(0, 3).map((c) => (
                      <span key={c.id} className={`truncate px-1 text-[11px] font-semibold leading-tight ${TEINTE[c.statut] ?? "bg-kraft"}`}>
                        {(c.salles as { nom: string }).nom.split(" ")[0]} · {heure(c.debut)}
                      </span>
                    ))}
                    {cs.length > 3 && <span className="text-[11px] text-gris-brun">+{cs.length - 3}</span>}
                  </span>
                </a>
              );
            })}
          </div>
          <ul className="mt-3 mb-5 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" aria-label="Légende">
            {LEGENDE.map(([s, t]) => <li key={s} className="flex items-center gap-1.5"><span className={`h-3 w-3 border border-encre ${TEINTE[s]}`} aria-hidden="true" />{t}</li>)}
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 border border-encre bg-[repeating-linear-gradient(135deg,#FBF6EC_0_3px,#E8D9BA_3px_5px)]" aria-hidden="true" />Date verrouillée</li>
          </ul>

          <h3 className="font-etiquette font-extrabold text-[19px] mb-2 first-letter:uppercase">
            {jourChoisi ? dateLongue(jourChoisi + "T12:00:00") : "Tous les créneaux du mois"}
            {jourChoisi && <a href={lien({ jour: "" })} className="ml-3 text-[14px] font-normal underline">Voir tout le mois</a>}
          </h3>
          {!parJour.size && !jourChoisi && <p className="text-gris-brun">Aucun créneau ce mois-ci. Ajoutez-en avec le formulaire.</p>}
          {jourChoisi && !parJour.get(jourChoisi)?.length && <p className="text-gris-brun">Aucun créneau ce jour-là.{edition && " Le formulaire « Ajouter des créneaux » est déjà réglé sur cette date."}</p>}
          <ul className="grid gap-3">
            {jours.filter(([, cs]) => cs.length).map(([j, cs]) => {
              const bloque = verrouille(j);
              return (
                <li key={j} className={`border-2 border-encre p-3 ${bloque ? "bg-[repeating-linear-gradient(135deg,#FBF6EC_0_8px,#E8D9BA_8px_12px)]" : "bg-white"}`}>
                  <p className="font-etiquette font-extrabold text-[18px] first-letter:uppercase">{dateLongue(cs[0].debut)} {bloque && <Statut s="verrouille" />}</p>
                  <ul className="mt-2 grid gap-2">
                    {cs.map((c) => {
                      const resa = (c.reservations_salle as { nom: string; statut: string }[]).find((r) => ["confirmee", "en_paiement"].includes(r.statut));
                      return (
                        <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
                          <strong className="min-w-[150px]">{(c.salles as { nom: string }).nom}</strong>
                          <span>{plage(c.debut, c.fin)}</span>
                          {c.prix_cents != null && <span>{argent(c.prix_cents)}</span>}
                          <Statut s={c.statut} />
                          {resa && <span className="text-gris-brun">{resa.nom}</span>}
                          {edition && c.statut === "ouvert" && (
                            <>
                              <FormAction action={basculerCreneau} bouton="Verrouiller" style="secondaire" enLigne><input type="hidden" name="id" value={c.id} /><input type="hidden" name="action" value="verrouiller" /></FormAction>
                              <FormAction action={basculerCreneau} bouton="Supprimer" style="danger" enLigne confirmer="Supprimer ce créneau?"><input type="hidden" name="id" value={c.id} /><input type="hidden" name="action" value="supprimer" /></FormAction>
                            </>
                          )}
                          {edition && c.statut === "verrouille" && (
                            <FormAction action={basculerCreneau} bouton="Rouvrir" style="succes" enLigne><input type="hidden" name="id" value={c.id} /><input type="hidden" name="action" value="ouvrir" /></FormAction>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Carte>

        <div className="grid gap-6">
          {edition && (
            <Carte titre="Ajouter des créneaux">
              <FormAction action={ajouterCreneaux} bouton="Ajouter">
                <fieldset>
                  <legend className={etiquetteCls}>Salles</legend>
                  <div className="flex flex-wrap gap-4">
                    {(salles ?? []).map((s) => <label key={s.id} className="flex items-center gap-2 min-h-[40px]"><input type="checkbox" name="salle" value={s.id} defaultChecked={!filtre || filtre === s.id} /> {s.nom}</label>)}
                  </div>
                </fieldset>
                <div className="grid grid-cols-2 gap-3">
                  <label><span className={etiquetteCls}>Du</span><input key={jourChoisi} type="date" name="du" required min={auj} defaultValue={jourChoisi && jourChoisi >= auj ? jourChoisi : undefined} className={champCls} /></label>
                  <label><span className={etiquetteCls}>Au (facultatif)</span><input type="date" name="au" min={auj} className={champCls} /></label>
                  <label><span className={etiquetteCls}>De</span><input type="time" name="debut" required defaultValue="17:00" className={champCls} /></label>
                  <label><span className={etiquetteCls}>À</span><input type="time" name="fin" required defaultValue="01:00" className={champCls} /></label>
                </div>
                <fieldset>
                  <legend className={etiquetteCls}>Jours (si plusieurs dates)</legend>
                  <div className="flex flex-wrap gap-3">{JOURS.map(([v, t]) => <label key={v} className="flex items-center gap-1 min-h-[40px]"><input type="checkbox" name="jour" value={v} defaultChecked={v === "5" || v === "6"} /> {t}</label>)}</div>
                </fieldset>
                <label><span className={etiquetteCls}>Prix particulier ($, facultatif)</span><input type="number" name="prix" step="0.01" min={0} className={champCls} placeholder="Vide = prix de la salle" /></label>
              </FormAction>
            </Carte>
          )}
          <Carte titre="Dates verrouillées">
            <ul className="grid gap-2 mb-4">
              {(verrous ?? []).map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-3 text-[15px]">
                  <strong>{dateLongue(v.jour + "T12:00:00")}</strong>
                  <span>{(v.salles as { nom: string } | null)?.nom ?? "Toutes les salles"}</span>
                  {v.raison && <span className="text-gris-brun">{v.raison}</span>}
                  {edition && <FormAction action={deverrouillerDate} bouton="Déverrouiller" style="secondaire" enLigne><input type="hidden" name="id" value={v.id} /></FormAction>}
                </li>
              ))}
              {!verrous?.length && <li className="text-gris-brun">Aucune date verrouillée à venir.</li>}
            </ul>
            {edition && (
              <FormAction action={verrouillerDate} bouton="Verrouiller la date" style="danger">
                <div className="grid grid-cols-2 gap-3">
                  <label><span className={etiquetteCls}>Date</span><input key={jourChoisi} type="date" name="jour" required min={auj} defaultValue={jourChoisi && jourChoisi >= auj ? jourChoisi : undefined} className={champCls} /></label>
                  <label><span className={etiquetteCls}>Salle</span>
                    <select name="salle" className={champCls} defaultValue=""><option value="">Toutes</option>{(salles ?? []).map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}</select>
                  </label>
                </div>
                <label><span className={etiquetteCls}>Raison (interne)</span><input name="raison" className={champCls} placeholder="Entretien, Expo, événement du comité…" /></label>
              </FormAction>
            )}
          </Carte>
        </div>
      </div>
    </>
  );
}
