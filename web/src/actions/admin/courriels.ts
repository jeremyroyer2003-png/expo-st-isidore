"use server";

import { supabaseSession } from "@/lib/supabase/serveur";

/** HTML d'un courriel de la boîte d'envoi, chargé seulement quand l'admin ouvre l'aperçu. La RLS vérifie l'accès. */
export async function apercuCourriel(id: string): Promise<{ html: string; erreur: string | null } | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const sb = await supabaseSession();
  const { data } = await sb.from("courriels_sortants").select("html, erreur").eq("id", id).maybeSingle();
  return data ?? null;
}
