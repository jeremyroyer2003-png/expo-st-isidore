"use server";

import { redirect } from "next/navigation";
import { supabaseConfigure } from "@/lib/env";
import { creerSessionPaiement } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase/serveur";
import { completerEmplacement, completerEmplacements } from "@/lib/kiosques";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type APayer =
  | { type: "kiosque"; id: string; nom: string; courriel: string; libelle: string; description: string; montant: number }
  | { type: "remisage"; id: string; nom: string; courriel: string; libelle: string; description: string; montant: number };

/** Retrouve ce qui reste à payer derrière un lien (jeton secret envoyé par courriel). Null = rien à payer. */
export async function trouverAPayer(jeton: string): Promise<APayer | null> {
  if (!supabaseConfigure() || !UUID.test(jeton)) return null;
  const sb = supabaseService();
  const { data: k } = await sb.from("demandes_kiosque").select("*, emplacements_kiosque(code)").eq("jeton_paiement", jeton).maybeSingle();
  if (k) {
    if (k.type !== "interieur" || k.statut !== "approuvee" || !k.montant_cents) return null;
    const { codes, nbEmplacements } = await completerEmplacement(sb, k);
    return { type: "kiosque", id: k.id, nom: k.nom, courriel: k.courriel, libelle: `${nbEmplacements > 1 ? "Kiosques" : "Kiosque"} ${codes}, palais des commerces · Expo ${k.annee}`, description: k.entreprise, montant: k.montant_cents };
  }
  const { data: r } = await sb.from("demandes_remisage").select("*").eq("jeton_paiement", jeton).maybeSingle();
  if (r) {
    if (r.statut !== "approuvee" || !r.depot_cents) return null;
    return { type: "remisage", id: r.id, nom: r.nom, courriel: r.courriel, libelle: `Dépôt de remisage d'hiver ${r.saison}`, description: `${r.type_vehicule}${r.marque_modele ? ` · ${r.marque_modele}` : ""}, ${r.longueur_pi} pi`, montant: r.depot_cents };
  }
  return null;
}

/** Bouton « Payer » de la page /payer/[jeton] : crée une session Stripe neuve et y envoie le client. */
export async function payerParJeton(fd: FormData) {
  const jeton = String(fd.get("jeton") ?? "");
  const a = await trouverAPayer(jeton);
  if (!a) redirect(`/payer/${encodeURIComponent(jeton)}`);
  const url = await creerSessionPaiement({
    type: a.type, objetId: a.id, libelle: a.libelle, description: a.description,
    montantCents: a.montant, courriel: a.courriel, retourAnnulation: `/payer/${jeton}`, expireMinutes: 60,
  });
  redirect(url);
}
