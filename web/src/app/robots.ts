import type { MetadataRoute } from "next";
import { indexationPermise, urlSite } from "@/lib/referencement";

// /robots.txt. Site d'essai (maquette) : aucun moteur ne l'indexe. Vrai site (PERMETTRE_INDEXATION=true) :
// tout est permis sauf l'admin et les pages personnelles (paiement, annulation, suivi).
export default function robots(): MetadataRoute.Robots {
  if (!indexationPermise()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/payer/", "/annuler/", "/ma-demande/", "/paiement/"] },
    sitemap: `${urlSite()}/sitemap.xml`,
  };
}
