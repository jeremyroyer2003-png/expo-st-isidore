"use server";

import { redirect } from "next/navigation";
import { annuler, DELAI_ANNULATION_HEURES, fraisAnnulation } from "@/lib/annulation";
import { supabaseConfigure } from "@/lib/env";
import { dateLongue, heure, plage } from "@/lib/format";
import { lireJeton } from "@/lib/jeton";
import { supabaseService } from "@/lib/supabase/serveur";
import { ErreurSaisie } from "@/lib/validation";

export type InfoAnnulation =
  | { etat: "invalide" }
  | { etat: "deja-annulee" | "trop-tard" | "annulable"; nom: string; salle: string; date: string; heures: string; paye: number; frais: number; rembourse: number; limite: string };

/** Ce que le client voit derrière le lien « Annuler ma réservation » de son courriel. */
export async function trouverAnnulation(jeton: string): Promise<InfoAnnulation> {
  const id = supabaseConfigure() ? lireJeton("annuler-salle", jeton) : null;
  if (!id) return { etat: "invalide" };
  const sb = supabaseService();
  const { data: r } = await sb.from("reservations_salle").select("*, creneaux_salle(debut, fin, salles(nom))").eq("id", id).maybeSingle();
  if (!r || !["confirmee", "annulee"].includes(r.statut)) return { etat: "invalide" };
  const c = r.creneaux_salle as { debut: string; fin: string; salles: { nom: string } };
  const { data: paiements } = await sb.from("paiements").select("montant_cents, rembourse_cents, statut").eq("objet_type", "salle").eq("objet_id", id).in("statut", ["paye", "rembourse_partiel", "rembourse"]);
  const paye = (paiements ?? []).reduce((t, p) => t + p.montant_cents, 0);
  const deja = (paiements ?? []).reduce((t, p) => t + p.rembourse_cents, 0);
  const frais = Math.min(await fraisAnnulation(sb, "salle"), paye - deja);
  const limite = new Date(new Date(c.debut).getTime() - DELAI_ANNULATION_HEURES * 3600_000);
  const etat = r.statut === "annulee" ? "deja-annulee" : Date.now() > limite.getTime() ? "trop-tard" : "annulable";
  return {
    etat, nom: r.nom, salle: c.salles.nom, date: dateLongue(c.debut), heures: plage(c.debut, c.fin),
    paye, frais: etat === "deja-annulee" ? 0 : frais, rembourse: etat === "deja-annulee" ? deja : paye - deja - frais,
    limite: `${dateLongue(limite)}, ${heure(limite)}`,
  };
}

/** Bouton « Oui, annuler ma réservation » : le client annule lui-même, les frais d'annulation sont retenus. */
export async function annulerParClient(fd: FormData) {
  const jeton = String(fd.get("jeton") ?? "");
  const lien = `/annuler/${encodeURIComponent(jeton)}`;
  const info = await trouverAnnulation(jeton);
  if (info.etat !== "annulable" || fd.get("confirme") !== "oui") redirect(lien);
  const id = lireJeton("annuler-salle", jeton)!;
  try {
    await annuler(supabaseService(), { type: "salle", objetId: id, parQui: "client", fraisCents: info.frais, aviser: true, aviserAdmin: true });
  } catch (e) {
    if (!(e instanceof ErreurSaisie)) console.error("[annulation client]", e);
    redirect(`${lien}?erreur=1`);
  }
  redirect(`${lien}?fait=1`);
}
