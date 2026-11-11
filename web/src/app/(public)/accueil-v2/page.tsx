import type { Metadata } from "next";
import HerosProfondeur from "@/components/site/HerosProfondeur";
import Contenu, { meta } from "@/contenu-statique/accueil";

// Version 2 de l'accueil, pour comparer en local avec / (seul le héros change).
// Pas dans le menu, pas indexée. À supprimer ou à promouvoir après la décision de Jérémy.
export const metadata: Metadata = {
  title: { absolute: `${meta.titre} (version 2, essai)` },
  description: meta.description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Contenu heros={<HerosProfondeur />} />;
}
