import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/histoire";
import { photosComites } from "@/lib/donnees";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: meta.description,
};

// Relue toutes les 5 minutes : une nouvelle photo du comité (médiathèque) apparaît vite
export const revalidate = 300;

export default async function Page() {
  // La plus récente photo de l'album « Comités » de la médiathèque (« Ordre » = année)
  const [p] = await photosComites();
  return <Contenu photoComite={p ? { url: p.url, annee: p.ordre, noms: p.alt, credit: p.credit } : null} />;
}
