import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/accueil";
import { evenements } from "@/lib/donnees";
import { jourLocal } from "@/lib/format";
import { evenementExpo, jsonLd, organisme } from "@/lib/referencement";

export const metadata: Metadata = {
  title: { absolute: meta.titre },
  description: meta.description,
};

// Relue toutes les heures : les dates de l'Expo (données pour Google) suivent la programmation
export const revalidate = 3600;

export default async function Page() {
  const { annee, liste } = await evenements();
  const expo = evenementExpo(annee, [...new Set(liste.map((e) => e.jour))].sort(), jourLocal(new Date()));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organisme())} />
      {expo && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(expo)} />}
      <Contenu />
    </>
  );
}
