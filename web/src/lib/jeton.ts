// Liens signés envoyés par courriel (ex. : annuler sa réservation). Le lien contient l'identifiant et une
// signature HMAC : impossible à deviner ou à modifier, et aucune colonne à ajouter dans la base.
// Clé : JETON_SECRET si elle existe, sinon la clé service de Supabase (déjà secrète, présente partout).
// Serveur seulement : n'importer que depuis des actions, des pages serveur ou lib/.
import { createHmac, timingSafeEqual } from "node:crypto";

function cle() {
  const k = process.env.JETON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!k) throw new Error("Aucune clé pour signer les liens (.env.local)");
  return k;
}

function signature(usage: string, id: string) {
  return createHmac("sha256", cle()).update(`${usage}:${id}`).digest("base64url").slice(0, 32);
}

/** Jeton à mettre dans un lien : « identifiant.signature ». */
export function signerJeton(usage: string, id: string) {
  return `${id}.${signature(usage, id)}`;
}

/** Renvoie l'identifiant si la signature est bonne, sinon null. */
export function lireJeton(usage: string, jeton: string): string | null {
  const [id, sig] = jeton.split(".");
  if (!id || !sig || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const attendue = Buffer.from(signature(usage, id));
  const recue = Buffer.from(sig);
  return attendue.length === recue.length && timingSafeEqual(attendue, recue) ? id : null;
}
