import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/accueil";

export const metadata: Metadata = {
  title: { absolute: meta.titre },
  description: meta.description,
};

export default function Page() {
  return <Contenu />;
}
