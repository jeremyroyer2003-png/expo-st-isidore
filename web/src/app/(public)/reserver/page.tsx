import type { Metadata } from "next";
import Link from "next/link";
import { estHiver } from "@/lib/saison";

export const metadata: Metadata = {
  title: "Réserver – salle, kiosque, danse et remisage",
  description: "Réservez en ligne à l'Expo St-Isidore : location de salle, kiosque au palais des commerces, danse country et remisage d'hiver.",
};

const SERVICES = [
  { href: "/location", titre: "Louer une salle", texte: "Le palais des commerces ou le Saloon de la grange 3. Choisissez une date libre et payez en ligne.", photo: "/images/photos/soiree-saloon-800.webp", alt: "Façade du Saloon illuminée le soir", couleur: "bg-olive", action: "Voir les dates libres" },
  { href: "/kiosques", titre: "Réserver un kiosque", texte: "Choisissez votre emplacement sur le plan du palais des commerces, ou demandez un kiosque extérieur.", photo: "/images/photos/kiosques-interieurs-800.webp", alt: "Allée de kiosques dans le palais des commerces", couleur: "bg-moutarde", action: "Ouvrir le plan" },
  { href: "/danse", titre: "Danse country", texte: "L'été, dans la grange 2. 20 $ la session, ou un forfait pour le mois ou la saison.", photo: "/images/photos/danse-country-800.webp", alt: "Danseurs en ligne dans une grange décorée", couleur: "bg-jean", action: "Voir les forfaits" },
  { href: "/remisage", titre: "Remisage d'hiver", texte: "Roulottes, VR, autos, bateaux et motos, à l'intérieur. Envoyez vos dimensions; un dépôt garde votre place.", photo: "/images/photos/terrain-aerien-800.webp", alt: "Les bâtiments de l'Expo vus du ciel", couleur: "bg-rouille", action: "Envoyer mes dimensions" },
];

// Relue toutes les heures : l'ordre des services suit la saison
export const revalidate = 3600;

export default function Page() {
  // Hiver : le remisage d'abord (c'est la saison des entrées); été : la salle, les kiosques et la danse
  const services = estHiver() ? [SERVICES[3], SERVICES[0], SERVICES[1], SERVICES[2]] : SERVICES;
  return (
    <>
      <section className="heros heros--page heros--compact" aria-labelledby="titre-heros">
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Toute l&apos;année</span><span>En ligne</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>Réserver</span></h1>
          </div>
          <div className="heros__cote">
            <p className="heros__intro">Les bâtiments de l&apos;Expo travaillent toute l&apos;année. Choisissez ce que vous voulez réserver.</p>
          </div>
        </div>
      </section>
      <section className="section-papier" aria-label="Services">
        <div className="contenu section-espacee">
          <ul className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <li key={s.href} className="anim-monter" style={{ animationDelay: `${i * 70}ms` }}>
                <Link href={s.href} className="group grid grid-cols-[38%_1fr] h-full bg-creme cadre-affiche overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#1E140D] motion-reduce:hover:translate-y-0">
                  <span className="relative overflow-hidden border-r-[3px] border-encre">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo} alt={s.alt} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100" loading="lazy" />
                  </span>
                  <span className={`${s.couleur} p-5 flex flex-col gap-2 text-encre`}>
                    <span className="font-affiche text-[26px] leading-tight">{s.titre}</span>
                    <span className="text-[17px] leading-snug">{s.texte}</span>
                    <span className="mt-auto pt-2 font-etiquette font-bold uppercase tracking-wide text-[16px] underline underline-offset-4">{s.action} →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
