"use client";

import { useRef, useState } from "react";
import type { Media } from "@/lib/donnees";
import { ALBUMS } from "@/lib/albums";


/** Albums de photos + vidéos, et visionneuse plein écran (reprise de site/js/photos.js). */
export default function Galerie({ medias }: { medias: Media[] }) {
  const photos = medias.filter((m) => m.type === "photo");
  const videos = medias.filter((m) => m.type === "video");
  const albums = [...new Set(photos.map((m) => m.categorie))].sort(
    (a, b) => Object.keys(ALBUMS).indexOf(a) - Object.keys(ALBUMS).indexOf(b),
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const [courant, setCourant] = useState(0);
  const declencheur = useRef<HTMLElement | null>(null);

  const ouvrir = (e: React.MouseEvent<HTMLAnchorElement>, m: Media) => {
    if (!dialog.current?.showModal) return; // vieux navigateur : le lien ouvre la photo
    e.preventDefault();
    declencheur.current = e.currentTarget;
    setCourant(photos.indexOf(m));
    dialog.current.showModal();
  };
  const aller = (d: number) => setCourant((c) => (c + d + photos.length) % photos.length);
  const p = photos[courant];

  return (
    <>
      {albums.map((album) => {
        const liste = photos.filter((m) => m.categorie === album);
        return (
          <section key={album} className="galerie-section" id={`album-${album}`} aria-labelledby={`t-${album}`}>
            <div className="galerie-section__titre">
              <h2 id={`t-${album}`}>{ALBUMS[album] ?? album}</h2>
              <span>{liste.length} photo{liste.length > 1 ? "s" : ""}</span>
            </div>
            <ul className={album === "tire" ? "galerie" : "galerie galerie--bande"}>
              {liste.map((m) => (
                <li key={m.id}>
                  <a href={m.url} onClick={(e) => ouvrir(e, m)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.vignette || m.url} alt={m.alt} width={800} height={533} loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {videos.length > 0 && (
        <section className="galerie-section" id="album-videos" aria-labelledby="t-videos">
          <div className="galerie-section__titre">
            <h2 id="t-videos">Vidéos</h2>
            <span>{videos.length} vidéo{videos.length > 1 ? "s" : ""}</span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.id}>
                <a href={v.url} rel="noopener" className="group block bg-creme cadre-affiche overflow-hidden transition-transform hover:-translate-y-1">
                  <span className="relative block aspect-video bg-planche">
                    {v.vignette && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.vignette} alt="" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" loading="lazy" />
                    )}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-encre bg-rouge text-creme text-2xl shadow-affiche-sm" aria-hidden="true">▶</span>
                    </span>
                  </span>
                  <span className="block px-4 py-3 font-etiquette font-bold text-[18px] text-encre">{v.alt}</span>
                  {v.credit && <span className="block px-4 pb-3 -mt-2 text-[14px] text-gris-brun">{v.credit}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <dialog
        ref={dialog}
        className="visionneuse"
        aria-label="Photo agrandie"
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") aller(-1); if (e.key === "ArrowRight") aller(1); }}
        onClose={() => declencheur.current?.focus()}
      >
        {p && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.alt} />
            <figcaption>{p.alt} ({courant + 1} de {photos.length}){p.credit ? ` · ${p.credit}` : ""}</figcaption>
          </figure>
        )}
        <div className="visionneuse__barre">
          <button type="button" onClick={() => aller(-1)} aria-label="Photo précédente">← Précédente</button>
          <button type="button" onClick={() => dialog.current?.close()}>Fermer</button>
          <button type="button" onClick={() => aller(1)} aria-label="Photo suivante">Suivante →</button>
        </div>
      </dialog>
    </>
  );
}
