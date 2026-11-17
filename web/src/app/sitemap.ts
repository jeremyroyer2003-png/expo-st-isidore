import type { MetadataRoute } from "next";
import { PAGES_PUBLIQUES, urlSite } from "@/lib/referencement";

// /sitemap.xml : les pages publiques seulement (pas l'admin, ni les liens de paiement ou de suivi)
export default function sitemap(): MetadataRoute.Sitemap {
  const url = urlSite();
  return PAGES_PUBLIQUES.map((p) => ({ url: `${url}${p.chemin === "/" ? "" : p.chemin}`, changeFrequency: p.frequence, priority: p.priorite }));
}
