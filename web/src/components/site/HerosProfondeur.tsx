"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./HerosProfondeur.css";

// Héros de l'accueil, version 2 (essai local, page /accueil-v2) : une scène de tire de tracteurs
// en plans séparés qui bougent à des vitesses différentes au défilement, puis un « rideau de
// poussière » qui part du tuyau d'échappement et dévoile le message de la saison.
//
// Plans (public/images/heros-v2/) : plaque = vraie photo ELZEPHOTO dont le tracteur a été retiré
// (Higgsfield), tracteur = le vrai tracteur de la même photo, détouré; fumée = générée par IA.
// Le défilement est piloté par le moteur Scrollcraft (public/vendor/scrollcraft, licence MIT),
// qui publie la progression --sc-p (0 à 1) sur la section; tout le reste est en CSS.

declare global {
  interface Window {
    ScrollCraft?: { mount: (racine: Element) => unknown };
  }
}

const MOTEUR = "/vendor/scrollcraft/scrollcraft.js";

function chargerMoteur(): Promise<void> {
  if (window.ScrollCraft) return Promise.resolve();
  return new Promise((ok, erreur) => {
    const existant = document.querySelector<HTMLScriptElement>(`script[src="${MOTEUR}"]`);
    const script = existant ?? Object.assign(document.createElement("script"), { src: MOTEUR, async: true });
    script.addEventListener("load", () => ok());
    script.addEventListener("error", () => erreur(new Error("Moteur Scrollcraft introuvable")));
    if (!existant) document.head.appendChild(script);
  });
}

export default function HerosProfondeur() {
  const racine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let annule = false;
    chargerMoteur()
      .then(() => {
        if (!annule && racine.current && window.ScrollCraft) window.ScrollCraft.mount(racine.current);
      })
      .catch((e) => console.error("[heros-v2]", e));
    return () => {
      annule = true;
    };
  }, []);

  return (
    <div ref={racine} className="hv2-racine">
      <section className="hv2-acte" data-sc-act="pin" data-sc-span="2.6" aria-label="À la une">
        <div className="hv2-scene" data-sc-stage>
          {/* Plan 1 : la piste et les estrades (plaque propre) */}
          <div className="hv2-cadre hv2-fond" aria-hidden="true">
            <img
              src="/images/heros-v2/plaque.webp"
              srcSet="/images/heros-v2/plaque-1280.webp 1280w, /images/heros-v2/plaque.webp 2048w"
              sizes="(max-width: 860px) 200vw, 110vw"
              alt=""
              width={2048}
              height={1360}
              fetchPriority="high"
            />
          </div>

          {/* Plan 2 : le titre, entre la piste et le tracteur */}
          <div className="hv2-titre">
            <p className="hv2-surtitre">Saint-Isidore, en Beauce · Entrée gratuite</p>
            <h1 className="hv2-nom">
              <span>Expo</span> <span>St-Isidore</span>
            </h1>
          </div>

          {/* Plans 3 et 4 : le tracteur (vrai, détouré) et sa fumée */}
          <div className="hv2-cadre hv2-avant" aria-hidden="true">
            <img
              className="hv2-fumee"
              src="/images/heros-v2/fumee.webp"
              alt=""
              width={1000}
              height={994}
            />
            <img
              className="hv2-tracteur"
              src="/images/heros-v2/tracteur.webp"
              srcSet="/images/heros-v2/tracteur-800.webp 441w, /images/heros-v2/tracteur.webp 882w"
              sizes="(max-width: 860px) 90vw, 50vw"
              alt="Tracteur de tire rouge, roues avant levées, qui tire le traîneau au crépuscule devant les estrades pleines"
              width={882}
              height={494}
            />
          </div>

          {/* Le rideau de poussière : part du tuyau d'échappement et couvre l'écran */}
          <div className="hv2-rideau" aria-hidden="true" />
          <img className="hv2-poussiere" src="/images/heros-v2/poussiere.webp" alt="" width={700} height={695} aria-hidden="true" />

          {/* Le message de la saison, dévoilé par la poussière */}
          <div className="hv2-message" data-sc-cue="0.72" data-sc-rise="18">
            <div className="seulement-hiver">
              <p className="billet"><span>Remisage intérieur</span><span>Entrées en cours</span></p>
              <h2 className="hv2-messageTitre">Votre roulotte, <span>au sec cet hiver</span></h2>
              <p className="hv2-intro">
                Roulottes, VR, autos, bateaux et motos, à l&apos;intérieur des bâtiments de l&apos;Expo. Envoyez vos dimensions, on regarde l&apos;espace.{" "}
                <strong>Et on se revoit en juillet 2027.</strong>
              </p>
              <div className="groupe-boutons">
                <Link className="bouton bouton--orange" href="/remisage">Envoyer mes dimensions <span className="fleche" aria-hidden="true">→</span></Link>
                <a className="bouton bouton--contour" href="tel:+14188829619">418 882-9619</a>
              </div>
            </div>
            <div className="seulement-ete">
              <p className="billet"><span>Entrée gratuite</span><span>depuis 1982</span></p>
              <h2 className="hv2-messageTitre">On se revoit <span>en juillet 2027</span></h2>
              <p className="hv2-intro">Six jours d&apos;agriculture, de tracteurs et de fête à Saint-Isidore, en Beauce. Les dates 2027 seront annoncées au printemps.</p>
              <div className="groupe-boutons">
                <Link className="bouton bouton--orange" href="/programmation">Voir la programmation <span className="fleche" aria-hidden="true">→</span></Link>
                <Link className="bouton bouton--contour" href="/photos">Les photos de l&apos;Expo</Link>
              </div>
            </div>
          </div>

          <p className="hv2-legende">
            Tire de tracteurs à Saint-Isidore. Photo&nbsp;: ELZEPHOTO, retouchée; fumée générée par IA (image d&apos;illustration).
          </p>
        </div>
      </section>
    </div>
  );
}
