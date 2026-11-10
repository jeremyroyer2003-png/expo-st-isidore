"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Apparition au défilement (reprise de site.js) : les blocs de chaque section montent l'un après l'autre.
// Sans IntersectionObserver ou avec « réduire les animations », tout reste visible.
const SELECTEUR =
  "main > section:not(.heros) > .contenu > *, .archives__haut > *, .mosaique > li, .annees > li, .venir > *, [data-revele]";
const EXCLUS = ".archives__haut, .mosaique, .annees, .venir, form, .formulaire, [role=\"tablist\"]";

export default function Revele() {
  const chemin = usePathname();
  useEffect(() => {
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || calme) return;
    const obs = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("est-visible");
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll<HTMLElement>(SELECTEUR).forEach((bloc) => {
      if (bloc.matches(EXCLUS) || bloc.classList.contains("est-visible")) return;
      const rang = bloc.parentElement ? Array.prototype.indexOf.call(bloc.parentElement.children, bloc) : 0;
      bloc.style.setProperty("--delai", Math.min(rang, 6) * 0.07 + "s");
      bloc.classList.add("revele");
      obs.observe(bloc);
    });
    return () => obs.disconnect();
  }, [chemin]);
  return null;
}
