"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./HerosVideo.css";

// Héros de l'accueil, version 2 (essai local, page /accueil-v2).
// Une vraie photo de l'Expo, animée par IA (Higgsfield, modèle Kling), joue en fond et en boucle.
// Le message de la saison est visible tout de suite : rien à faire défiler.
// La boucle est faite dans le navigateur : deux lecteurs du même fichier se relaient avec un fondu
// d'une seconde, pour cacher le saut entre la fin et le début de la vidéo.
// Sans JavaScript, avec « réduire les animations » ou en mode économie de données : la photo fixe.

const FONDU = 1.2; // secondes

const SCENES = {
  hiver: {
    video: "/videos/heros-aerien.mp4",
    affiche: "/images/heros-v2/aerien.webp",
    legende: "Le site de l'Expo vu du ciel. Photo agrandie et animée par IA (Higgsfield).",
  },
  ete: {
    video: "/videos/heros-tire-nuit.mp4",
    affiche: "/images/photos/tire-fumee-soir.webp",
    legende: "Tire de tracteurs à Saint-Isidore. Photo : ELZEPHOTO, animée par IA (Higgsfield).",
  },
} as const;

type Saison = keyof typeof SCENES;

// La saison est posée sur <html> par le petit script du <head> (layout.tsx); elle ne change pas
// pendant la visite. Côté serveur, c'est l'hiver (comme le site sans JavaScript).
const lireSaison = (): Saison => (document.documentElement.classList.contains("saison-ete") ? "ete" : "hiver");
const sAbonner = () => () => {};

export default function HerosVideo() {
  const lecteurA = useRef<HTMLVideoElement>(null);
  const lecteurB = useRef<HTMLVideoElement>(null);
  const saison = useSyncExternalStore(sAbonner, lireSaison, () => "hiver" as Saison);
  const [enPause, setEnPause] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    const a = lecteurA.current;
    const b = lecteurB.current;
    if (!a || !b) return;
    const reduire = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const economie = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduire || economie) return;

    const src = SCENES[saison].video;
    a.src = src;
    b.src = src;
    let actif = a;
    let attente = b;
    let relais = false;

    const surTemps = () => {
      if (relais || pauseRef.current || !actif.duration) return;
      if (actif.currentTime < actif.duration - FONDU) return;
      relais = true;
      attente.currentTime = 0;
      attente.play().catch(() => {});
      attente.classList.add("est-visible");
      actif.classList.remove("est-visible");
      const ancien = actif;
      setTimeout(() => {
        ancien.pause();
        relais = false;
      }, FONDU * 1000);
      [actif, attente] = [attente, actif];
    };

    a.addEventListener("timeupdate", surTemps);
    b.addEventListener("timeupdate", surTemps);
    a.play()
      .then(() => {
        a.classList.add("est-visible");
        setVideoActive(true);
      })
      .catch(() => {}); // lecture automatique refusée : la photo fixe reste

    return () => {
      a.removeEventListener("timeupdate", surTemps);
      b.removeEventListener("timeupdate", surTemps);
      a.pause();
      b.pause();
    };
  }, [saison]);

  function basculer() {
    const visibles = [lecteurA.current, lecteurB.current].filter((v): v is HTMLVideoElement => !!v);
    const actif = visibles.find((v) => v.classList.contains("est-visible"));
    const pause = !enPause;
    pauseRef.current = pause;
    setEnPause(pause);
    if (!actif) return;
    if (pause) visibles.forEach((v) => v.pause());
    else actif.play().catch(() => {});
  }

  const scene = SCENES[saison];

  return (
    <section className="hvid" aria-label="À la une">
      <div className="hvid__media" aria-hidden="true">
        <img className="hvid__affiche" src={scene.affiche} alt="" width={1600} height={1067} fetchPriority="high" />
        <video ref={lecteurA} className="hvid__video" muted playsInline preload="auto" />
        <video ref={lecteurB} className="hvid__video" muted playsInline preload="auto" />
        <div className="hvid__voile" />
      </div>

      <div className="contenu hvid__contenu">
        <p className="hvid__surtitre">Expo St-Isidore · Saint-Isidore, en Beauce</p>
        <div className="seulement-hiver">
          <p className="billet"><span>Remisage intérieur</span><span>Entrées en cours</span></p>
          <h1 className="une__titre hvid__titre">Votre roulotte, <span>au sec cet hiver</span></h1>
          <p className="une__intro hvid__intro">
            Roulottes, VR, autos, bateaux et motos, à l&apos;intérieur des bâtiments de l&apos;Expo. Assuré, plus de 20 ans
            d&apos;expérience. Envoyez vos dimensions, on regarde l&apos;espace. <strong>Et on se revoit en juillet 2027</strong> pour la 45<sup>e</sup> Expo.
          </p>
          <div className="groupe-boutons">
            <Link className="bouton bouton--orange" href="/remisage">Envoyer mes dimensions <span className="fleche" aria-hidden="true">→</span></Link>
            <a className="bouton bouton--contour hvid__contour" href="tel:+14188829619">418 882-9619</a>
          </div>
        </div>
        <div className="seulement-ete">
          <p className="billet"><span>Entrée gratuite</span><span>depuis 1982</span></p>
          <h1 className="une__titre hvid__titre">On se revoit <span>en juillet 2027</span></h1>
          <p className="une__intro hvid__intro">Six jours d&apos;agriculture, de tracteurs et de fête à Saint-Isidore, en Beauce. Les dates 2027 seront annoncées au printemps.</p>
          <div className="groupe-boutons">
            <Link className="bouton bouton--orange" href="/programmation">Voir la programmation <span className="fleche" aria-hidden="true">→</span></Link>
            <Link className="bouton bouton--contour hvid__contour" href="/photos">Revivre 2026 en photos</Link>
          </div>
        </div>
      </div>

      <div className="hvid__pied">
        <p className="hvid__legende">{scene.legende}</p>
        {videoActive && (
          <button className="hvid__pause" type="button" onClick={basculer} aria-pressed={enPause}>
            {enPause ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5z" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
            )}
            {enPause ? "Lire la vidéo" : "Arrêter la vidéo"}
          </button>
        )}
      </div>
    </section>
  );
}
