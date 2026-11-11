import type { Metadata } from "next";
import HerosVideo from "@/components/site/HerosVideo";
import PelliculePhotos from "@/components/site/PelliculePhotos";
import Contenu, { meta } from "@/contenu-statique/accueil";

// Version 2 de l'accueil, pour comparer en local avec / : héros vidéo (photo animée par IA)
// et pellicule de photos de la page Facebook. Le reste de la page est identique.
// Pas dans le menu, pas indexée. À supprimer ou à promouvoir après la décision de Jérémy.
export const metadata: Metadata = {
  title: { absolute: `${meta.titre} (version 2, essai)` },
  description: meta.description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Contenu
      heros={
        <>
          <HerosVideo />
          <PelliculePhotos />
        </>
      }
    />
  );
}
