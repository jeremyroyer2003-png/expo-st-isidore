// Référencement : plan du site, robots.txt et données structurées (schema.org) pour Google.
// Tant que le comité n'a pas approuvé la mise en ligne, le site d'essai demande aux moteurs de ne PAS l'indexer :
// mettre PERMETTRE_INDEXATION=true dans Netlify seulement pour le vrai site.
export const indexationPermise = () => process.env.PERMETTRE_INDEXATION === "true";

export const urlSite = () => (process.env.NEXT_PUBLIC_URL_SITE || "http://localhost:3000").replace(/\/$/, "");

/** Pages publiques à mettre dans le plan du site, avec leur importance relative. */
export const PAGES_PUBLIQUES: { chemin: string; priorite: number; frequence: "weekly" | "monthly" | "yearly" }[] = [
  { chemin: "/", priorite: 1, frequence: "weekly" },
  { chemin: "/programmation", priorite: 0.9, frequence: "weekly" },
  { chemin: "/remisage", priorite: 0.9, frequence: "monthly" },
  { chemin: "/location", priorite: 0.8, frequence: "weekly" },
  { chemin: "/tire-de-tracteurs", priorite: 0.8, frequence: "monthly" },
  { chemin: "/kiosques", priorite: 0.7, frequence: "monthly" },
  { chemin: "/exposants", priorite: 0.7, frequence: "monthly" },
  { chemin: "/danse", priorite: 0.6, frequence: "monthly" },
  { chemin: "/reserver", priorite: 0.6, frequence: "monthly" },
  { chemin: "/photos", priorite: 0.5, frequence: "monthly" },
  { chemin: "/histoire", priorite: 0.5, frequence: "yearly" },
  { chemin: "/contact", priorite: 0.6, frequence: "yearly" },
  { chemin: "/confidentialite", priorite: 0.1, frequence: "yearly" },
];

const ADRESSE = {
  "@type": "PostalAddress",
  streetAddress: "132, route Coulombe",
  addressLocality: "Saint-Isidore",
  addressRegion: "QC",
  postalCode: "G0S 2S0",
  addressCountry: "CA",
};

/** L'organisme local : nom, adresse, téléphones, page Facebook. */
export function organisme() {
  const url = urlSite();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organisme`,
    name: "Expo St-Isidore",
    alternateName: "Exposition agricole du Bassin de la Chaudière",
    url,
    logo: `${url}/images/favicon.png`,
    email: "info@expobassinchaudiere.com",
    telephone: "+1-418-882-5649",
    foundingDate: "1982",
    address: ADRESSE,
    sameAs: ["https://www.facebook.com/expostisidorebassinchaudiere/"],
    contactPoint: [
      { "@type": "ContactPoint", telephone: "+1-418-882-5649", contactType: "customer service", areaServed: "CA", availableLanguage: "French" },
      { "@type": "ContactPoint", telephone: "+1-418-882-9619", contactType: "reservations", name: "Remisage d'hiver", availableLanguage: "French" },
    ],
  };
}

/** L'Expo de l'année (seulement si ses dates sont connues et pas encore passées). */
export function evenementExpo(annee: number, jours: string[], aujourdhui: string) {
  if (!jours.length) return null;
  const debut = jours[0], fin = jours[jours.length - 1];
  if (fin < aujourdhui) return null;
  const url = urlSite();
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Expo St-Isidore ${annee}`,
    description: "Exposition agricole gratuite en Beauce : jugements d'animaux, tire de tracteurs, spectacles et activités familiales.",
    startDate: debut,
    endDate: fin,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    inLanguage: "fr-CA",
    url: `${url}/programmation`,
    image: [`${url}/images/partage/index.jpg`],
    location: { "@type": "Place", name: "Terrain de l'Expo St-Isidore", address: ADRESSE },
    organizer: { "@id": `${url}/#organisme` },
    offers: { "@type": "Offer", price: 0, priceCurrency: "CAD", availability: "https://schema.org/InStock", url: `${url}/programmation` },
  };
}

/** Balise <script> JSON-LD (les « < » sont échappés pour qu'aucun texte ne ferme la balise). */
export const jsonLd = (o: object) => ({ __html: JSON.stringify(o).replace(/</g, "\\u003c") });
