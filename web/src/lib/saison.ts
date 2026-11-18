// Saison du site, même règle que le script du <head> (app/layout.tsx) :
// hiver du 15 octobre au 14 mai (remisage), été le reste de l'année (Expo, danse).
import { jourLocal } from "@/lib/format";

export function estHiver(maintenant = new Date()): boolean {
  const [, m, j] = jourLocal(maintenant).split("-").map(Number);
  return m > 10 || m < 5 || (m === 10 && j >= 15) || (m === 5 && j < 15);
}
