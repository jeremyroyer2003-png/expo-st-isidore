// Kiosques intérieurs : une demande peut tenir plusieurs emplacements (souvent deux voisins).
// emplacement_id = l'emplacement principal; emplacements_lies = les autres (migration 0005).
import type { SupabaseClient } from "@supabase/supabase-js";

type AvecEmplacements = {
  emplacements_kiosque?: { code: string; prix_cents?: number | null } | null;
  emplacements_lies?: string[] | null;
};

/** Ajoute à chaque demande `codes` (« 21 + 22 ») et `prixEmplacements` (somme des prix propres aux emplacements, ou null). */
export async function completerEmplacements<T extends AvecEmplacements>(
  sb: SupabaseClient,
  demandes: T[],
): Promise<(T & { codes: string; prixEmplacements: number | null; nbEmplacements: number })[]> {
  const ids = [...new Set(demandes.flatMap((d) => d.emplacements_lies ?? []))];
  const parId = new Map<string, { code: string; prix_cents: number | null }>();
  if (ids.length) {
    const { data } = await sb.from("emplacements_kiosque").select("id, code, prix_cents").in("id", ids);
    for (const e of data ?? []) parId.set(e.id, { code: e.code, prix_cents: e.prix_cents });
  }
  return demandes.map((d) => {
    const principal = d.emplacements_kiosque;
    const lies = (d.emplacements_lies ?? []).map((id) => parId.get(id)).filter((e): e is { code: string; prix_cents: number | null } => !!e);
    const tous = [...(principal ? [{ code: principal.code, prix_cents: principal.prix_cents ?? null }] : []), ...lies];
    const codes = tous.map((e) => e.code).sort((a, b) => a.localeCompare(b, "fr", { numeric: true })).join(" + ");
    const prixEmplacements = tous.length && tous.every((e) => e.prix_cents != null) ? tous.reduce((s, e) => s + e.prix_cents!, 0) : null;
    return { ...d, codes, prixEmplacements, nbEmplacements: tous.length };
  });
}

/** Une seule demande. */
export async function completerEmplacement<T extends AvecEmplacements>(sb: SupabaseClient, d: T) {
  return (await completerEmplacements(sb, [d]))[0];
}
