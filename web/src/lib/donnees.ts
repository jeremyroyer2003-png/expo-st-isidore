// Lecture des données publiques. Si Supabase n'est pas encore branché (.env.local vide),
// les pages publiques s'affichent quand même avec les données de départ en JSON.
import { env, supabaseConfigure } from "@/lib/env";
import { supabasePublic, supabaseService } from "@/lib/supabase/serveur";
import programmationDepart from "@/donnees/programmation-2026.json";
import galerieDepart from "@/donnees/galerie.json";

export type Evenement = {
  id: string; annee: number; jour: string; heure: string; titre: string; lieu: string;
  prix: string; description: string; categories: string[]; photo: string; ordre: number;
};
export type Media = {
  id: string; type: "photo" | "video"; url: string; vignette: string; alt: string;
  credit: string; categorie: string; ordre: number;
};
export type Prix = {
  cle: string; categorie: string; libelle: string; description: string;
  montant_cents: number; unite: string; a_confirmer: boolean; ordre: number;
};

export async function evenements(): Promise<{ annee: number; liste: Evenement[] }> {
  if (supabaseConfigure()) {
    const sb = supabasePublic();
    const { data: derniere } = await sb.from("evenements").select("annee").order("annee", { ascending: false }).limit(1);
    const annee = derniere?.[0]?.annee;
    if (annee) {
      const { data } = await sb.from("evenements").select("*").eq("annee", annee).order("jour").order("ordre");
      if (data?.length) return { annee, liste: data as Evenement[] };
    }
  }
  return { annee: 2026, liste: programmationDepart as Evenement[] };
}

export async function galerie(): Promise<Media[]> {
  if (supabaseConfigure()) {
    const { data } = await supabasePublic().from("medias").select("*").neq("categorie", "comites").order("ordre");
    if (data?.length) return data.map((m) => ({ ...m, vignette: m.vignette || m.url })) as Media[];
  }
  return galerieDepart as Media[];
}

/** Photos des comités (album « comites » de la médiathèque), de la plus récente à la plus ancienne. « ordre » = année. */
export async function photosComites(): Promise<Media[]> {
  if (!supabaseConfigure()) return [];
  const { data } = await supabasePublic().from("medias").select("*").eq("categorie", "comites").eq("type", "photo").order("ordre", { ascending: false });
  return (data ?? []).map((m) => ({ ...m, vignette: m.vignette || m.url })) as Media[];
}

/**
 * Prix d'une catégorie, tels que le public a le droit de les voir.
 * Un prix « à confirmer » (valeur fictive de départ) est caché : null = « Prix sur demande »,
 * sauf en développement avec AFFICHER_PRIX_FICTIFS=true (pour tester le paiement).
 */
export async function prixPublics(categorie: string): Promise<(Prix & { visible: boolean })[]> {
  if (!supabaseConfigure()) return [];
  // Le service lit aussi les prix fictifs; on filtre ici selon la règle d'affichage
  const { data } = await supabaseService().from("prix").select("*").eq("categorie", categorie).eq("actif", true).order("ordre");
  return ((data ?? []) as Prix[]).map((p) => ({ ...p, visible: !p.a_confirmer || env.afficherPrixFictifs }));
}

export async function contenu(cle: string, defaut = ""): Promise<string> {
  if (!supabaseConfigure()) return defaut;
  const { data } = await supabasePublic().from("contenus").select("valeur").eq("cle", cle).maybeSingle();
  return data?.valeur ?? defaut;
}
