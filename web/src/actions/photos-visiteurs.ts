"use server";

// Photos envoyées par les visiteurs (page Photos, « Vous avez pris des photos ? »).
// En deux temps, pour ne pas faire passer les photos par le serveur (limite de taille des fonctions) :
// 1. preparerEnvoiPhotos : vérifie le formulaire et donne une adresse de téléversement signée par photo;
// 2. le navigateur envoie chaque photo directement au stockage Supabase (dossier visiteurs/<lot>/);
// 3. confirmerEnvoiPhotos : vérifie que les photos sont arrivées, les ajoute à la médiathèque NON publiées
//    (album « Photos des visiteurs ») et prévient le comité. Rien n'est public avant qu'un éditeur le décide.

import { revalidatePath } from "next/cache";
import { envoyerCourriel } from "@/lib/courriel";
import { accuseMessage, messageRecu } from "@/lib/courriel/gabarits";
import { env, supabaseConfigure } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/serveur";
import { consentement, courriel, ErreurSaisie, estRobot, texte, traiter, type Resultat } from "@/lib/validation";

const MAX_PHOTOS = 10;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

type Preparation = Resultat & { lot?: string; televersements?: { chemin: string; url: string }[] };

function verifierFormulaire(fd: FormData) {
  const nom = texte(fd, "nom", { requis: true, max: 120 });
  const c = courriel(fd);
  const message = texte(fd, "message", { max: 1000 });
  if (fd.get("autorisation") !== "oui") throw new ErreurSaisie("Cochez la case qui autorise l'Expo à publier vos photos.");
  consentement(fd);
  return { nom, c, message };
}

export async function preparerEnvoiPhotos(fd: FormData): Promise<Preparation> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true, lot: "", televersements: [] };
    verifierFormulaire(fd);
    const types = fd.getAll("types").map(String);
    if (!types.length) throw new ErreurSaisie("Choisissez au moins une photo.");
    if (types.length > MAX_PHOTOS) throw new ErreurSaisie(`${MAX_PHOTOS} photos au plus par envoi. Faites un deuxième envoi pour les autres.`);
    if (types.some((t) => !TYPES[t])) throw new ErreurSaisie("Format accepté : JPEG, PNG ou WebP (les photos d'un cellulaire conviennent).");
    if (!supabaseConfigure()) throw new Error("Supabase n'est pas configuré (.env.local)");

    const lot = crypto.randomUUID();
    const sb = supabaseService();
    const televersements = await Promise.all(types.map(async (t, i) => {
      const chemin = `visiteurs/${lot}/${i + 1}.${TYPES[t]}`;
      const { data, error } = await sb.storage.from("medias").createSignedUploadUrl(chemin);
      if (error || !data) throw new Error(error?.message ?? "adresse de téléversement");
      return { chemin, url: data.signedUrl };
    }));
    return { ok: true, lot, televersements };
  }) as Promise<Preparation>;
}

export async function confirmerEnvoiPhotos(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const { nom, c, message } = verifierFormulaire(fd);
    const lot = texte(fd, "lot", { requis: true, max: 40 });
    if (!UUID.test(lot)) throw new ErreurSaisie("Envoi invalide. Recommencez.");
    const sb = supabaseService();

    // Seules les photos réellement arrivées dans le dossier du lot sont ajoutées
    const { data: fichiers, error } = await sb.storage.from("medias").list(`visiteurs/${lot}`, { limit: MAX_PHOTOS + 1 });
    if (error) throw error;
    const recus = (fichiers ?? []).filter((f) => /^\d+\.(jpg|png|webp)$/.test(f.name)).slice(0, MAX_PHOTOS);
    if (!recus.length) throw new ErreurSaisie("Aucune photo n'est arrivée. Vérifiez votre connexion et réessayez.");

    const lignes = recus.map((f) => {
      const chemin = `visiteurs/${lot}/${f.name}`;
      const url = sb.storage.from("medias").getPublicUrl(chemin).data.publicUrl;
      return {
        chemin, type: "photo", url, vignette: url, categorie: "visiteurs", publie: false, ordre: 999,
        alt: `Photo envoyée par ${nom} : à décrire avant de publier`, credit: nom,
      };
    });
    const r = await sb.from("medias").insert(lignes).select("id");
    if (r.error) throw r.error;
    // Trace de l'envoi et de l'autorisation (Loi 25) : dans les messages de l'admin
    await sb.from("messages").insert({
      formulaire: "photos", nom, courriel: c, sujet: `${recus.length} photo${recus.length > 1 ? "s" : ""} envoyée${recus.length > 1 ? "s" : ""}`,
      message, donnees: { lot, photos: recus.length, autorisation_publication: true, credit: nom },
    });

    await Promise.all([
      envoyerCourriel({
        a: env.courrielAdmin,
        ...messageRecu("Photos de visiteurs", [
          ["Nom (crédit)", nom], ["Courriel", c], ["Photos", String(recus.length)], ["Message", message || "—"],
          ["À faire", "Médiathèque, album « Photos des visiteurs » : décrire chaque photo, vérifier qu'aucun enfant n'est reconnaissable, puis publier dans le bon album."],
        ]),
      }),
      envoyerCourriel({ a: c, ...accuseMessage(nom) }),
    ]);
    revalidatePath("/admin/medias");
    return { ok: true };
  });
}
