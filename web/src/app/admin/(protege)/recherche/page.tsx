import Link from "next/link";
import { Carte, champCls, Statut, Titre } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin";
import { argent, dateCourte, dateLongue, plage } from "@/lib/format";

export const metadata = { title: "Recherche" };

type Element = { cle: string; quoi: string; detail: string; statut?: string; montant?: number | null; quand: string; href: string };
type Fiche = { courriel: string; noms: Set<string>; telephones: Set<string>; entreprises: Set<string>; elements: Element[] };

/**
 * Recherche d'un client dans toutes les sections (salles, kiosques, remisage, danse, messages).
 * Les résultats sont regroupés par adresse courriel : une fiche par client, avec tout ce qu'il a réservé.
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { sb } = await exigerAdmin();
  const { q = "" } = await searchParams;
  // On retire les caractères qui ont un sens dans un filtre PostgREST
  const terme = q.trim().slice(0, 80).replace(/[%,()*\\"]/g, " ").trim();
  const fiches = new Map<string, Fiche>();

  if (terme.length >= 2) {
    const m = `%${terme}%`;
    const ou = (...colonnes: string[]) => colonnes.map((c) => `${c}.ilike.${m}`).join(",");
    const [salles, kiosques, remisages, danses, messages] = await Promise.all([
      sb.from("reservations_salle").select("id, nom, courriel, telephone, statut, type_evenement, montant_cents, cree_le, creneaux_salle(debut, fin, salles(nom))")
        .or(ou("nom", "courriel", "telephone")).in("statut", ["confirmee", "annulee", "en_paiement"]).order("cree_le", { ascending: false }).limit(40),
      sb.from("demandes_kiosque").select("id, nom, entreprise, courriel, telephone, statut, type, annee, montant_cents, cree_le, emplacements_kiosque(code)")
        .or(ou("nom", "entreprise", "courriel", "telephone")).order("cree_le", { ascending: false }).limit(40),
      sb.from("demandes_remisage").select("id, nom, courriel, telephone, statut, type_vehicule, marque_modele, longueur_pi, depot_cents, saison, cree_le")
        .or(ou("nom", "courriel", "telephone", "marque_modele")).order("cree_le", { ascending: false }).limit(40),
      sb.from("inscriptions_danse").select("id, nom, courriel, telephone, statut, personnes, montant_cents, cree_le, prix(libelle)")
        .or(ou("nom", "courriel", "telephone")).neq("statut", "expiree").order("cree_le", { ascending: false }).limit(40),
      sb.from("messages").select("id, nom, courriel, telephone, sujet, formulaire, traite, cree_le")
        .or(ou("nom", "courriel", "telephone", "sujet")).order("cree_le", { ascending: false }).limit(40),
    ]);

    const fiche = (courriel: string, nom: string, telephone?: string | null, entreprise?: string | null) => {
      const cle = (courriel || nom).toLowerCase();
      let f = fiches.get(cle);
      if (!f) fiches.set(cle, (f = { courriel, noms: new Set(), telephones: new Set(), entreprises: new Set(), elements: [] }));
      if (nom) f.noms.add(nom);
      if (telephone) f.telephones.add(telephone);
      if (entreprise) f.entreprises.add(entreprise);
      return f;
    };

    for (const r of salles.data ?? []) {
      const c = r.creneaux_salle as unknown as { debut: string; fin: string; salles: { nom: string } } | null;
      fiche(r.courriel, r.nom, r.telephone).elements.push({
        cle: r.id, quoi: `Salle · ${c?.salles.nom ?? ""}`, detail: c ? `${dateLongue(c.debut)}, ${plage(c.debut, c.fin)} · ${r.type_evenement}` : r.type_evenement,
        statut: r.statut, montant: r.montant_cents, quand: r.cree_le, href: "/admin/reservations?voir=toutes",
      });
    }
    for (const k of kiosques.data ?? []) {
      const code = (k.emplacements_kiosque as unknown as { code: string } | null)?.code;
      fiche(k.courriel, k.nom, k.telephone, k.entreprise).elements.push({
        cle: k.id, quoi: k.type === "interieur" ? `Kiosque intérieur ${code ?? ""}` : "Kiosque extérieur", detail: `Expo ${k.annee}`,
        statut: k.statut, montant: k.montant_cents, quand: k.cree_le, href: "/admin/kiosques",
      });
    }
    for (const r of remisages.data ?? []) {
      fiche(r.courriel, r.nom, r.telephone).elements.push({
        cle: r.id, quoi: `Remisage · ${r.type_vehicule}`, detail: `${r.marque_modele ? `${r.marque_modele} · ` : ""}${r.longueur_pi} pi${r.saison ? ` · saison ${r.saison}` : ""}`,
        statut: r.statut, montant: r.depot_cents, quand: r.cree_le, href: "/admin/remisage?voir=toutes",
      });
    }
    for (const d of danses.data ?? []) {
      fiche(d.courriel, d.nom, d.telephone).elements.push({
        cle: d.id, quoi: "Danse country", detail: `${(d.prix as unknown as { libelle: string } | null)?.libelle ?? ""} · ${d.personnes} pers.`,
        statut: d.statut, montant: d.montant_cents, quand: d.cree_le, href: "/admin/danse",
      });
    }
    for (const msg of messages.data ?? []) {
      fiche(msg.courriel, msg.nom, msg.telephone).elements.push({
        cle: msg.id, quoi: `Message · ${msg.formulaire === "contact" ? "Contact" : "Exposants"}`, detail: `${msg.sujet || "Sans sujet"} · ${msg.traite ? "traité" : "à traiter"}`,
        quand: msg.cree_le, href: "/admin/messages",
      });
    }
  }

  const liste = [...fiches.values()].sort((a, b) => b.elements.length - a.elements.length);
  const total = liste.reduce((s, f) => s + f.elements.length, 0);

  return (
    <>
      <Titre sous="Cherchez par nom, entreprise, courriel ou téléphone. Tout ce que le client a réservé, demandé ou écrit apparaît sur sa fiche.">Trouver un client</Titre>
      <form method="get" role="search" className="mb-5 flex flex-wrap items-end gap-3">
        <label className="grow max-w-[520px]">
          <span className="sr-only">Nom, entreprise, courriel ou téléphone</span>
          <input type="search" name="q" defaultValue={q} autoFocus={!terme} placeholder="Ex. : Poulin, 418 555, ferme, @gmail.com" className={`${champCls} min-h-[48px] text-[17px]`} />
        </label>
        <button type="submit" className="min-h-[48px] px-5 border-2 border-encre bg-rouge text-creme font-etiquette font-bold uppercase tracking-wide text-[15px] hover:bg-rouge-fonce">Chercher</button>
      </form>

      {terme.length === 1 && <p className="text-gris-brun">Tapez au moins 2 caractères.</p>}
      {terme.length >= 2 && (
        <p className="mb-3 text-[15px] text-gris-brun" role="status">
          {liste.length ? `${liste.length} client${liste.length > 1 ? "s" : ""}, ${total} élément${total > 1 ? "s" : ""} pour « ${terme} ».` : `Rien trouvé pour « ${terme} ». Essayez une partie du nom ou du numéro.`}
        </p>
      )}

      <div className="grid gap-4">
        {liste.map((f) => {
          const paye = f.elements.filter((e) => ["confirmee", "payee", "depot_paye"].includes(e.statut ?? "")).reduce((s, e) => s + (e.montant ?? 0), 0);
          return (
            <Carte key={f.courriel || [...f.noms][0]}
              titre={<>{[...f.noms].join(" / ")}{f.entreprises.size > 0 && <span className="font-normal text-[16px] text-gris-brun"> · {[...f.entreprises].join(" / ")}</span>}</>}
              action={f.courriel ? <Link href={`/admin/boite-envoi?q=${encodeURIComponent(f.courriel)}`} className="text-[14px] underline">Courriels envoyés à ce client</Link> : undefined}>
              <p className="text-[15px] mb-3">
                {f.courriel && <a href={`mailto:${f.courriel}`}>{f.courriel}</a>}
                {[...f.telephones].map((t) => <span key={t}> · <a href={`tel:${t}`}>{t}</a></span>)}
                {paye > 0 && <span className="text-gris-brun"> · payé en ligne : <strong className="text-encre">{argent(paye)}</strong></span>}
              </p>
              <ul>
                {f.elements.sort((a, b) => b.quand.localeCompare(a.quand)).map((e) => (
                  <li key={e.cle} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-encre/15 py-2">
                    <p className="min-w-0">
                      <strong>{e.quoi}</strong>
                      <span className="block text-[14px] text-gris-brun first-letter:uppercase">{e.detail} · reçu le {dateCourte(e.quand)}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      {e.montant != null && <span className="font-semibold whitespace-nowrap">{argent(e.montant)}</span>}
                      {e.statut && <Statut s={e.statut} />}
                      <Link href={e.href} className="min-h-[40px] inline-flex items-center underline text-[15px]">Ouvrir la section</Link>
                    </p>
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
