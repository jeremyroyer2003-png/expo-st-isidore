import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/photos";
import { galerie } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "Photos et vidéos – tire, jugements, spectacles et kiosques",
  description: meta.description,
};

export const revalidate = 300;

export default async function Page() {
  return <Contenu medias={await galerie()} />;
}
