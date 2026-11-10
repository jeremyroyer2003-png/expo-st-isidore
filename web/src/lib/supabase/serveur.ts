import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/** Client lié à la session de l'admin connecté : toutes ses requêtes passent par la RLS. */
export async function supabaseSession() {
  const jar = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnon, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (aPoser) => {
        try {
          aPoser.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Appelé depuis un composant serveur : le proxy rafraîchit déjà la session.
        }
      },
    },
  });
}

/** Client public (anon) sans cookies : lit seulement ce que la RLS permet au public. */
export function supabasePublic() {
  return createClient(env.supabaseUrl, env.supabaseAnon, { auth: { persistSession: false } });
}

/**
 * Client « service » : contourne la RLS. Réservé au serveur pour les flux publics
 * (une demande validée par une action serveur), les webhooks Stripe et la boîte d'envoi.
 * Ne jamais l'utiliser pour une action d'admin : celles-ci passent par supabaseSession().
 */
export function supabaseService() {
  return createClient(env.supabaseUrl, env.supabaseService, { auth: { persistSession: false } });
}
