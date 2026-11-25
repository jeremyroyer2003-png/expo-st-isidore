"use client";

import { useEffect } from "react";

// Essai : le site posé comme un tableau sur un grand paysage : ?fond=photo ou ?fond=peinture, ?fond=0 pour revenir.
// Le choix est gardé dans ce navigateur (localStorage), même après avoir fermé l’onglet pour comparer page par page. À retirer une fois le fond choisi.
const FONDS = ["photo", "peinture"];

export default function EssaiFond() {
  useEffect(() => {
    const demande = new URLSearchParams(window.location.search).get("fond");
    if (demande !== null) localStorage.setItem("essai-fond", demande);
    const fond = localStorage.getItem("essai-fond");
    const html = document.documentElement;
    FONDS.forEach((f) => html.classList.toggle(`fond-${f}`, f === fond));
  });
  return null;
}
