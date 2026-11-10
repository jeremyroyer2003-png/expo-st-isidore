import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/programmation";
import { evenements } from "@/lib/donnees";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: meta.description,
};

// Relue toutes les 5 minutes : un événement ajouté dans l'admin apparaît vite
export const revalidate = 300;

export default async function Page() {
  const { annee, liste } = await evenements();
  return <Contenu annee={annee} evenements={liste} />;
}
