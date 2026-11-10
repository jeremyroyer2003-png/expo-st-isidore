"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Client du navigateur (connexion admin, téléversement de médias). */
export function supabaseNavigateur() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
