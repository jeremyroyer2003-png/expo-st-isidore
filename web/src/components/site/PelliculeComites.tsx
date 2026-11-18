"use client";

import { useState } from "react";
import type { Media } from "@/lib/donnees";
import "./PelliculeComites.css";

/**
 * « Les comités au fil des ans » (page Notre histoire) : photos d'archive de l'album « comites » de la médiathèque.
 * Année = champ « Ordre », noms = description. Les photos défilent vers la gauche quand il y en a assez;
 * sinon elles restent en rangée. La photo est montrée au complet (jamais recadrée), et s'ouvre en grand au clic.
 */
export default function PelliculeComites({ photos }: { photos: Media[] }) {
  const [arretee, setArretee] = useState(false);
  const defile = photos.length >= 4;

  const groupe = (copie = false) => (
    <ul className="comites__groupe" aria-hidden={copie || undefined}>
      {photos.map((p) => (
        <li key={p.id}>
          <figure className="comites__photo">
            <span className="comites__ruban" aria-hidden="true" />
            <a href={p.url} target="_blank" rel="noopener" tabIndex={copie ? -1 : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.vignette || p.url} alt={copie ? "" : `Le comité de l'Expo en ${p.ordre} : ${p.alt}`} loading="lazy" />
            </a>
            <figcaption>
              <span className="comites__annee">{p.ordre}</span>
              <span className="comites__noms">{p.alt}</span>
              {p.credit && <small>Photo&nbsp;: {p.credit}</small>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`comites${defile ? " comites--defile" : ""}${arretee ? " est-arretee" : ""}`}>
      {defile && (
        <p className="comites__actions">
          <button type="button" className="comites__pause" onClick={() => setArretee(!arretee)} aria-pressed={arretee}>
            {arretee ? "Faire défiler" : "Arrêter le défilement"}
          </button>
        </p>
      )}
      <div className="comites__fenetre">
        <div className="comites__piste">
          {groupe()}
          {defile && groupe(true)}
        </div>
      </div>
      <p className="comites__aide">Cliquez sur une photo pour la voir en grand.</p>
    </div>
  );
}
