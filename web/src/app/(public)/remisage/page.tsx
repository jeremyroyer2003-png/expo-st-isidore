import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/remisage";
import { prixPublics } from "@/lib/donnees";
import { argent } from "@/lib/format";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: meta.description,
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const prix = await prixPublics("remisage");
  const pied = prix.find((p) => p.cle === "remisage_pied");
  const depot = prix.find((p) => p.cle === "remisage_depot_min");
  return (
    <Contenu
      prixParPied={pied?.visible ? pied.montant_cents / 100 : null}
      depotMin={depot?.visible ? argent(depot.montant_cents) : null}
    />
  );
}
