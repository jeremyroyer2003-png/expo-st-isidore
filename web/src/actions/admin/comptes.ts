"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigerRole, verifierEcriture } from "@/lib/admin";
import { supabaseService, supabaseSession } from "@/lib/supabase/serveur";
import { courriel, ErreurSaisie, texte, traiter, type Resultat } from "@/lib/validation";

export async function deconnexion() {
  const sb = await supabaseSession();
  await sb.auth.signOut();
  redirect("/admin/connexion");
}

const ROLES = ["super_admin", "editeur", "lecteur"];

/**
 * Super-admin seulement : crée un compte admin avec un mot de passe temporaire.
 * La création d'utilisateur exige la clé service; on vérifie donc le rôle AVANT, avec la session.
 */
export async function creerCompte(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    await exigerRole("super_admin");
    const c = courriel(fd);
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const role = texte(fd, "role", { requis: true, max: 20 });
    const mdp = texte(fd, "motdepasse", { requis: true, max: 200 });
    if (!ROLES.includes(role)) throw new ErreurSaisie("Rôle inconnu.");
    if (mdp.length < 10) throw new ErreurSaisie("Le mot de passe temporaire doit avoir au moins 10 caractères.");

    const service = supabaseService();
    const { data, error } = await service.auth.admin.createUser({ email: c, password: mdp, email_confirm: true });
    if (error) throw new ErreurSaisie(error.message.includes("already") ? "Ce courriel a déjà un compte." : error.message);
    const { error: e2 } = await service.from("profils").insert({ id: data.user.id, courriel: c, nom, role });
    if (e2) {
      await service.auth.admin.deleteUser(data.user.id);
      throw e2;
    }
    revalidatePath("/admin/utilisateurs");
    return { ok: true, message: `Compte créé. Transmettez le mot de passe temporaire à ${nom} de vive voix.` };
  });
}

export async function changerRole(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { sb, userId } = await exigerRole("super_admin");
    const id = texte(fd, "id", { requis: true, max: 40 });
    const role = texte(fd, "role", { requis: true, max: 20 });
    if (!ROLES.includes(role)) throw new ErreurSaisie("Rôle inconnu.");
    if (id === userId && role !== "super_admin") throw new ErreurSaisie("Vous ne pouvez pas retirer votre propre rôle de super-admin.");
    // Passe par la session : la RLS (profils_super) le permet seulement au super-admin
    verifierEcriture(await sb.from("profils").update({ role }).eq("id", id).select("id"));
    revalidatePath("/admin/utilisateurs");
    return { ok: true, message: "Rôle modifié." };
  });
}

export async function supprimerCompte(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    const { userId } = await exigerRole("super_admin");
    const id = texte(fd, "id", { requis: true, max: 40 });
    if (id === userId) throw new ErreurSaisie("Vous ne pouvez pas supprimer votre propre compte.");
    const { error } = await supabaseService().auth.admin.deleteUser(id);
    if (error) throw error;
    revalidatePath("/admin/utilisateurs");
    return { ok: true, message: "Compte supprimé." };
  });
}
