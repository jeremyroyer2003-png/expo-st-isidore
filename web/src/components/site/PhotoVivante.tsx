"use client";

import { useEffect, useRef } from "react";

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
      if (relais || !actif.duration) return;
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
      actif.play()
        .then(() => {
          actif.style.opacity = "1";
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

  const lecteur = "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 ease-linear motion-reduce:hidden";
  return (
    <div ref={boite} className={`absolute inset-0 ${className}`}>
      <video ref={lecteurA} className={lecteur} muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      <video ref={lecteurB} className={lecteur} muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
