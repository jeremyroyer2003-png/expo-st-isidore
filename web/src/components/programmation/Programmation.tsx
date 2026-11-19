"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Evenement } from "@/lib/donnees";
import { enCeMoment, instantQuebec, telechargerIcs } from "./horaire";

const CATEGORIES = [
  { cle: "tout", nom: "Tout" },
  { cle: "animaux", nom: "Animaux" },
  { cle: "tire", nom: "Tire" },
  { cle: "spectacles", nom: "Spectacles" },
  { cle: "famille", nom: "Famille" },
  { cle: "kiosques", nom: "Kiosques" },
  { cle: "autres", nom: "Autres" },
] as const;

// Couleur et photo d'ambiance par catégorie. Photos propres à la programmation (page Facebook de l'Expo,
// droits à confirmer) pour ne pas répéter celles de l'accueil; aucun enfant identifiable.
const STYLE: Record<string, { fond: string; texte: string; photo: string }> = {
  animaux: { fond: "bg-olive", texte: "text-encre", photo: "/images/photos/jugement-ayrshire-400.webp" },
  tire: { fond: "bg-rouille", texte: "text-encre", photo: "/images/photos/tire-flammes-400.webp" },
  spectacles: { fond: "bg-rouge", texte: "text-creme", photo: "/images/photos/spectacle-bras-leves-400.webp" },
  famille: { fond: "bg-jean", texte: "text-encre", photo: "/images/photos/paon-400.webp" },
  kiosques: { fond: "bg-moutarde", texte: "text-encre", photo: "/images/photos/bbq-poulet-400.webp" },
  autres: { fond: "bg-kraft", texte: "text-encre", photo: "/images/photos/tracteur-balles-foin-400.webp" },
};

// Photo propre à chaque activité, reconnue par son titre (la photo réglée dans l'admin a priorité,
// la photo de catégorie ne sert qu'en dernier recours). L'ordre compte : le premier motif gagne
// (« La Grand-Messe » est un spectacle, pas la messe du dimanche).
// Photos de l'Expo (page Facebook, ancien site) quand elles existent; sinon photos libres de
// Wikimedia Commons, créditées dans docs/CREDITS-PHOTOS.md. Plusieurs fichiers = une par jour.
const PHOTOS_ACTIVITE: [RegExp, string[]][] = [
  [/bingo/, ["bingo-carte"]],
  [/feux d.artifice/, ["feux-artifice"]],
  [/cin[ée]ma/, ["cinema-exterieur"]],
  [/chiens? de berger/, ["chiens-berger"]],
  [/tonte/, ["preparation-genisse"]],
  [/latino/, ["danse-latino"]],
  [/pique-nique/, ["pique-nique"]],
  [/mascotte/, ["jeux-gonflables-coq"]],
  [/place de la famille/, ["jeux-gonflables"]],
  [/parcel/, ["parcelles-essai"]],
  [/mini-tracteur/, ["tracteur-pedales"]],
  [/tire de tracteurs/, ["tire-bleu-nuit", "tire-wild-thing", "tire-flammes", "tire-chrome"]],
  [/grand-messe/, ["spectacle-scene"]],
  [/\bmesse\b/, ["chapiteau-public"]],
  [/danse country|dancers/, ["danse-country"]],
  [/bar country/, ["soiree-saloon"]],
  [/social/, ["bbq-saucisses"]],
  [/jeunes [ée]leveurs/, ["holstein-arene"]],
  [/championne/, ["holstein-championne"]],
  [/jugement/, ["holstein-jugement"]],
  [/kiosques/, ["kiosques-interieurs", "kiosques-allee"]],
  [/agri.?culture/, ["agroalimentaire"]],
  [/grill|bbq/, ["bbq-poulet"]],
  [/beach/, ["spectacle-bras-leves"]],
  [/lex roses/, ["spectacle-chapiteau"]],
  [/that.?s hit/, ["spectacle-foule"]],
  [/hit the road/, ["chapiteau-foule"]],
  [/show|spectacle/, ["spectacle-scene"]],
];

// Photos libres (Wikimedia Commons) : le crédit est obligatoire (licences CC BY / CC BY-SA)
const CREDITS_ILLUSTRATION = [
  { sujet: "Feux d'artifice", auteur: "Andrew Kelly", licence: "domaine public", page: "https://commons.wikimedia.org/wiki/File:Fireworks_over_North_Carolina_State_Fair_2009.jpg" },
  { sujet: "Chiens de berger", auteur: "Scot Campbell", licence: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Border_Collie_sheepdog_trial.jpg" },
  { sujet: "Parcelles d'essai", auteur: "Michael Trolove", licence: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Cereal_trial_plot,_Cereals_2010_-_geograph.org.uk_-_1910647.jpg" },
  { sujet: "Bingo", auteur: "Abbey Hendrickson", licence: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Bingo_card.jpg" },
  { sujet: "Cinéma extérieur", auteur: "Bdx", licence: "CC0", page: "https://commons.wikimedia.org/wiki/File:Luxembourg_City_Open_Air_Cinema,_July_2025,_Knuedler.jpg" },
  { sujet: "Danse latino", auteur: "Edil Villa", licence: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:CCMDonation99.jpg" },
  { sujet: "Pique-nique", auteur: "Benjamin D. Esham", licence: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Picnic_table.jpg" },
  { sujet: "Jeux gonflables", auteur: "Arpingstone", licence: "domaine public", page: "https://commons.wikimedia.org/wiki/File:Bouncy.castle.arp.jpg" },
  { sujet: "Jeux gonflables (coq)", auteur: "Acabashi", licence: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Bouncy_Castle_at_Abridge_Village_Weekend_2022,_Essex_2.jpg" },
  { sujet: "Préparation d'une génisse", auteur: "Lorie Shaull", licence: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Participants_in_the_Open_Class_Dairy_Cattle_Show_at_the_Crow_Wing_County_Fair_in_Brainerd,_MN.jpg" },
  { sujet: "Tracteur à pédales", auteur: "inkknife_2000", licence: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Green_Spot_Farm,_Pedal_Tractor_10-26-13_(10561276776).jpg" },
];

function photoActivite(e: Evenement, taille: 400 | 800): string | null {
  const titre = e.titre.toLowerCase();
  const regle = PHOTOS_ACTIVITE.find(([motif]) => motif.test(titre));
  if (!regle) return null;
  const fichiers = regle[1];
  const fichier = fichiers[new Date(e.jour + "T12:00:00").getDate() % fichiers.length];
  return `/images/photos/${fichier}-${taille}.webp`;
}

// Bandeau du jour : la photo de l'activité vedette de la journée (dans cet ordre de priorité)
const VEDETTES = [/feux d.artifice/, /tire de tracteurs/, /jugement des bovins/, /chiens? de berger/, /bingo/, /danse country/];

function photoDuJour(liste: Evenement[]): string {
  for (const motif of VEDETTES) {
    const e = liste.find((x) => motif.test(x.titre.toLowerCase()));
    const photo = e && photoActivite(e, 800);
    if (photo) return photo;
  }
  for (const e of liste) {
    const photo = photoActivite(e, 800);
    if (photo) return photo;
  }
  return "/images/photos/chapiteau-foule-800.webp";
}

function infosJour(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    nom: d.toLocaleDateString("fr-CA", { weekday: "long" }),
    court: d.toLocaleDateString("fr-CA", { weekday: "short" }).replace(".", ""),
    num: d.getDate(),
    mois: d.toLocaleDateString("fr-CA", { month: "long" }),
  };
}

function BoutonCalendrier({ e, petit = false }: { e: Evenement; petit?: boolean }) {
  return (
    <button type="button" onClick={() => telechargerIcs(e)}
      className={`min-h-[40px] px-3 border-2 border-encre bg-creme hover:bg-moutarde font-etiquette font-bold uppercase tracking-wide ${petit ? "text-[13px]" : "text-[14px]"} text-encre`}>
      Ajouter à mon calendrier<span className="visuellement-cache"> : {e.titre}</span>
    </button>
  );
}

function Carte({ e, rang, aVenir }: { e: Evenement; rang: number; aVenir: boolean }) {
  const cat = e.categories[0] ?? "autres";
  const s = STYLE[cat] ?? STYLE.autres;
  const [debut, fin] = e.heure.split(" à ");
  return (
    <li
      className="anim-monter group relative grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr_150px] gap-0 bg-creme cadre-affiche transition-transform duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#1E140D] motion-reduce:hover:translate-y-0"
      style={{ animationDelay: `${Math.min(rang, 8) * 55}ms` }}
    >
      <div className={`${s.fond} ${s.texte} flex flex-col items-center justify-center px-2 py-4 border-r-[3px] border-encre text-center`}>
        <span className="font-pochoir font-extrabold text-[34px] sm:text-[40px] leading-none">{debut}</span>
        {fin && <span className="font-etiquette font-bold text-[15px] mt-1">à {fin}</span>}
      </div>
      <div className="px-4 py-3 sm:px-5 sm:py-4 min-w-0">
        <h3 className="font-etiquette font-extrabold text-[22px] sm:text-[24px] leading-tight text-encre">{e.titre}</h3>
        {e.description && <p className="mt-1 text-[16px] leading-snug text-gris-brun">{e.description}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-encre">
          <span>{e.lieu}</span>
          {e.prix && (
            <span className="font-etiquette uppercase tracking-wide text-[14px] px-2 py-0.5 border-2 border-encre bg-kraft">{e.prix}</span>
          )}
          {e.categories.map((c) => (
            <span key={c} className="font-etiquette uppercase tracking-wide text-[13px] text-gris-brun">{CATEGORIES.find((x) => x.cle === c)?.nom ?? c}</span>
          ))}
        </p>
        {aVenir && <p className="mt-2"><BoutonCalendrier e={e} petit /></p>}
      </div>
      <div className="hidden sm:block relative overflow-hidden border-l-[3px] border-encre">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e.photo || photoActivite(e, 400) || s.photo}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover sepia-[.25] transition duration-500 group-hover:scale-110 group-hover:sepia-0 motion-reduce:group-hover:scale-100"
        />
      </div>
    </li>
  );
}

export default function Programmation({ annee, evenements }: { annee: number; evenements: Evenement[] }) {
  const jours = useMemo(() => [...new Set(evenements.map((e) => e.jour))].sort(), [evenements]);
  // Hors Expo : on ouvre sur la journée la plus remplie (le premier jour n'a parfois qu'une activité)
  const plusRemplie = useMemo(() => jours.reduce((m, j) => (evenements.filter((e) => e.jour === j).length > evenements.filter((e) => e.jour === m).length ? j : m), jours[0]), [jours, evenements]);
  const [jour, setJour] = useState(plusRemplie);
  const [filtre, setFiltre] = useState<string>("tout");
  const [sens, setSens] = useState<"suivant" | "precedent">("suivant");
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);
  // Jour et heure au Québec, connus seulement dans le navigateur. ?simuler=2026-07-16T19:30 pour essayer.
  const [ici, setIci] = useState<{ jour: string; minute: number } | null>(null);
  const placeSurAujourdhui = useRef(false);

  useEffect(() => {
    const simule = new URLSearchParams(window.location.search).get("simuler");
    const maj = () => setIci(instantQuebec(simule));
    maj();
    if (simule) return;
    const minuterie = setInterval(maj, 60_000);
    return () => clearInterval(minuterie);
  }, []);

  const pendantExpo = !!ici && jours.includes(ici.jour);
  // Pendant l'Expo, l'onglet du jour s'ouvre de lui-même (une seule fois)
  useEffect(() => {
    if (pendantExpo && ici && !placeSurAujourdhui.current) {
      placeSurAujourdhui.current = true;
      setJour(ici.jour);
    }
  }, [pendantExpo, ici]);
  const direct = pendantExpo && ici ? enCeMoment(evenements, ici.jour, ici.minute) : null;
  // Pendant l'Expo, la page cache ce qui parle de l'archive (classe sur <html>, voir ajouts.css)
  useEffect(() => {
    document.documentElement.classList.toggle("expo-en-cours", pendantExpo);
  }, [pendantExpo]);

  const choisirJour = (j: string, focus = false) => {
    setSens(jours.indexOf(j) >= jours.indexOf(jour) ? "suivant" : "precedent");
    setJour(j);
    setFiltre("tout");
    if (focus) onglets.current[jours.indexOf(j)]?.focus();
  };

  const clavier = (e: React.KeyboardEvent, i: number) => {
    const cible = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: jours.length - 1 }[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    choisirJour(jours[(cible + jours.length) % jours.length], true);
  };

  const semaine = filtre !== "tout";
  const filtres = (e: Evenement) => !semaine || e.categories.includes(filtre);
  const affiches = semaine ? jours : [jour];
  const total = evenements.filter(filtres).length;

  return (
    <div>
      {/* Pendant l'Expo : ce qui se passe en ce moment et ce qui s'en vient ce soir */}
      {direct && (
        <section aria-labelledby="titre-direct" className="mb-8 border-[3px] border-encre bg-planche text-creme shadow-affiche p-4 sm:p-6">
          <h3 id="titre-direct" className="font-affiche text-[28px] sm:text-[34px] leading-none flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-3.5 w-3.5 rounded-full bg-rouille motion-safe:animate-pulse" />
            En ce moment
          </h3>
          {direct.maintenant.length ? (
            <ul className="mt-3 grid gap-2">
              {direct.maintenant.map((e) => (
                <li key={e.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <strong className="font-etiquette text-[21px]">{e.titre}</strong>
                  <span className="text-[16px] text-kraft">{e.heure} · {e.lieu}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[17px] text-kraft">Rien à l&apos;horaire à cette heure-ci. Les kiosques et les animaux restent à voir sur le terrain.</p>
          )}
          {direct.plusTard.length > 0 && (
            <>
              <h4 className="mt-5 font-etiquette font-bold uppercase tracking-widest text-[15px] text-moutarde">Plus tard aujourd&apos;hui</h4>
              <ul className="mt-2 grid gap-2">
                {direct.plusTard.slice(0, 4).map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-pochoir font-extrabold text-[20px] text-moutarde min-w-[64px]">{e.heure.split(" à ")[0]}</span>
                    <strong className="font-etiquette text-[19px]">{e.titre}</strong>
                    <span className="text-[15px] text-kraft">{e.lieu}</span>
                    <BoutonCalendrier e={e} petit />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {/* Jours : des billets d'entrée */}
      <div role="tablist" aria-label="Jours de l'Expo" className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3 mb-6">
        {jours.map((j, i) => {
          const d = infosJour(j);
          const actif = !semaine && j === jour;
          return (
            <button
              key={j}
              ref={(el) => { onglets.current[i] = el; }}
              role="tab"
              type="button"
              id={`onglet-${j}`}
              aria-selected={actif}
              aria-controls="panneau-programmation"
              tabIndex={actif || (semaine && i === 0) ? 0 : -1}
              onClick={() => choisirJour(j)}
              onKeyDown={(e) => clavier(e, i)}
              className={`relative min-h-[88px] border-[3px] border-encre px-2 py-2 text-center transition-all duration-200 motion-reduce:transition-none
                ${actif ? "bg-rouge text-creme shadow-affiche -translate-y-1" : "bg-kraft text-encre shadow-affiche-sm hover:-translate-y-0.5 hover:bg-moutarde"}
                before:absolute before:left-[-3px] before:top-1/2 before:h-4 before:w-2 before:-translate-y-1/2 before:rounded-r-full before:bg-creme before:border-[3px] before:border-l-0 before:border-encre
                after:absolute after:right-[-3px] after:top-1/2 after:h-4 after:w-2 after:-translate-y-1/2 after:rounded-l-full after:bg-creme after:border-[3px] after:border-r-0 after:border-encre`}
            >
              <span className="block font-etiquette font-bold uppercase tracking-wider text-[15px]">{d.court}</span>
              <span className="block font-affiche text-[34px] leading-none">{d.num}</span>
              <span className="block font-etiquette text-[14px]">{d.mois}</span>
            </button>
          );
        })}
      </div>

      {/* Filtres */}
      <div role="group" aria-label="Filtrer les activités" className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-etiquette font-bold uppercase text-[15px] mr-1" aria-hidden="true">Afficher&nbsp;:</span>
        {CATEGORIES.map((c) => {
          const actif = filtre === c.cle;
          const s = STYLE[c.cle];
          return (
            <button
              key={c.cle}
              type="button"
              aria-pressed={actif}
              onClick={() => setFiltre(c.cle)}
              className={`min-h-[44px] px-4 border-[3px] border-encre font-etiquette font-bold uppercase tracking-wide text-[16px] transition-all duration-150 motion-reduce:transition-none
                ${actif ? `${s ? `${s.fond} ${s.texte}` : "bg-encre text-creme"} shadow-affiche-sm -translate-y-0.5` : "bg-creme text-encre hover:bg-kraft"}`}
            >
              {c.nom}
            </button>
          );
        })}
      </div>
      <p className="visuellement-cache" aria-live="polite">
        {semaine ? `${total} activités « ${CATEGORIES.find((c) => c.cle === filtre)?.nom} » sur la semaine` : ""}
      </p>

      <div id="panneau-programmation" role="tabpanel" aria-labelledby={semaine ? undefined : `onglet-${jour}`} aria-label={semaine ? "Toute la semaine" : undefined}>
        {affiches.map((j) => {
          const liste = evenements.filter((e) => e.jour === j && filtres(e));
          if (!liste.length) return null;
          const d = infosJour(j);
          const photo = photoDuJour(liste);
          return (
            <section key={`${j}-${filtre}`} className={semaine ? "mb-12 anim-monter" : sens === "suivant" ? "anim-mois-suivant" : "anim-mois-precedent"} aria-label={`${d.nom} ${d.num} ${d.mois}`}>
              {/* Bandeau du jour : photo + grande date d'affiche */}
              <div className="relative mb-6 h-[150px] sm:h-[190px] overflow-hidden border-[3px] border-encre shadow-affiche">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-encre/90 via-encre/60 to-transparent" />
                <div className="relative flex h-full items-center gap-5 px-5 sm:px-8 text-creme">
                  <span className="font-affiche text-[72px] sm:text-[104px] leading-none text-moutarde">{d.num}</span>
                  <span>
                    <span className="block font-affiche text-[28px] sm:text-[40px] leading-none capitalize">{d.nom}</span>
                    <span className="block font-etiquette font-bold uppercase tracking-widest text-[15px] sm:text-[17px] mt-2">
                      {d.mois} {annee} · {liste.length} activité{liste.length > 1 ? "s" : ""}
                    </span>
                  </span>
                </div>
              </div>
              <ul className="grid gap-4">
                {liste.map((e, i) => <Carte key={e.id} e={e} rang={i} aVenir={!!ici && e.jour >= ici.jour} />)}
              </ul>
            </section>
          );
        })}
        {semaine && total === 0 && <p className="text-[18px]">Aucune activité de ce type cette année-là.</p>}
      </div>

      <details className="mt-10 text-[15px] text-gris-brun">
        <summary className="cursor-pointer font-etiquette font-bold uppercase tracking-wide min-h-[44px] inline-flex items-center">Crédits des photos d&apos;illustration</summary>
        <p className="mt-2">Les photos de l&apos;Expo viennent de ses photographes et de sa page Facebook. Quand l&apos;Expo n&apos;a pas de photo d&apos;une activité, une photo libre d&apos;ailleurs l&apos;illustre&nbsp;:</p>
        <ul className="mt-2 grid gap-1">
          {CREDITS_ILLUSTRATION.map((c) => (
            <li key={c.sujet}>
              {c.sujet}&nbsp;: <a className="underline" href={c.page} rel="noopener noreferrer">{c.auteur}</a>, {c.licence}, Wikimedia Commons
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
