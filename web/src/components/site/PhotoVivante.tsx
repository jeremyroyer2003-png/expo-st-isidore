"use client";

import { useEffect, useRef, useState } from "react";

// « Photo vivante » : une vraie photo dont une courte vidéo (photo animée par IA, Higgsfield) joue par-dessus, en boucle.
// - La photo reste l'image de base : sans JavaScript, avec « réduire les animations » ou en économie de données, rien ne bouge.
// - La vidéo n'est téléchargée que lorsque la photo arrive à l'écran, et se met en pause quand elle en sort.
// - La boucle est faite par deux lecteurs qui se relaient avec un fondu, pour cacher le saut de fin de vidéo.
// À placer dans un parent en position relative : l'élément remplit son parent, par-dessus la photo.

const FONDU = 1; // secondes

export default function PhotoVivante({ video, className = "" }: { video: string; className?: string }) {
  const boite = useRef<HTMLDivElement>(null);
  const lecteurA = useRef<HTMLVideoElement>(null);
  const lecteurB = useRef<HTMLVideoElement>(null);
  const pauseRef = useRef(false);
  const [active, setActive] = useState(false);
  const [enPause, setEnPause] = useState(false);

  useEffect(() => {
    const a = lecteurA.current;
    const b = lecteurB.current;
    const zone = boite.current;
    if (!a || !b || !zone) return;
    const reduire = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const economie = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduire || economie) return;

    let actif = a;
    let attente = b;
    let relais = false;
    let charge = false;
    let aLecran = false;

    const surTemps = () => {
      if (relais || pauseRef.current || !actif.duration) return;
      if (actif.currentTime < actif.duration - FONDU) return;
      relais = true;
      attente.currentTime = 0;
      attente.play().catch(() => {});
      attente.style.opacity = "1";
      actif.style.opacity = "0";
      const ancien = actif;
      setTimeout(() => {
        ancien.pause();
        relais = false;
      }, FONDU * 1000);
      [actif, attente] = [attente, actif];
    };
    a.addEventListener("timeupdate", surTemps);
    b.addEventListener("timeupdate", surTemps);

    const observateur = new IntersectionObserver(([entree]) => {
      aLecran = entree.isIntersecting;
      if (!aLecran) {
        a.pause();
        b.pause();
        return;
      }
      if (!charge) {
        charge = true;
        a.src = video;
        b.src = video;
      }
      if (pauseRef.current) return;
      actif.play()
        .then(() => {
          actif.style.opacity = "1";
          setActive(true);
        })
        .catch(() => {}); // lecture automatique refusée : la photo fixe reste
    }, { threshold: 0.35 });
    observateur.observe(zone);

    return () => {
      observateur.disconnect();
      a.removeEventListener("timeupdate", surTemps);
      b.removeEventListener("timeupdate", surTemps);
      a.pause();
      b.pause();
    };
  }, [video]);

  function basculer() {
    const lecteurs = [lecteurA.current, lecteurB.current].filter((v): v is HTMLVideoElement => !!v);
    const pause = !enPause;
    pauseRef.current = pause;
    setEnPause(pause);
    if (pause) lecteurs.forEach((v) => v.pause());
    else lecteurs.find((v) => v.style.opacity === "1")?.play().catch(() => {});
  }

  const lecteur = "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 ease-linear motion-reduce:hidden";
  return (
    <div ref={boite} className={`absolute inset-0 ${className}`}>
      <video ref={lecteurA} className={lecteur} muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      <video ref={lecteurB} className={lecteur} muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      {active && (
        <button type="button" onClick={basculer} aria-pressed={enPause}
          className="absolute right-2 top-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-3 bg-encre/75 text-creme font-etiquette font-bold text-[14px] hover:bg-encre focus-visible:bg-encre">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            {enPause
              ? <path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5z" />
              : <><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></>}
          </svg>
          <span className="sr-only">{enPause ? "Lire l'animation de la photo" : "Arrêter l'animation de la photo"}</span>
        </button>
      )}
    </div>
  );
}
