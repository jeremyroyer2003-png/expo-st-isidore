"use client";

import { useEffect, useState } from "react";

/**
 * Grande année qui suit la lecture d'une ligne du temps (page Notre histoire).
 * Elle affiche l'année de l'étape qui passe au milieu de l'écran. Décorative : la ligne du temps
 * reste la vraie information (aria-hidden ici). Sans JavaScript, elle montre la première année.
 */
export default function CompteurAnnees({ cible, depart, detail = "" }: { cible: string; depart: string; detail?: string }) {
  const [etape, setEtape] = useState({ annee: depart, detail });

  useEffect(() => {
    const liste = document.getElementById(cible);
    if (!liste) return;
    const items = Array.from(liste.querySelectorAll<HTMLElement>(":scope > li"));
    const lire = (li: HTMLElement) => {
      const date = li.querySelector(".ligne-temps__date");
      const detail = date?.querySelector("small")?.textContent ?? "";
      const annee = (date?.textContent ?? "").replace(detail, "").trim();
      const titre = li.querySelector("h3")?.textContent ?? "";
      return { annee, detail: titre };
    };
    const o = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setEtape(lire(visible.target as HTMLElement));
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    items.forEach((li) => o.observe(li));
    return () => o.disconnect();
  }, [cible]);

  return (
    <div className="compteur-annees" aria-hidden="true">
      <span key={etape.annee} className="compteur-annees__annee">{etape.annee}</span>
      <span key={`d-${etape.detail}`} className="compteur-annees__detail">{etape.detail}</span>
    </div>
  );
}
