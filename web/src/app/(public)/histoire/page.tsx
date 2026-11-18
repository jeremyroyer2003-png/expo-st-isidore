import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/histoire";
import PelliculeComites from "@/components/site/PelliculeComites";
import { photosComites } from "@/lib/donnees";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: meta.description,
};

// Relue toutes les 5 minutes : une photo de comité ajoutée dans la médiathèque apparaît vite
export const revalidate = 300;

export default async function Page() {
  const photos = await photosComites();
  return <Contenu comites={photos.length ? <PelliculeComites photos={photos} /> : undefined} />;
}
