"use client";

import Link from "next/link";
import { useState } from "react";

// Pellicule de l'accueil v2 : vraies photos de la page Facebook de l'Expo (droits à confirmer,
// voir A-CONFIRMER.md), choisies pour ne pas répéter celles déjà ailleurs sur l'accueil.
// Elle défile lentement, s'arrête au survol, au clavier ou avec le bouton.
const PHOTOS = [
  { fichier: "tire-noir-blanc", legende: "Tire de tracteurs modifiés", credit: null, alt: "Tracteur modifié noir et blanc qui tire le traîneau devant les estrades" },
  { fichier: "ayrshire-championne", legende: "Championne Ayrshire", credit: "Lyse Neuville Photography", alt: "Vache Ayrshire rousse et blanche décorée de rosettes, devant son trophée de championne" },
  { fichier: "bbq-saucisses", legende: "Soirée Grill Together", credit: "Cynthia Fillion Photographe", alt: "Saucisses qui grillent dans un fumoir" },
  { fichier: "tire-mini-jour", legende: "Les mini tracteurs", credit: null, alt: "Mini tracteur modifié rouge qui tire le traîneau sur la piste, devant les bâtiments" },
  { fichier: "holstein-rangee", legende: "Les Holstein, prêtes pour le jugement", credit: "ELZEPHOTO", alt: "Longue rangée de vaches Holstein alignées sur la paille, vues de côté" },
  { fichier: "tire-bleu-nuit", legende: "Sous les projecteurs", credit: "ELZEPHOTO", alt: "Tracteur modifié bleu, roues avant levées, dans la poussière sous les projecteurs" },
  { fichier: "paon", legende: "La grange des petits animaux", credit: null, alt: "Paon bleu et vert dans un enclos de paille" },
  { fichier: "tire-wild-thing", legende: "Wild Thing, la nuit", credit: "ELZEPHOTO", alt: "Pick-up rouge « Wild Thing » qui tire le traîneau sous les projecteurs" },
  { fichier: "jugement-ayrshire", legende: "Le juge compare", credit: "Lyse Neuville Photography", alt: "Juges et éleveurs en blanc qui comparent une vache Holstein et une Ayrshire sous le chapiteau" },
  { fichier: "bbq-poulet", legende: "Sur la braise", credit: "Cynthia Fillion Photographe", alt: "Grille de BBQ chargée de poulet au-dessus des braises" },
];

function Groupe({ copie }: { copie?: boolean }) {
  return (
    <ul className="pellicule__groupe" aria-hidden={copie || undefined}>
      {PHOTOS.map((p) => (
        <li key={p.fichier}>
          <figure className="pellicule__photo">
            <img
              src={`/images/photos/${p.fichier}-400.webp`}
              srcSet={`/images/photos/${p.fichier}-400.webp 400w, /images/photos/${p.fichier}-800.webp 800w`}
              sizes="(max-width: 760px) 220px, 340px"
              alt={copie ? "" : p.alt}
              width={400}
              height={267}
              loading="lazy"
            />
            <figcaption>
              {p.legende}
              {p.credit && <small>Photo&nbsp;: {p.credit}</small>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export default function PelliculePhotos() {
  const [arretee, setArretee] = useState(false);
  return (
    <section className={`pellicule${arretee ? " est-arretee" : ""}`} aria-labelledby="titre-pellicule">
      <div className="contenu pellicule__entete">
        <h2 id="titre-pellicule" className="pellicule__titre">L&apos;Expo en images</h2>
        <div className="pellicule__actions">
          <button className="hvid__pause" type="button" onClick={() => setArretee(!arretee)} aria-pressed={arretee}>
            {arretee ? "Faire défiler" : "Arrêter le défilement"}
          </button>
          <Link className="pellicule__lien" href="/photos">Toutes les photos <span aria-hidden="true">&nbsp;→</span></Link>
        </div>
      </div>
      <div className="pellicule__piste">
        <Groupe />
        <Groupe copie />
      </div>
    </section>
  );
}
