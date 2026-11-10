"use client";

import { useEffect } from "react";

// Reprise de site/js/accueil.js : diaporama du héros (été seulement) et onglets « ambiances ».
// Le balisage vient tel quel du site statique; ce composant ne fait qu'y brancher le comportement.
export default function ComportementsAccueil() {
  useEffect(() => {
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nettoyage: (() => void)[] = [];

    /* ---------- Diaporama ---------- */
    const DELAI = 6500;
    const diapos = Array.from(document.querySelectorAll<HTMLElement>(".une__diapo"));
    const legende = document.querySelector<HTMLElement>(".une__legende");
    const hiver = document.documentElement.classList.contains("saison-hiver");
    if (diapos.length > 1 && legende && !hiver) {
      const texte = legende.querySelector<HTMLElement>(".une__legende-texte")!;
      const points = legende.querySelector<HTMLElement>(".une__points")!;
      const pause = legende.querySelector<HTMLButtonElement>(".une__pause")!;
      let courante = 0;
      let minuterie: number | undefined;
      let arrete = calme;
      points.replaceChildren();

      const montrer = (i: number) => {
        diapos[courante].classList.remove("est-active");
        diapos[courante].setAttribute("aria-hidden", "true");
        courante = (i + diapos.length) % diapos.length;
        const img = diapos[courante].querySelector("img")!;
        img.loading = "eager";
        diapos[courante].classList.add("est-active");
        diapos[courante].removeAttribute("aria-hidden");
        texte.textContent = img.dataset.legende ?? "";
        points.querySelectorAll(".une__point").forEach((p, n) => p.setAttribute("aria-current", String(n === courante)));
      };
      const relancer = () => {
        window.clearInterval(minuterie);
        if (!arrete) minuterie = window.setInterval(() => montrer(courante + 1), DELAI);
      };
      diapos.forEach((diapo, i) => {
        const img = diapo.querySelector("img")!;
        const point = document.createElement("button");
        point.type = "button";
        point.className = "une__point";
        point.setAttribute("aria-label", `Photo ${i + 1} : ${img.dataset.legende ?? ""}`);
        point.addEventListener("click", () => { montrer(i); relancer(); });
        points.appendChild(point);
        if (i) diapo.setAttribute("aria-hidden", "true");
      });
      const basculer = () => {
        arrete = !arrete;
        pause.setAttribute("aria-pressed", String(arrete));
        pause.setAttribute("aria-label", arrete ? "Reprendre le défilement des photos" : "Arrêter le défilement des photos");
        relancer();
      };
      pause.addEventListener("click", basculer);
      if (calme) {
        pause.setAttribute("aria-pressed", "true");
        pause.setAttribute("aria-label", "Reprendre le défilement des photos");
      }
      const visibilite = () => (document.hidden ? window.clearInterval(minuterie) : relancer());
      document.addEventListener("visibilitychange", visibilite);
      legende.hidden = false;
      montrer(0);
      relancer();
      nettoyage.push(() => {
        window.clearInterval(minuterie);
        pause.removeEventListener("click", basculer);
        document.removeEventListener("visibilitychange", visibilite);
      });
    }

    /* ---------- Onglets des ambiances ---------- */
    const liste = document.querySelector<HTMLElement>(".choix__onglets");
    if (liste) {
      const onglets = Array.from(liste.querySelectorAll<HTMLElement>('[role="tab"]'));
      const panneaux = onglets.map((o) => document.getElementById(o.getAttribute("aria-controls") ?? "")!);
      const choisir = (n: number, focus = false) => {
        onglets.forEach((o, i) => {
          const actif = i === n;
          o.setAttribute("aria-selected", String(actif));
          o.tabIndex = actif ? 0 : -1;
          panneaux[i].hidden = !actif;
          panneaux[i].classList.toggle("vient-d-ouvrir", actif);
        });
        if (focus) onglets[n].focus();
      };
      const ecouteurs = onglets.map((o, i) => {
        const clic = () => choisir(i);
        const touche = (e: KeyboardEvent) => {
          const cible = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: onglets.length - 1 } as Record<string, number>)[e.key];
          if (cible === undefined) return;
          e.preventDefault();
          choisir((cible + onglets.length) % onglets.length, true);
        };
        o.addEventListener("click", clic);
        o.addEventListener("keydown", touche);
        return () => { o.removeEventListener("click", clic); o.removeEventListener("keydown", touche); };
      });
      liste.hidden = false;
      panneaux.forEach((p) => { p.tabIndex = 0; });
      choisir(0);
      panneaux[0].classList.remove("vient-d-ouvrir");
      nettoyage.push(...ecouteurs);
    }

    return () => nettoyage.forEach((f) => f());
  }, []);
  return null;
}
