import { env } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/serveur";

export type Courriel = {
  a: string;
  sujet: string;
  html: string;
  texte: string;
  gabarit: string;
};

/** Un fournisseur sait envoyer un courriel. Pour en ajouter un, implémenter cette interface. */
export interface FournisseurCourriel {
  nom: string;
  envoyer(c: Courriel): Promise<void>;
}

/** Par défaut : rien ne part. Le courriel est affiché dans la console et gardé dans la boîte d'envoi. */
const fournisseurConsole: FournisseurCourriel = {
  nom: "console",
  async envoyer(c) {
    console.info(`\n[courriel simulé] À : ${c.a}\nSujet : ${c.sujet}\n${c.texte}\n`);
  },
};

/** Resend, par simple appel HTTP (aucun SDK). S'active avec COURRIEL_FOURNISSEUR=resend. */
const fournisseurResend: FournisseurCourriel = {
  nom: "resend",
  async envoyer(c) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendCle}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.courrielExpediteur, to: [c.a], subject: c.sujet, html: c.html, text: c.texte }),
    });
    if (!r.ok) throw new Error(`Resend a répondu ${r.status} : ${await r.text()}`);
  },
};

function fournisseur(): FournisseurCourriel {
  return env.courrielFournisseur === "resend" ? fournisseurResend : fournisseurConsole;
}

/**
 * Envoie (ou simule) un courriel et l'inscrit dans la boîte d'envoi de l'admin.
 * Un échec d'envoi ne bloque jamais une réservation : il est noté et visible dans l'admin.
 */
export async function envoyerCourriel(c: Courriel): Promise<void> {
  const f = fournisseur();
  let statut: "journalise" | "envoye" | "echec" = f.nom === "console" ? "journalise" : "envoye";
  let erreur: string | null = null;
  try {
    await f.envoyer(c);
  } catch (e) {
    statut = "echec";
    erreur = e instanceof Error ? e.message : String(e);
    console.error("[courriel] échec :", erreur);
  }
  const { error } = await supabaseService().from("courriels_sortants").insert({
    destinataire: c.a,
    sujet: c.sujet,
    html: c.html,
    texte: c.texte,
    gabarit: c.gabarit,
    fournisseur: f.nom,
    statut,
    erreur,
  });
  if (error) console.error("[courriel] boîte d'envoi :", error.message);
}

/** Envoie au client et à l'administration en même temps. */
export async function envoyerAuxDeux(client: Courriel, admin: Omit<Courriel, "a">) {
  await Promise.all([envoyerCourriel(client), envoyerCourriel({ ...admin, a: env.courrielAdmin })]);
}
