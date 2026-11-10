// Validation côté serveur : tout ce qui arrive d'un formulaire public est revérifié ici.

export class ErreurSaisie extends Error {}

export function texte(fd: FormData, nom: string, o: { requis?: boolean; max?: number } = {}): string {
  const v = String(fd.get(nom) ?? "").trim();
  if (o.requis && !v) throw new ErreurSaisie("Remplissez les champs obligatoires.");
  if (v.length > (o.max ?? 2000)) throw new ErreurSaisie("Un des champs est trop long.");
  return v;
}

export function courriel(fd: FormData, nom = "courriel"): string {
  const v = texte(fd, nom, { requis: true, max: 254 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) throw new ErreurSaisie("Vérifiez l'adresse courriel.");
  return v.toLowerCase();
}

export function telephone(fd: FormData, nom = "telephone", requis = true): string {
  const v = texte(fd, nom, { requis, max: 30 });
  if (!v) return "";
  const n = v.replace(/\D/g, "").length;
  if (n < 10 || n > 11) throw new ErreurSaisie("Entrez un numéro de téléphone complet, avec l'indicatif régional.");
  return v;
}

export function nombre(fd: FormData, nom: string, o: { requis?: boolean; min?: number; max?: number } = {}): number | null {
  const brut = texte(fd, nom, { requis: o.requis, max: 20 }).replace(",", ".");
  if (!brut) return null;
  if (!/^\d+(\.\d+)?$/.test(brut)) throw new ErreurSaisie("Un nombre n'est pas valide.");
  const n = Number(brut);
  if ((o.min != null && n < o.min) || (o.max != null && n > o.max)) throw new ErreurSaisie("Un nombre est hors des limites permises.");
  return n;
}

export function consentement(fd: FormData) {
  if (fd.get("consentement") !== "oui") throw new ErreurSaisie("Cochez la case de consentement pour envoyer.");
}

/** Champ piège invisible : rempli = robot. */
export function estRobot(fd: FormData): boolean {
  return String(fd.get("champ-robot") ?? "") !== "";
}

export type Resultat = { ok: true; message?: string; redirection?: string } | { ok: false; erreur: string };

/** Enveloppe une action serveur : erreurs de saisie -> message clair, autres erreurs -> message générique. */
export async function traiter(f: () => Promise<Resultat>, telephoneSecours = "418 882-5649"): Promise<Resultat> {
  try {
    return await f();
  } catch (e) {
    if (e instanceof ErreurSaisie) return { ok: false, erreur: e.message };
    console.error("[action]", e);
    return { ok: false, erreur: `L'envoi n'a pas fonctionné. Réessayez ou appelez-nous au ${telephoneSecours}.` };
  }
}
