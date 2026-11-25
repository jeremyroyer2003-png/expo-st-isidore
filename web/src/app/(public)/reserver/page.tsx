import type { Metadata } from "next";
import Link from "next/link";
import { estHiver } from "@/lib/saison";

export const metadata: Metadata = {
  title: "Réserver – salle, kiosque, danse et remisage",
  description: "Réservez en ligne à l'Expo St-Isidore : location de salle, kiosque au palais des commerces, danse country et remisage d'hiver.",
};

type Service = { href: string; titre: string; quand: string; texte: string; photo: string; alt: string; action: string };

const SERVICES: Service[] = [
  { href: "/location", titre: "Louer une salle", quand: "Toute l'année", texte: "Le palais des commerces ou le Saloon de la grange 3. Choisissez une date libre et payez en ligne.", photo: "/images/photos/soiree-saloon", alt: "Façade du Saloon illuminée le soir", action: "Voir les dates libres" },
  { href: "/kiosques", titre: "Réserver un kiosque", quand: "Pendant l'Expo, en juillet", texte: "Choisissez vos emplacements sur le plan du palais des commerces, ou demandez un kiosque extérieur.", photo: "/images/photos/kiosques-interieurs", alt: "Allée de kiosques dans le palais des commerces", action: "Ouvrir le plan" },
  { href: "/danse", titre: "Danse country", quand: "L'été, grange 2", texte: "20 $ la session, ou un forfait pour le mois ou la saison.", photo: "/images/photos/danse-country", alt: "Danseurs en ligne dans une grange décorée", action: "Voir les forfaits" },
  { href: "/remisage", titre: "Remisage d'hiver", quand: "De la mi-octobre à la mi-mai", texte: "Roulottes, VR, autos, bateaux et motos, à l'intérieur des bâtiments. Envoyez vos dimensions; un dépôt garde votre place.", photo: "/images/photos/terrain-aerien", alt: "Les bâtiments de l'Expo vus du ciel", action: "Envoyer mes dimensions" },
];

// Relue toutes les heures : l'ordre des services suit la saison
export const revalidate = 3600;

/** Carte sur planches : la photo se fond dans le bois, comme les en-têtes et l'horaire. */
function Carte({ s, vedette = false, rang }: { s: Service; vedette?: boolean; rang: number }) {
  return (
    <li className={`anim-monter ${vedette ? "md:col-span-3" : ""}`} style={{ animationDelay: `${rang * 70}ms` }}>
      <Link href={s.href}
        className={`fiche-horaire group relative flex h-full flex-col overflow-hidden border-[3px] border-encre shadow-affiche text-creme no-underline transition-transform duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#1E140D] motion-reduce:hover:translate-y-0
          ${vedette ? "md:block md:min-h-[340px]" : ""}`}>
        <span className={`fiche-horaire__photo relative block h-[190px] sm:h-[220px] ${vedette ? "md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[62%]" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${s.photo}-800.webp`} srcSet={`${s.photo}-800.webp 800w, ${s.photo}.webp 1400w`} sizes={vedette ? "(max-width: 768px) 100vw, 62vw" : "(max-width: 768px) 100vw, 33vw"}
            alt={s.alt} loading={vedette ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100" />
          <span aria-hidden="true" className={vedette ? "reserver__voile-vedette absolute inset-0" : "reserver__voile-bas absolute inset-0"} />
        </span>
        <span className={`relative flex flex-1 flex-col gap-2 px-5 pb-5 -mt-8 ${vedette ? "md:mt-0 md:max-w-[52%] md:justify-center md:min-h-[340px] md:px-9 md:py-8" : ""}`}>
          <span className="font-etiquette font-bold uppercase tracking-[.14em] text-[14px] text-moutarde">{s.quand}</span>
          <span className={`font-affiche leading-[1.05] text-creme ${vedette ? "text-[30px] md:text-[44px]" : "text-[27px]"}`}>{s.titre}</span>
          <span className={`leading-snug text-kraft ${vedette ? "text-[17px] md:text-[19px]" : "text-[17px]"}`}>{s.texte}</span>
          <span className="mt-auto pt-3">
            <span className={`bouton ${vedette ? "bouton--orange" : "bouton--contour"} pointer-events-none`}>{s.action} <span className="fleche" aria-hidden="true">→</span></span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function Page() {
  // Hiver : le remisage d'abord (c'est la saison des entrées); été : la salle, les kiosques et la danse
  const hiver = estHiver();
  const danse = hiver ? { ...SERVICES[2], texte: "Inscriptions en ligne dès la mi-mai, quand les dates de la saison sont connues.", action: "Voir les forfaits" } : SERVICES[2];
  const services = hiver ? [SERVICES[3], SERVICES[0], SERVICES[1], danse] : SERVICES;
  const [vedette, ...autres] = services;
  return (
    <>
      <section className="heros heros--page heros--video" aria-labelledby="titre-heros">
        {/* Le tracteur en balles de foin de l'Expo, fondu dans les planches */}
        <figure className="heros__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/photos/tracteur-balles-foin.webp" srcSet="/images/photos/tracteur-balles-foin-800.webp 800w, /images/photos/tracteur-balles-foin.webp 1600w" sizes="(max-width: 760px) 100vw, 64vw" alt="Tracteur géant fait de balles de foin enrubannées jaunes, devant de la machinerie sous un ciel orageux" width={1600} height={1066} fetchPriority="high" />
          <span className="heros__voile" aria-hidden="true" />
          <figcaption className="heros__credit">Photo&nbsp;: Gagné Photographie</figcaption>
        </figure>
        <div className="contenu heros__grille heros__grille--texte">
          <div className="heros__texte">
            <p className="billet"><span>Toute l&apos;année</span><span>En ligne</span></p>
            <h1 id="titre-heros" className="heros__titre"><span>Réserver</span></h1>
            <p className="heros__intro">Les bâtiments de l&apos;Expo travaillent toute l&apos;année. Choisissez ce que vous voulez réserver.</p>
          </div>
        </div>
      </section>
      <section className="section-papier" aria-label="Services">
        <div className="contenu section-espacee">
          <ul className="grid gap-6 md:grid-cols-3">
            <Carte s={vedette} vedette rang={0} />
            {autres.map((s, i) => <Carte key={s.href} s={s} rang={i + 1} />)}
          </ul>
        </div>
      </section>
    </>
  );
}
