// Garde des pages et actions admin. La vraie barrière reste la RLS de Postgres :
// toutes les écritures admin passent par le client de session (supabaseSession), jamais par la clé service,
// sauf ce que la RLS ne peut pas faire (création de comptes, boîte d'envoi), et seulement après vérification du rôle.
import { redirect } from "next/navigation";
import { supabaseConfigure } from "@/lib/env";
import { supabaseSession } from "@/lib/supabase/serveur";
import { ErreurSaisie } from "@/lib/validation";

export type Role = "super_admin" | "editeur" | "lecteur";
export type Profil = { id: string; courriel: string; nom: string; role: Role };

export const NOMS_ROLES: Record<Role, string> = { super_admin: "Super-admin", editeur: "Éditeur", lecteur: "Lecteur" };

/** Pour les pages : renvoie le profil ou redirige vers la connexion. */
export async function exigerAdmin(): Promise<{ sb: Awaited<ReturnType<typeof supabaseSession>>; profil: Profil }> {
  if (!supabaseConfigure()) redirect("/admin/connexion?erreur=config");
  const sb = await supabaseSession();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) redirect("/admin/connexion");
  const { data: profil } = await sb.from("profils").select("id, courriel, nom, role").eq("id", u.user.id).maybeSingle();
  if (!profil) redirect("/admin/connexion?erreur=acces");
  return { sb, profil: profil as Profil };
}

/** Pour les actions : vérifie le rôle (éditeur ou plus, ou super-admin) avant toute écriture. */
export async function exigerRole(min: "editeur" | "super_admin") {
  const sb = await supabaseSession();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) throw new ErreurSaisie("Votre session a expiré. Reconnectez-vous.");
  const { data: role } = await sb.rpc("role_admin");
  const ok = min === "super_admin" ? role === "super_admin" : role === "editeur" || role === "super_admin";
  if (!ok) throw new ErreurSaisie("Votre rôle ne permet pas cette action (lecture seule).");
  return { sb, userId: u.user.id, role: role as Role };
}

export const peutEditer = (p: Profil) => p.role === "editeur" || p.role === "super_admin";

/** Vérifie qu'une écriture a bien touché une ligne (sinon la RLS l'a refusée). */
export function verifierEcriture(r: { error: { message: string } | null; data?: unknown[] | null }) {
  if (r.error) throw new Error(r.error.message);
  if (Array.isArray(r.data) && r.data.length === 0) throw new ErreurSaisie("Rien n'a été modifié (accès refusé ou élément introuvable).");
}
