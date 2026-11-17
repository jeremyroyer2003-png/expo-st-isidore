// Historique des réservations et demandes (table « journal », migration 0002).
// L'historique ne doit jamais bloquer une action : une erreur d'écriture est notée dans la console et c'est tout
// (par exemple si la migration 0002 n'est pas encore exécutée).
import type { SupabaseClient } from "@supabase/supabase-js";

export type TypeJournal = "salle" | "kiosque" | "danse" | "remisage";
export type EntreeJournal = { objet_id: string; action: string; details: string; par_nom: string; cree_le: string };
/** Qui fait l'action : un admin (id de son profil), ou le client, Stripe… (nom seulement). */
export type Auteur = { id?: string; nom: string };

/** Nom affiché d'un admin (son nom, sinon son courriel). */
export async function auteurAdmin(sb: SupabaseClient, userId: string): Promise<Auteur> {
  const { data } = await sb.from("profils").select("nom, courriel").eq("id", userId).maybeSingle();
  return { id: userId, nom: data?.nom || data?.courriel || "Admin" };
}

export async function journaliser(sb: SupabaseClient, type: TypeJournal, objetId: string, action: string, par: Auteur, details = "") {
  try {
    const { error } = await sb.from("journal").insert({ objet_type: type, objet_id: objetId, action, details, par_id: par.id ?? null, par_nom: par.nom });
    if (error) console.warn("[journal] non enregistré :", error.message);
  } catch (e) {
    console.warn("[journal] non enregistré :", e);
  }
}

/** Historique de plusieurs objets d'un coup, du plus ancien au plus récent. Vide si la table n'existe pas. */
export async function lireJournal(sb: SupabaseClient, ids: string[]): Promise<Map<string, EntreeJournal[]>> {
  const parObjet = new Map<string, EntreeJournal[]>();
  if (!ids.length) return parObjet;
  // Par paquets : une adresse trop longue serait refusée
  for (let i = 0; i < ids.length; i += 150) {
    const { data, error } = await sb.from("journal").select("objet_id, action, details, par_nom, cree_le").in("objet_id", ids.slice(i, i + 150)).order("cree_le");
    if (error) return parObjet;
    for (const e of data ?? []) parObjet.set(e.objet_id, [...(parObjet.get(e.objet_id) ?? []), e]);
  }
  return parObjet;
}
