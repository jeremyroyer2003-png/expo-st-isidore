"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LIENS = [
  { href: "/programmation", texte: "Programmation" },
  { href: "/tire-de-tracteurs", texte: "Tire de tracteurs" },
  { href: "/exposants", texte: "Exposants" },
  { href: "/photos", texte: "Photos" },
  { href: "/histoire", texte: "Notre histoire" },
  { href: "/contact", texte: "Infos et contact" },
  { href: "/location", texte: "Location de salle" },
  { href: "/danse", texte: "Danse country" },
];

export default function Entete() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const [cheminVu, setCheminVu] = useState(chemin);

  // Changement de page : le menu se referme
  if (cheminVu !== chemin) {
    setCheminVu(chemin);
    setOuvert(false);
  }

  useEffect(() => {
    const maj = () => setDefile(window.scrollY > 8);
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    return () => window.removeEventListener("scroll", maj);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    document.addEventListener("keydown", touche);
    return () => document.removeEventListener("keydown", touche);
  }, [ouvert]);

  const actif = (href: string) => (chemin === href || chemin.startsWith(href + "/") ? "page" : undefined);

  return (
    <header className={"entete" + (defile ? " est-defile" : "")}>
      <div className="contenu entete__barre">
        <Link className="entete__logo" href="/" aria-label="Expo St-Isidore – Bassin de la Chaudière, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-expo.webp" alt="Expo St-Isidore – Bassin de la Chaudière" width={124} height={72} />
        </Link>
        <button
          ref={bouton}
          className="menu-bouton"
          type="button"
          aria-expanded={ouvert}
          aria-controls="nav-principale"
          onClick={() => setOuvert(!ouvert)}
        >
          <span className="menu-bouton__icone" aria-hidden="true"><span></span></span>
          Menu
        </button>
        <nav id="nav-principale" className={"nav" + (ouvert ? " est-ouvert" : "")} aria-label="Navigation principale">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={actif(l.href)}>{l.texte}</Link>
          ))}
          <Link className="nav__remisage" href="/remisage" aria-current={actif("/remisage")}>Remisage d&apos;hiver</Link>
        </nav>
      </div>
    </header>
  );
}
