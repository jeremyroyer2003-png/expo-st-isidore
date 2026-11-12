import type { Metadata } from "next";
import Contenu, { meta } from "@/contenu-statique/location";
import CalendrierSalles, { type CreneauPublic, type SallePublique } from "@/components/reservation/CalendrierSalles";
import { libererRetenue } from "@/actions/reservations";
import { DELAI_ANNULATION_HEURES } from "@/lib/annulation";
import { contenu, prixPublics } from "@/lib/donnees";
import { supabaseConfigure } from "@/lib/env";
import { argent, jourLocal } from "@/lib/format";
import { supabasePublic } from "@/lib/supabase/serveur";

export const metadata: Metadata = {
  title: meta.titre.replace(" | Expo St-Isidore", ""),
  description: "Louez le palais des commerces ou le Saloon de la grange 3 : choisissez une date libre et réservez en ligne. Tables, chaises et ambiance comprises.",
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ salle?: string; annule?: string }> }) {
  const { salle, annule } = await searchParams;
  // Retour de Stripe sans payer : la date redevient libre tout de suite
  if (annule) await libererRetenue(annule);

  const avis = await contenu("location_avis", "Tables, chaises et ambiance comprises.");
  if (!supabaseConfigure()) {
    return (
      <Contenu
        avis={avis}
        fraisAnnulation={null}
        calendrier={<div className="avis-bandeau" role="note"><p>La réservation en ligne arrive bientôt. D&apos;ici là, appelez le bureau au <a href="tel:+14188825649">418 882-5649</a>.</p></div>}
      />
    );
  }

  const sb = supabasePublic();
  const maintenant = new Date();
  const dansUnAn = new Date(maintenant.getTime() + 400 * 864e5);
  const [{ data: salles }, { data: creneaux }, { data: verrous }, prixSalles, prixFrais] = await Promise.all([
    sb.from("salles").select("id, slug, nom, description, cle_prix").order("ordre"),
    sb.from("creneaux_salle").select("id, salle_id, debut, fin, prix_cents, statut, retenu_jusqua")
      .gte("debut", maintenant.toISOString()).lte("debut", dansUnAn.toISOString()).order("debut"),
    sb.from("dates_verrouillees").select("jour, salle_id"),
    prixPublics("salle"),
    prixPublics("frais"),
  ]);

  const sallesPub: SallePublique[] = (salles ?? []).map((s) => {
    const p = prixSalles.find((x) => x.cle === s.cle_prix);
    return { id: s.id, slug: s.slug, nom: s.nom, description: s.description, prix: p?.visible ? p.montant_cents : null, fictif: !!p?.a_confirmer };
  });
  const creneauxPub: CreneauPublic[] = (creneaux ?? []).map((c) => ({
    id: c.id, salle_id: c.salle_id, debut: c.debut, fin: c.fin, prix_cents: c.prix_cents,
    // Libre : ouvert, ou retenu par un paiement abandonné dont le délai est passé
    libre: c.statut === "ouvert" || (c.statut === "retenu" && !!c.retenu_jusqua && new Date(c.retenu_jusqua) < maintenant),
  }));
  const fraisDe = (cle: string) => {
    const p = prixFrais.find((x) => x.cle === cle);
    return p?.visible ? argent(p.montant_cents) : null;
  };
  const fraisAnnulation = fraisDe("frais_annulation_salle");

  return (
    <Contenu
      avis={avis}
      fraisAnnulation={fraisAnnulation}
      delaiHeures={DELAI_ANNULATION_HEURES}
      fraisMenage={fraisDe("frais_menage_salle")}
      fraisDepassement={fraisDe("frais_depassement_salle")}
      calendrier={
        <CalendrierSalles
          key={salle ?? "defaut"}
          salles={sallesPub}
          creneaux={creneauxPub}
          verrous={verrous ?? []}
          salleInitiale={salle}
          aujourdhui={jourLocal(maintenant)}
          fraisAnnulation={fraisAnnulation}
          delaiHeures={DELAI_ANNULATION_HEURES}
        />
      }
    />
  );
}
