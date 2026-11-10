"use server";

import { envoyerCourriel } from "@/lib/courriel";
import { accuseMessage, messageRecu } from "@/lib/courriel/gabarits";
import { env, supabaseConfigure } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/serveur";
import { consentement, courriel, estRobot, telephone, texte, traiter, type Resultat, ErreurSaisie } from "@/lib/validation";

const LIBELLES: Record<string, string> = { contact: "Contact", exposants: "Exposants" };

/** Formulaires Contact et Exposants : enregistre le message, prévient l'admin, accuse réception. */
export async function envoyerMessage(fd: FormData): Promise<Resultat> {
  return traiter(async () => {
    if (estRobot(fd)) return { ok: true };
    const formulaire = texte(fd, "formulaire", { requis: true, max: 20 });
    if (!LIBELLES[formulaire]) throw new ErreurSaisie("Formulaire inconnu.");
    const nom = texte(fd, "nom", { requis: true, max: 120 });
    const c = courriel(fd);
    const tel = telephone(fd, "telephone", formulaire === "exposants");
    const message = texte(fd, "message", { requis: formulaire === "contact", max: 4000 });
    const sujet = formulaire === "contact" ? texte(fd, "sujet", { requis: true, max: 80 }) : texte(fd, "emplacement", { requis: true, max: 80 });
    const entreprise = texte(fd, "entreprise", { max: 160 });
    consentement(fd);

    if (!supabaseConfigure()) throw new Error("Supabase n'est pas configuré (.env.local)");
    const { error } = await supabaseService().from("messages").insert({
      formulaire, nom, courriel: c, telephone: tel, sujet, message, donnees: entreprise ? { entreprise } : {},
    });
    if (error) throw error;

    await Promise.all([
      envoyerCourriel({
        a: env.courrielAdmin,
        ...messageRecu(LIBELLES[formulaire], [
          ["Nom", nom], ["Courriel", c], ["Téléphone", tel || "—"], ...(entreprise ? [["Entreprise", entreprise] as [string, string]] : []),
          [formulaire === "contact" ? "Sujet" : "Emplacement", sujet], ["Message", message || "—"],
        ]),
      }),
      envoyerCourriel({ a: c, ...accuseMessage(nom) }),
    ]);
    return { ok: true };
  });
}
