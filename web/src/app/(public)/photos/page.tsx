import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/photos";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: meta.description,
};

export default function Page() {
  return <Contenu />;
}
