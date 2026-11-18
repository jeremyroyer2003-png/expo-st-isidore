"use server";

import { ALBUMS } from "@/lib/albums";
import { revalidatePath } from "next/cache";
import { exigerRole, verifierEcriture } from "@/lib/admin";
import { ErreurSaisie, nombre, texte, traiter, type Resultat } from "@/lib/validation";

const CATEGORIES = Object.keys(ALBUMS);
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_OCTETS = 8 * 1024 * 1024;

/** Téléverse une photo dans le stockage Supabase (bucket « medias ») et l'ajoute à la galerie. */
export async function televerserPhoto(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const fichier = fd.get("fichier");
    if (!(fichier instanceof File) || !fichier.size) throw new ErreurSaisie("Choisissez une photo.");
    if (!TYPES.includes(fichier.type)) throw new ErreurSaisie("Format accepté : JPEG, PNG ou WebP.");
    if (fichier.size > MAX_OCTETS) throw new ErreurSaisie("La photo dépasse 8 Mo. Réduisez-la avant de la téléverser.");
    const alt = texte(fd, "alt", { requis: true, max: 600 });
    const categorie = texte(fd, "categorie", { requis: true, max: 20 });
    if (!CATEGORIES.includes(categorie)) throw new ErreurSaisie("Album inconnu.");

    const ext = fichier.type === "image/png" ? "png" : fichier.type === "image/webp" ? "webp" : "jpg";
    const chemin = `${categorie}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    // Téléversement avec la session : la politique de stockage n'accepte que les éditeurs
    const { error } = await sb.storage.from("medias").upload(chemin, fichier, { contentType: fichier.type, upsert: false });
    if (error) throw new Error(error.message);
    const url = sb.storage.from("medias").getPublicUrl(chemin).data.publicUrl;
    const r = await sb.from("medias").insert({
      chemin, type: "photo", url, vignette: url, alt, categorie,
      credit: texte(fd, "credit", { max: 200 }), publie: fd.get("publie") === "oui",
      ordre: nombre(fd, "ordre", { min: 0, max: 9999 }) ?? 999,
    }).select("id");
    if (r.error) await sb.storage.from("medias").remove([chemin]);
    verifierEcriture(r);
    revalidatePath("/admin/medias");
    revalidatePath("/photos");
    revalidatePath("/histoire");
    return { ok: true, message: "Photo ajoutée." };
  });
}

/** Ajoute une vidéo (lien YouTube ou Facebook). */
export async function ajouterVideo(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const url = texte(fd, "url", { requis: true, max: 500 });
    if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be|facebook\.com|fb\.watch|vimeo\.com)\//.test(url)) {
      throw new ErreurSaisie("Collez un lien YouTube, Facebook ou Vimeo (https://…).");
    }
    verifierEcriture(await sb.from("medias").insert({
      chemin: `video/${Date.now()}`, type: "video", url, vignette: texte(fd, "vignette", { max: 500 }),
      alt: texte(fd, "alt", { requis: true, max: 600 }), credit: texte(fd, "credit", { max: 200 }),
      categorie: "galerie", publie: fd.get("publie") === "oui", ordre: 999,
    }).select("id"));
    revalidatePath("/admin/medias");
    revalidatePath("/photos");
    revalidatePath("/histoire");
    return { ok: true, message: "Vidéo ajoutée." };
  });
}

export async function majMedia(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const categorie = texte(fd, "categorie", { requis: true, max: 20 });
    if (!CATEGORIES.includes(categorie)) throw new ErreurSaisie("Album inconnu.");
    verifierEcriture(await sb.from("medias").update({
      alt: texte(fd, "alt", { requis: true, max: 600 }), credit: texte(fd, "credit", { max: 200 }), categorie,
      publie: fd.get("publie") === "oui", ordre: nombre(fd, "ordre", { min: 0, max: 9999 }) ?? 0,
    }).eq("id", texte(fd, "id", { requis: true, max: 40 })).select("id"));
    revalidatePath("/admin/medias");
    revalidatePath("/photos");
    revalidatePath("/histoire");
    return { ok: true, message: "Enregistré." };
  });
}

export async function supprimerMedia(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb } = await exigerRole("editeur");
    const r = await sb.from("medias").delete().eq("id", texte(fd, "id", { requis: true, max: 40 })).select("chemin");
    verifierEcriture(r);
    const chemin = r.data![0].chemin as string;
    // Les photos de départ (statique/…) vivent dans public/, pas dans le stockage
    if (!chemin.startsWith("statique/") && !chemin.startsWith("video/")) await sb.storage.from("medias").remove([chemin]);
    revalidatePath("/admin/medias");
    revalidatePath("/photos");
    revalidatePath("/histoire");
    return { ok: true, message: "Supprimé." };
  });
}
