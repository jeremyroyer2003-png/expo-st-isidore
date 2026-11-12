import Link from "next/link";
import { Carte, Chiffre, Statut, Tableau, Titre } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin";
import { argent, dateHeure, dateLongue } from "@/lib/format";

export const metadata = { title: "Tableau de bord" };

type Tache = { cle: string; quoi: string; qui: string; depuis: string; href: string; action: string; urgent?: boolean };

/** « depuis 3 jours », « depuis hier », « aujourd'hui » */
function age(iso: string): { texte: string; jours: number } {
  const jours = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  return { jours, texte: jours <= 0 ? "aujourd'hui" : jours === 1 ? "depuis hier" : `depuis ${jours} jours` };
}

export default async function Page() {
  const { sb, profil } = await exigerAdmin();
  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const maintenant = new Date().toISOString();
  const nb = { count: "exact", head: true } as const;
  const [kiosques, remisages, messages, aVenir, prochaines, paiementsMois, recents, courriels] = await Promise.all([
    sb.from("demandes_kiosque").select("id, type, statut, entreprise, nom, cree_le, maj_le, emplacements_kiosque(code)").in("statut", ["en_attente", "entente", "approuvee", "facturee"]).order("cree_le").limit(100),
    sb.from("demandes_remisage").select("id, statut, nom, type_vehicule, cree_le, maj_le").in("statut", ["en_attente", "approuvee"]).order("cree_le").limit(100),
    sb.from("messages").select("id, nom, sujet, formulaire, cree_le").eq("traite", false).order("cree_le").limit(50),
    sb.from("reservations_salle").select("id", nb).eq("statut", "confirmee").then((r) => r.count ?? 0),
    sb.from("reservations_salle").select("id, nom, type_evenement, personnes, creneaux_salle!inner(debut, fin, salles(nom))").eq("statut", "confirmee").gte("creneaux_salle.debut", maintenant).limit(200),
    sb.from("paiements").select("montant_cents, rembourse_cents").in("statut", ["paye", "rembourse_partiel", "rembourse"]).gte("maj_le", debutMois),
    sb.from("paiements").select("*").order("cree_le", { ascending: false }).limit(8),
    sb.from("courriels_sortants").select("id, destinataire, sujet, statut, cree_le").order("cree_le", { ascending: false }).limit(5),
  ]);
  const encaisse = (paiementsMois.data ?? []).reduce((s, p) => s + p.montant_cents - p.rembourse_cents, 0);
  const NOMS = { salle: "Salle", kiosque: "Kiosque", danse: "Danse", remisage: "Remisage" } as Record<string, string>;

  // ---- À faire maintenant : les demandes à approuver d'abord, puis les paiements qui traînent
  const SEUIL_RELANCE = 7;
  const taches: Tache[] = [];
  const relances: Tache[] = [];
  for (const k of kiosques.data ?? []) {
    const code = (k.emplacements_kiosque as unknown as { code: string } | null)?.code;
    const quoi = k.type === "interieur" ? `Kiosque intérieur ${code ?? ""}` : "Kiosque extérieur";
    if (k.statut === "en_attente") {
      const a = age(k.cree_le);
      taches.push({ cle: k.id, quoi, qui: k.entreprise || k.nom, depuis: a.texte, href: "/admin/kiosques", action: k.type === "interieur" ? "Approuver" : "Noter l'entente", urgent: a.jours >= 3 });
    } else if (k.statut === "entente") {
      taches.push({ cle: k.id, quoi, qui: k.entreprise || k.nom, depuis: age(k.maj_le ?? k.cree_le).texte, href: "/admin/kiosques", action: "Envoyer la facture" });
    } else {
      const a = age(k.maj_le ?? k.cree_le);
      if (a.jours >= SEUIL_RELANCE) relances.push({ cle: k.id, quoi, qui: k.entreprise || k.nom, depuis: a.texte, href: "/admin/kiosques", action: "Relancer" });
    }
  }
  for (const r of remisages.data ?? []) {
    if (r.statut === "en_attente") {
      const a = age(r.cree_le);
      taches.push({ cle: r.id, quoi: `Remisage · ${r.type_vehicule}`, qui: r.nom, depuis: a.texte, href: "/admin/remisage", action: "Approuver", urgent: a.jours >= 3 });
    } else {
      const a = age(r.maj_le ?? r.cree_le);
      if (a.jours >= SEUIL_RELANCE) relances.push({ cle: r.id, quoi: `Remisage · ${r.type_vehicule}`, qui: r.nom, depuis: a.texte, href: "/admin/remisage", action: "Relancer" });
    }
  }
  for (const m of messages.data ?? []) {
    const a = age(m.cree_le);
    taches.push({ cle: m.id, quoi: `Message · ${m.sujet || (m.formulaire === "contact" ? "Contact" : "Exposants")}`, qui: m.nom, depuis: a.texte, href: "/admin/messages", action: "Répondre", urgent: a.jours >= 3 });
  }
  const nbKiosques = (kiosques.data ?? []).filter((k) => ["en_attente", "entente"].includes(k.statut)).length;
  const nbRemisages = (remisages.data ?? []).filter((r) => r.statut === "en_attente").length;
  const nbMessages = messages.data?.length ?? 0;

  type C = { debut: string; fin: string; salles: { nom: string } };
  const salles = (prochaines.data ?? [])
    .map((r) => ({ ...r, c: r.creneaux_salle as unknown as C }))
    .sort((a, b) => a.c.debut.localeCompare(b.c.debut))
    .slice(0, 4);

  // Nom du client pour les derniers paiements (la table des paiements ne garde que le courriel)
  const noms = new Map<string, string>();
  await Promise.all(
    ([["salle", "reservations_salle"], ["kiosque", "demandes_kiosque"], ["danse", "inscriptions_danse"], ["remisage", "demandes_remisage"]] as const).map(async ([type, table]) => {
      const ids = (recents.data ?? []).filter((p) => p.objet_type === type).map((p) => p.objet_id);
      if (!ids.length) return;
      const { data } = await sb.from(table).select("id, nom").in("id", ids);
      (data ?? []).forEach((x) => noms.set(x.id, x.nom));
    }),
  );

  const ligne = (t: Tache) => (
    <li key={t.cle} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-encre/15 py-2.5 last:border-0">
      <p className="min-w-0">
        <strong className="text-[16px]">{t.qui}</strong>
        <span className="block text-[14px] text-gris-brun">{t.quoi} · <span className={t.urgent ? "font-semibold text-rouge" : ""}>{t.depuis}</span></span>
      </p>
      <Link href={t.href} className="min-h-[40px] inline-flex items-center px-3 border-2 border-encre bg-moutarde text-encre no-underline font-etiquette font-bold uppercase tracking-wide text-[14px] hover:bg-kraft">
        {t.action} <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </li>
  );

  return (
    <>
      <Titre sous={`Bonjour ${profil.nom || profil.courriel}. ${taches.length ? "Voici ce qui demande votre attention." : "Rien n'attend votre attention pour l'instant."}`}>Tableau de bord</Titre>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-5 mb-8">
        <Chiffre valeur={nbKiosques} libelle="Kiosques à traiter" href="/admin/kiosques" ton={nbKiosques ? "moutarde" : "creme"} />
        <Chiffre valeur={nbRemisages} libelle="Remisages à approuver" href="/admin/remisage" ton={nbRemisages ? "moutarde" : "creme"} />
        <Chiffre valeur={nbMessages} libelle="Messages non traités" href="/admin/messages" ton={nbMessages ? "jean" : "creme"} />
        <Chiffre valeur={aVenir} libelle="Salles réservées" href="/admin/reservations" ton="olive" />
        <Chiffre valeur={argent(encaisse)} libelle="Encaissé ce mois (net)" ton="rouge" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] mb-6">
        <Carte titre={`À faire maintenant${taches.length ? ` (${taches.length})` : ""}`}>
          {taches.length ? (
            <ul>{taches.slice(0, 12).map(ligne)}</ul>
          ) : (
            <p className="text-gris-brun">Tout est à jour : aucune demande ni aucun message en attente.</p>
          )}
          {taches.length > 12 && <p className="mt-2 text-[14px] text-gris-brun">Et {taches.length - 12} de plus dans les sections du menu.</p>}
        </Carte>
        <div className="grid gap-6 content-start">
          <Carte titre="Prochaines locations de salle" action={<Link href="/admin/reservations" className="text-[14px] underline">Toutes</Link>}>
            {salles.length ? (
              <ul>
                {salles.map((r) => (
                  <li key={r.id} className="border-b border-encre/15 py-2 last:border-0">
                    <strong className="block text-[16px] first-letter:uppercase">{dateLongue(r.c.debut)}</strong>
                    <span className="text-[14px] text-gris-brun">{r.c.salles.nom} · {r.nom} · {r.type_evenement}{r.personnes ? ` · ${r.personnes} pers.` : ""}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gris-brun">Aucune location à venir.</p>
            )}
          </Carte>
          {relances.length > 0 && (
            <Carte titre={`Paiements qui tardent (${relances.length})`}>
              <p className="text-[14px] text-gris-brun mb-1">Lien ou facture envoyé il y a {SEUIL_RELANCE} jours ou plus, toujours impayé.</p>
              <ul>{relances.slice(0, 6).map(ligne)}</ul>
            </Carte>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Carte titre="Derniers paiements">
          <Tableau entetes={["Quand", "Client", "Pour", "Montant", "Statut"]} vide={!recents.data?.length}>
            {(recents.data ?? []).map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap">{dateHeure(p.cree_le)}</td>
                <td><strong>{noms.get(p.objet_id) ?? "—"}</strong><br /><span className="text-gris-brun text-[13px]">{p.courriel}</span></td>
                <td>{NOMS[p.objet_type]}</td>
                <td className="whitespace-nowrap font-semibold">{argent(p.montant_cents)}{p.rembourse_cents ? <><br /><span className="text-[13px] text-rouge">−{argent(p.rembourse_cents)}</span></> : null}</td>
                <td><Statut s={p.statut} /></td>
              </tr>
            ))}
          </Tableau>
        </Carte>
        <Carte titre="Courriels récents" action={<Link href="/admin/boite-envoi" className="text-[14px] underline">Toute la boîte d&apos;envoi</Link>}>
          <ul className="grid gap-2">
            {(courriels.data ?? []).map((c) => (
              <li key={c.id} className="border-b border-encre/15 pb-2">
                <p className="font-semibold text-[15px]">{c.sujet}</p>
                <p className="text-[13px] text-gris-brun">{c.destinataire} · {dateHeure(c.cree_le)} · <Statut s={c.statut} /></p>
              </li>
            ))}
            {!courriels.data?.length && <li className="text-gris-brun">Aucun courriel pour l&apos;instant.</li>}
          </ul>
        </Carte>
      </div>
    </>
  );
}
