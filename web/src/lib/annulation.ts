// Annulation et remboursement : un seul code pour l'admin (Annuler et rembourser) et pour le client
// (lien « Annuler ma réservation » du courriel de confirmation de salle).
// Qui annule décide des frais : le client paie les frais d'annulation, l'Expo n'en retient aucun.
import type { SupabaseClient } from "@supabase/supabase-js";
import { verifierEcriture } from "@/lib/admin";
import { envoyerCourriel } from "@/lib/courriel";
import * as G from "@/lib/courriel/gabarits";
import { env } from "@/lib/env";
import { argent, dateLongue, plage } from "@/lib/format";
import { signerJeton } from "@/lib/jeton";
import { rembourser } from "@/lib/stripe-admin";
import { ErreurSaisie } from "@/lib/validation";

export type TypeObjet = "salle" | "kiosque" | "remisage" | "danse";
export type ParQui = "client" | "expo";
export const TABLES: Record<TypeObjet, string> = { salle: "reservations_salle", kiosque: "demandes_kiosque", remisage: "demandes_remisage", danse: "inscriptions_danse" };

/** Le client peut annuler sa salle en ligne jusqu'à ce délai avant l'événement (à confirmer par le comité). */
export const DELAI_ANNULATION_HEURES = 48;

/** Lien du courriel de confirmation de salle. */
export const lienAnnulationSalle = (reservationId: string) => `${env.urlSite}/annuler/${signerJeton("annuler-salle", reservationId)}`;

/** Frais d'annulation actuels pour un type (0 si le prix est désactivé). */
export async function fraisAnnulation(sb: SupabaseClient, type: TypeObjet): Promise<number> {
  if (type === "danse") return 0;
  const { data } = await sb.from("prix").select("montant_cents, actif").eq("cle", `frais_annulation_${type}`).maybeSingle();
  return data?.actif ? data.montant_cents : 0;
}

/**
 * Annule, rembourse (moins les frais si c'est le client), libère la date et avise le client.
 * sb : client de session de l'admin (la RLS vérifie ses droits) ou client service après vérification du lien signé.
 */
export async function annuler(sb: SupabaseClient, o: { type: TypeObjet; objetId: string; parQui: ParQui; fraisCents: number; aviser: boolean; aviserAdmin?: boolean }) {
  const frais = o.parQui === "expo" ? 0 : Math.max(0, o.fraisCents);
  const { data: objet } = await sb.from(TABLES[o.type]).select("*").eq("id", o.objetId).single();
  if (!objet) throw new ErreurSaisie("Élément introuvable.");
  if (objet.statut === "annulee") throw new ErreurSaisie("Déjà annulé.");

  // Le paiement (s'il y en a un) est remboursé en premier : si Stripe refuse, rien n'est changé
  const { data: paiements } = await sb.from("paiements").select("*").eq("objet_type", o.type).eq("objet_id", o.objetId).in("statut", ["paye", "rembourse_partiel"]);
  let paye = 0, retenu = 0, rembourse = 0;
  for (const p of paiements ?? []) {
    const r = await rembourser(p, frais - retenu);
    paye += p.montant_cents;
    retenu += r.frais;
    rembourse += r.rembourse;
    verifierEcriture(await sb.from("paiements").update({
      statut: r.frais > 0 ? "rembourse_partiel" : "rembourse",
      frais_annulation_cents: p.frais_annulation_cents + r.frais,
      rembourse_cents: p.rembourse_cents + r.rembourse,
    }).eq("id", p.id).select("id"));
  }

  verifierEcriture(await sb.from(TABLES[o.type]).update({ statut: "annulee" }).eq("id", o.objetId).select("id"));
  let quoi = "";
  if (o.type === "salle") {
    // La date redevient réservable
    await sb.from("creneaux_salle").update({ statut: "ouvert", retenu_jusqua: null }).eq("id", objet.creneau_id);
    const { data: c } = await sb.from("creneaux_salle").select("debut, fin, salles(nom)").eq("id", objet.creneau_id).single();
    quoi = `${(c?.salles as unknown as { nom: string })?.nom ?? "salle"}, ${c ? `${dateLongue(c.debut)}, ${plage(c.debut, c.fin)}` : ""}`;
  } else if (o.type === "kiosque") quoi = "votre kiosque";
  else if (o.type === "remisage") quoi = "votre place de remisage";
  else quoi = "votre inscription à la danse";

  if (o.aviser) await envoyerCourriel({ a: objet.courriel, ...G.annulation({ nom: objet.nom, quoi, paye, frais: retenu, rembourse, parQui: o.parQui }) });
  if (o.aviserAdmin) {
    await envoyerCourriel({ a: env.courrielAdmin, ...G.annulationAdmin([
      ["Annulé par", o.parQui === "client" ? "Le client, en ligne" : "L'Expo"], ["Réservation", quoi], ["Client", objet.nom],
      ["Courriel", objet.courriel], ["Téléphone", objet.telephone], ["Payé", argent(paye)], ["Frais retenus", argent(retenu)], ["Remboursé", argent(rembourse)],
    ]) });
  }
  return { paye, retenu, rembourse, quoi };
}
