// Filtres des listes de l'admin (statut, période, tri), lus dans l'adresse de la page (?statut=…&periode=…&tri=…).
// Les dates se comparent en jours locaux du Québec : « ce mois-ci » veut dire le mois au Québec, pas en UTC.
import { jourLocal } from "@/lib/format";

export type Option = [valeur: string, libelle: string];

export const PERIODES: Option[] = [
  ["tout", "Toutes les dates"],
  ["7j", "7 derniers jours"],
  ["30j", "30 derniers jours"],
  ["mois", "Ce mois-ci"],
  ["mois-dernier", "Le mois dernier"],
  ["annee", "Cette année"],
  ["plus-7j", "Il y a plus de 7 jours"],
];

const ilYa = (jours: number) => jourLocal(new Date(Date.now() - jours * 864e5));

/** La date (ISO) tombe-t-elle dans la période choisie? Période inconnue = tout. */
export function dansPeriode(iso: string | null | undefined, periode: string): boolean {
  if (!iso || periode === "tout") return true;
  const j = jourLocal(iso);
  const auj = jourLocal(new Date());
  switch (periode) {
    case "7j": return j >= ilYa(7);
    case "30j": return j >= ilYa(30);
    case "mois": return j.slice(0, 7) === auj.slice(0, 7);
    case "mois-dernier": {
      const [a, m] = auj.split("-").map(Number);
      const prec = m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, "0")}`;
      return j.slice(0, 7) === prec;
    }
    case "annee": return j.slice(0, 4) === auj.slice(0, 4);
    case "plus-7j": return j < ilYa(7);
    default: return true;
  }
}

/** Valeur d'un filtre si elle est permise, sinon la valeur par défaut. */
export function choix(valeur: string | undefined, options: Option[], defaut: string): string {
  return valeur && options.some(([v]) => v === valeur) ? valeur : defaut;
}

/** Tris communs. `date` = la date qui compte pour la liste (reçue, réservée…). */
export function trier<T>(liste: T[], tri: string, champs: { date: (x: T) => string; montant: (x: T) => number | null; nom: (x: T) => string }): T[] {
  const copie = [...liste];
  if (tri === "recent") copie.sort((a, b) => champs.date(b).localeCompare(champs.date(a)));
  else if (tri === "ancien") copie.sort((a, b) => champs.date(a).localeCompare(champs.date(b)));
  else if (tri === "montant") copie.sort((a, b) => (champs.montant(b) ?? -1) - (champs.montant(a) ?? -1));
  else if (tri === "nom") copie.sort((a, b) => champs.nom(a).localeCompare(champs.nom(b), "fr-CA", { sensitivity: "base" }));
  return copie;
}
